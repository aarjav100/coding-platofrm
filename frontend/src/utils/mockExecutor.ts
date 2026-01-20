
interface ExecutionResult {
    output: string;
    isError: boolean;
    executionTime?: string;
}

export const executeCode = async (
    code: string,
    language: string,
    input?: string
): Promise<ExecutionResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const startTime = performance.now();

            try {
                if (language === 'javascript' || language === 'typescript') {
                    // capture console.log
                    let logs: string[] = [];
                    const originalLog = console.log;
                    console.log = (...args) => {
                        logs.push(args.map(a =>
                            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                        ).join(' '));
                    };

                    // Safe-ish execution using Function constructor
                    // We wrap it to return the result of the last expression if possible, 
                    // or rely on console.log
                    try {
                        // Very basic simulation of stdin/stdout if needed, but mostly just running the code
                        const func = new Function(code);
                        func();
                    } catch (e: any) {
                        logs.push(`Error: ${e.message}`);
                    } finally {
                        console.log = originalLog;
                    }

                    const endTime = performance.now();
                    resolve({
                        output: logs.length > 0 ? logs.join('\n') : "No output occurred (use console.log)",
                        isError: logs.some(l => l.startsWith('Error:')),
                        executionTime: `${(endTime - startTime).toFixed(2)}ms`
                    });
                    return;
                }

                // Mock for other languages
                let mockOutput = "";

                // Check if input was provided
                if (input) {
                    mockOutput += `Input provided: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}\n`;
                    mockOutput += `Processing...\n`;
                }

                if (code.includes('print') || code.includes('console.log') || code.includes('cout') || code.includes('System.out.println')) {
                    // Try to extract string inside print statements roughly
                    const match = code.match(/["']([^"']+)["']/);
                    // If match found and it's not just whitespace, use it
                    if (match && match[1].trim().length > 0) {
                        mockOutput += `Output: ${match[1]}`;
                    } else if (language === 'cpp' && code.includes('cout')) {
                        mockOutput += "Output: (Program executed successfully)";
                    } else {
                        mockOutput += "Program executed successfully.";
                    }
                } else {
                    mockOutput += "Program executed. (No output detected)";
                }

                const endTime = performance.now();
                resolve({
                    output: mockOutput + `\n\n[Note: ${language} execution is simulated in browser]`,
                    isError: false,
                    executionTime: `${(endTime - startTime).toFixed(2)}ms`
                });

            } catch (error: any) {
                resolve({
                    output: error.message,
                    isError: true
                });
            }
        }, 500); // Simulate network delay
    });
};
