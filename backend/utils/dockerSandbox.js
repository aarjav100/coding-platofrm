const Docker = require('dockerode'); // Docker client
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const docker = new Docker(); // Connects to socket/pipe automatically

// Language Configuration
const LANGUAGE_CONFIG = {
    python: {
        image: 'python:3.10-alpine',
        command: ['python3', '/app/script.py'],
        extension: 'py',
    },
    javascript: {
        image: 'node:18-alpine',
        command: ['node', '/app/script.js'],
        extension: 'js',
    },
    // Add more languages later (cpp, java etc require compilation steps)
    cpp: {
        image: 'frolvlad/alpine-gxx', // Lightweight C++ image
        command: ['sh', '-c', 'g++ -o /app/out /app/script.cpp && /app/out'],
        extension: 'cpp',
    }
};

/**
 * Execute code in a secure Docker container
 * @param {string} language - Programming language (python, javascript, etc.)
 * @param {string} code - Source code to execute
 * @param {string} input - (Optional) Stdin input for the program
 * @returns {Promise<{output: string, error: string, executionTime: number}>}
 */
const runCodeInUnknown = async (language, code, input = '') => {
    // 1. Validate Language
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
        throw new Error(`Language ${language} not supported`);
    }

    // 2. Prepare Temp Directory & Files
    // storing in backend/temp/<uuid>/
    const submissionId = uuidv4();
    const tempDir = path.join(__dirname, '..', 'temp', submissionId);

    // Ensure temp dir exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `script.${config.extension}`;
    const filePath = path.join(tempDir, fileName);

    // Write code to file
    fs.writeFileSync(filePath, code);

    // If there is input, write it to a file too or pass via stream.
    // For simplicity, we can just pipe the input string to the container's stdin.

    // 3. Create Container
    // We bind mount the temp dir to /app in the container
    // Read-only mount for code? No, we might need to write compiled binaries (C++).
    // So we'll mount it read-write, but the container itself is ephemeral.

    let container;
    const startTime = process.hrtime();
    let stdoutData = '';
    let stderrData = '';
    let isTimeout = false;

    try {
        // Ensure image exists (pull if missing? - might timeout request, better to have them pre-pulled)
        // For now, we assume images are present or auto-pull is fast enough.

        container = await docker.createContainer({
            Image: config.image,
            Cmd: config.command,
            Tty: false,
            NetworkDisabled: true, // NO INTERNET ACCESS
            HostConfig: {
                Binds: [`${tempDir}:/app`], // Map host temp dir to container /app
                Memory: 100 * 1024 * 1024, // 100MB Memory Limit
                NanoCpus: 500000000,      // 0.5 CPU
                AutoRemove: false,        // We remove manually to safely get logs if it crashes fast
            },
            OpenStdin: true, // Need to open stdin to pass input
            StdinOnce: true,
            WorkingDir: '/app',
        });

        // 4. Start & Stream Input
        await container.start();

        // Attach to container to write input and read output
        const stream = await container.attach({
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true
        });

        // Write input to stdin if provided
        if (input) {
            stream.write(input);
        }
        stream.end(); // EOF

        // 5. Wait for completion or Timeout
        const MAX_TIMEOUT = 5000; // 5 seconds

        const runPromise = container.wait();

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                isTimeout = true;
                reject(new Error('Execution Timed Out'));
            }, MAX_TIMEOUT);
        });

        try {
            await Promise.race([runPromise, timeoutPromise]);
        } catch (err) {
            if (isTimeout) {
                await container.kill().catch(() => { }); // Kill if timed out
                throw err;
            }
            throw err;
        }

        // 6. Get Logs
        // Since we didn't use the 'stream' variable to read (it's complex demuxing),
        // we can just grab logs after it finishes/dies. 
        // Note: dockerode .logs() returns buffer with header (demuxing needed) or we use attach.
        // Easiest is to simply read files if the valid way was writing to stdout file, 
        // but standard is using `logs`.
        const logs = await container.logs({
            stdout: true,
            stderr: true
        });

        // Docker logs contain a header (8 bytes) for each frame. We need to strip it if we want raw text?
        // simple helper to clean docker logs (demux)
        const output = demuxLogs(logs);
        stdoutData = output.stdout;
        stderrData = output.stderr;

    } catch (err) {
        stderrData += `\nSystem Error: ${err.message}`;
    } finally {
        // 7. Cleanup
        if (container) {
            try {
                // If container is still running (very rare here if we waited), kill it
                const data = await container.inspect();
                if (data.State.Running) {
                    await container.kill();
                }
                await container.remove();
            } catch (e) {
                console.error("Error removing container:", e);
            }
        }

        // Clean temp files
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Error cleaning temp dir:", e);
        }
    }

    const [seconds, nanoseconds] = process.hrtime(startTime);
    const executionTimeMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    return {
        output: stdoutData.trim(),
        error: stderrData.trim(),
        executionTime: executionTimeMs
    };
};

// Helper: Simple raw log cleaner (Docker sends header bytes)
// This is a naive implementation; proper demuxing checks the first byte (1=stdout, 2=stderr).
function demuxLogs(buffer) {
    // If it's just a string/buffer without multiplexing (Tty: true), it's easier.
    // But we used Tty: false for separation.
    // Docker log stream format: [8 bytes header] [content] ...

    let stdout = '';
    let stderr = '';
    let current = 0;

    while (current < buffer.length) {
        // minimal safety check
        if (current + 8 > buffer.length) break;

        const type = buffer[current]; // 1 = stdout, 2 = stderr
        // bytes 1,2,3 are unused usually
        const size = buffer.readUInt32BE(current + 4);

        const content = buffer.slice(current + 8, current + 8 + size);

        if (type === 1) {
            stdout += content.toString('utf8');
        } else if (type === 2) {
            stderr += content.toString('utf8');
        }

        current += 8 + size;
    }

    return { stdout, stderr };
}


module.exports = { runCodeInUnknown };
