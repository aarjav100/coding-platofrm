import { useState, useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play, RotateCcw, Send, Loader2, CheckCircle, XCircle,
  Settings, Maximize2, Minimize2, Copy, Download, Upload,
  Terminal, FileCode, Lightbulb, Bug, Zap, Minus, Plus, Type,
  Sun, Moon, WrapText, Hash, Keyboard, Clock, Code2, Sparkles
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { executeCode } from '@/utils/mockExecutor';

interface AdvancedCodeEditorProps {
  onSubmit?: (code: string, language: string, isCorrect?: boolean) => void;
  defaultLanguage?: string;
  initialCode?: string;
  expectedOutput?: string;
  problemId?: string;
  showCustomInput?: boolean;
  height?: string;
}

interface TestResult {
  testCaseIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: string;
  isCorrect: boolean | null;
  testResults?: TestResult[];
  summary?: {
    total: number;
    passed: number;
    failed: number;
  };
}

// Language configurations with templates
const languageConfigs = {
  javascript: {
    label: "JavaScript",
    monacoLang: "javascript",
    icon: "🟨",
    template: `// JavaScript Solution
// Read input from stdin and write output to stdout

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line);
});

rl.on('close', () => {
  // Your solution here
  const result = solve(input);
  console.log(result);
});

function solve(input) {
  // Parse input and solve the problem
  return input[0];
}
`
  },
  python: {
    label: "Python",
    monacoLang: "python",
    icon: "🐍",
    template: `# Python Solution
# Read input and solve the problem

def solve():
    # Read input
    line = input()
    
    # Your solution here
    result = line
    
    # Print output
    print(result)

if __name__ == "__main__":
    solve()
`
  },
  cpp: {
    label: "C++",
    monacoLang: "cpp",
    icon: "⚡",
    template: `// C++ Solution
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Read input
    string line;
    getline(cin, line);
    
    // Your solution here
    
    // Print output
    cout << line << endl;
    
    return 0;
}
`
  },
  java: {
    label: "Java",
    monacoLang: "java",
    icon: "☕",
    template: `// Java Solution
import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        String line = sc.nextLine();
        
        // Your solution here
        String result = line;
        
        // Print output
        System.out.println(result);
        
        sc.close();
    }
}
`
  },
  go: {
    label: "Go",
    monacoLang: "go",
    icon: "🔵",
    template: `// Go Solution
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    
    // Read input
    line, _ := reader.ReadString('\\n')
    
    // Your solution here
    
    // Print output
    fmt.Print(line)
}
`
  },
  rust: {
    label: "Rust",
    monacoLang: "rust",
    icon: "🦀",
    template: `// Rust Solution
use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let line = stdin.lock().lines().next().unwrap().unwrap();
    
    // Your solution here
    let result = line;
    
    // Print output
    println!("{}", result);
}
`
  },
  typescript: {
    label: "TypeScript",
    monacoLang: "typescript",
    icon: "🔷",
    template: `// TypeScript Solution
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input: string[] = [];
rl.on('line', (line: string) => {
  input.push(line);
});

rl.on('close', () => {
  const result = solve(input);
  console.log(result);
});

function solve(input: string[]): string {
  // Your solution here
  return input[0];
}
`
  },
  csharp: {
    label: "C#",
    monacoLang: "csharp",
    icon: "🟣",
    template: `// C# Solution
using System;
using System.Collections.Generic;
using System.Linq;

class Solution {
    static void Main(string[] args) {
        // Read input
        string line = Console.ReadLine();
        
        // Your solution here
        string result = line;
        
        // Print output
        Console.WriteLine(result);
    }
}
`
  }
};

type LanguageKey = keyof typeof languageConfigs;

const AdvancedCodeEditor = ({
  onSubmit,
  defaultLanguage = "python",
  initialCode,
  expectedOutput,
  problemId,
  showCustomInput = true,
  height = "500px"
}: AdvancedCodeEditorProps) => {
  const [language, setLanguage] = useState<LanguageKey>(defaultLanguage as LanguageKey);
  const [code, setCode] = useState(initialCode || languageConfigs[language as LanguageKey]?.template || languageConfigs.python.template);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "output" | "testcases">("input");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [wordWrap, setWordWrap] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [tabSize, setTabSize] = useState(2);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const editorRef = useRef<any>(null);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code) {
        setLastSaved(new Date());
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [code]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  // Code stats
  const codeStats = {
    lines: code.split('\n').length,
    characters: code.length,
    words: code.split(/\s+/).filter(Boolean).length,
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as LanguageKey;
    if (languageConfigs[lang]) {
      setLanguage(lang);
      setCode(languageConfigs[lang].template);
      setOutput("");
      setTestResults([]);
      setSummary(null);
    }
  };

  const handleReset = () => {
    if (languageConfigs[language]) {
      setCode(languageConfigs[language].template);
      setOutput("");
      setTestResults([]);
      setSummary(null);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Code copied!", description: "Code has been copied to clipboard" });
  };

  const downloadCode = () => {
    const extensions: Record<LanguageKey, string> = {
      javascript: "js",
      python: "py",
      cpp: "cpp",
      java: "java",
      go: "go",
      rust: "rs",
      typescript: "ts",
      csharp: "cs"
    };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast({ title: "File loaded!", description: `Loaded ${file.name}` });
      };
      reader.readAsText(file);
    }
  };



  const handleRun = async () => {
    setIsRunning(true);
    setOutput("⚡ Running your code...\n");
    setTestResults([]);
    setSummary(null);
    setActiveTab("output");

    try {
      const result = await executeCode(code, language, customInput);

      if (result.isError) {
        setOutput(`❌ Error: ${result.output}`);
      } else {
        setOutput(result.output);
        if (result.executionTime) {
          setOutput(prev => prev + `\n\n⏱️ Execution time: ${result.executionTime}`);
        }
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      setOutput(`❌ Error running code: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("📝 Submitting and evaluating your solution...\n");
    setTestResults([]);
    setSummary(null);
    setActiveTab("testcases");

    // Simulating Submission
    setTimeout(() => {
      const passed = Math.random() > 0.3; // Random success for demo if no logic
      const mockResults: TestResult[] = [
        { testCaseIndex: 1, input: "1 2", expectedOutput: "3", actualOutput: passed ? "3" : "0", passed: passed },
        { testCaseIndex: 2, input: "10 5", expectedOutput: "15", actualOutput: "15", passed: true }, // one always passes
        { testCaseIndex: 3, input: "-1 -1", expectedOutput: "-2", actualOutput: "-2", passed: true },
      ];

      const allPassed = mockResults.every(r => r.passed);

      setTestResults(mockResults);
      setSummary({
        total: 3,
        passed: mockResults.filter(r => r.passed).length,
        failed: mockResults.filter(r => !r.passed).length
      });

      let resultMessage = allPassed
        ? "✅ All test cases passed!"
        : "❌ Some test cases failed.";

      setOutput(resultMessage);

      if (onSubmit) {
        onSubmit(code, language, allPassed);
      }

      toast({
        title: allPassed ? "🎉 All Tests Passed!" : "❌ Some Tests Failed",
        description: allPassed
          ? "Great job! 3/3 test cases passed."
          : "Check the 'Test Results' tab for details.",
        variant: allPassed ? "default" : "destructive"
      });

      setIsSubmitting(false);

    }, 2000);
  };

  const handleGetHint = async () => {
    toast({
      title: "💡 AI Hint",
      description: "Use the AI Mentor button at the bottom-right to get hints and explanations!",
    });
  };

  const handleDebug = async () => {
    toast({
      title: "🔍 Debug Mode",
      description: "Use the AI Mentor with 'Debug' mode to analyze your code for issues!",
    });
  };

  return (
    <div className={cn(
      "border border-border rounded-xl overflow-hidden bg-card shadow-xl transition-all duration-300 relative group",
      isFullscreen && "fixed inset-4 z-50"
    )}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-700 pointer-events-none" />

      {/* Editor Header */}
      <div className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/80 via-muted/50 to-muted/80 border-b border-border backdrop-blur-sm">
        {/* Window controls */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30 hover:bg-red-400 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30 hover:bg-yellow-400 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors cursor-pointer" />
        </div>

        <div className="flex items-center gap-3 ml-0 sm:ml-16">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 sm:w-44 bg-background/60 border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all shadow-sm">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{languageConfigs[language]?.icon}</span>
                  <span className="font-medium">{languageConfigs[language]?.label}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-lg border-border/50">
              {Object.entries(languageConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key} className="hover:bg-primary/10">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <span>{config.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Code Stats */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary border-primary/20 px-2.5 py-1">
              <FileCode className="h-3 w-3" />
              <span className="font-mono text-xs">{codeStats.lines}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono text-xs">{codeStats.characters}</span>
            </Badge>
          </div>

          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <Clock className="h-3 w-3" />
              <span>Saved</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
          <TooltipProvider delayDuration={300}>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".js,.py,.cpp,.java,.go,.rs,.ts,.cs,.txt"
              onChange={handleFileUpload}
            />

            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                >
                  {theme === "vs-dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === "vs-dark" ? "Light theme" : "Dark theme"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload file</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={downloadCode}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={copyCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Settings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Editor Settings
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Customize your coding experience</p>
                </div>

                <div className="p-4 space-y-5">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Font Size
                      </Label>
                      <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{fontSize}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                        disabled={fontSize <= 10}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={10}
                        max={24}
                        step={1}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        disabled={fontSize >= 24}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Tab Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        Tab Size
                      </Label>
                      <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{tabSize} spaces</span>
                    </div>
                    <div className="flex gap-2">
                      {[2, 4, 8].map((size) => (
                        <Button
                          key={size}
                          variant={tabSize === size ? "default" : "outline"}
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setTabSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center gap-2 cursor-pointer" htmlFor="word-wrap">
                        <WrapText className="h-4 w-4" />
                        Word Wrap
                      </Label>
                      <Switch
                        id="word-wrap"
                        checked={wordWrap}
                        onCheckedChange={setWordWrap}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center gap-2 cursor-pointer" htmlFor="line-numbers">
                        <Hash className="h-4 w-4" />
                        Line Numbers
                      </Label>
                      <Switch
                        id="line-numbers"
                        checked={showLineNumbers}
                        onCheckedChange={setShowLineNumbers}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm flex items-center gap-2 cursor-pointer" htmlFor="minimap">
                        <FileCode className="h-4 w-4" />
                        Minimap
                      </Label>
                      <Switch
                        id="minimap"
                        checked={showMinimap}
                        onCheckedChange={setShowMinimap}
                      />
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="p-4 border-t border-border bg-muted/20">
                  <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Keyboard className="h-3 w-3" />
                    Keyboard Shortcuts
                  </h5>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Run Code</span>
                      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl + Enter</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Submit</span>
                      <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl + Shift + Enter</kbd>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden sm:flex items-center gap-1 ml-2 pl-2 border-l border-border/50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-yellow-500/10 transition-colors"
                    onClick={handleGetHint}
                  >
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get AI hint</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-500/10 transition-colors"
                    onClick={handleDebug}
                  >
                    <Bug className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Debug code</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row relative">
        {/* Code Editor */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border/50 relative" style={{ height: isFullscreen ? "calc(100vh - 200px)" : height }}>
          {/* Editor glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none z-10 opacity-50" />
          <Editor
            height="100%"
            language={languageConfigs[language]?.monacoLang || "python"}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={theme}
            onMount={handleEditorDidMount}
            options={{
              fontSize,
              minimap: { enabled: showMinimap },
              scrollBeyondLastLine: false,
              lineNumbers: showLineNumbers ? "on" : "off",
              tabSize,
              automaticLayout: true,
              wordWrap: wordWrap ? "on" : "off",
              padding: { top: 16, bottom: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontLigatures: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              renderLineHighlight: "all",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        {/* Input/Output Panel */}
        <div className="w-full lg:w-96 flex flex-col bg-gradient-to-b from-muted/10 to-transparent" style={{ height: isFullscreen ? "calc(100vh - 200px)" : height }}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border/50 bg-muted/30 p-1 gap-1">
              <TabsTrigger
                value="input"
                className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <Terminal className="h-3 w-3 mr-1.5" />
                Input
              </TabsTrigger>
              <TabsTrigger
                value="output"
                className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <Zap className="h-3 w-3 mr-1.5" />
                Output
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Tests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="flex-1 m-0 p-4">
              <div className="h-full flex flex-col">
                <label className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-2">
                  <Terminal className="h-3 w-3" />
                  Custom Input
                </label>
                <Textarea
                  placeholder="Enter your test input here..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 font-mono text-sm resize-none bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                />
              </div>
            </TabsContent>

            <TabsContent value="output" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed">
                    {output || (
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Run your code to see output here...
                      </span>
                    )}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="testcases" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                {testResults.length > 0 ? (
                  <div className="p-3 space-y-3">
                    {summary && (
                      <div className={cn(
                        "p-4 rounded-xl text-sm font-medium flex items-center justify-between border shadow-lg",
                        summary.failed === 0
                          ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-green-500/10"
                          : "bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/30 shadow-red-500/10"
                      )}>
                        <span className="flex items-center gap-2">
                          {summary.failed === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          Test Results
                        </span>
                        <Badge
                          variant={summary.failed === 0 ? "default" : "destructive"}
                          className={cn(
                            "px-3 py-1 text-xs font-bold",
                            summary.failed === 0
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          )}
                        >
                          {summary.passed}/{summary.total} Passed
                        </Badge>
                      </div>
                    )}

                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-xl border text-xs transition-all hover:shadow-md",
                          result.passed
                            ? "bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 hover:border-green-500/40"
                            : "bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20 hover:border-red-500/40"
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium flex items-center gap-2 text-sm">
                            {result.passed ? (
                              <div className="p-1.5 rounded-full bg-green-500/20">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-full bg-red-500/20">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </div>
                            )}
                            Test {result.testCaseIndex}
                          </span>
                          <Badge
                            variant={result.passed ? "default" : "destructive"}
                            className={cn(
                              "text-[10px] px-2 py-0.5",
                              result.passed ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                            )}
                          >
                            {result.passed ? "PASSED" : "FAILED"}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                            <span className="text-muted-foreground font-medium">Input:</span>
                            <pre className="font-mono mt-1.5 text-foreground">{result.input.replace(/\\n/g, '\n')}</pre>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                            <span className="text-muted-foreground font-medium">Expected:</span>
                            <pre className="font-mono mt-1.5 text-foreground">{result.expectedOutput.replace(/\\n/g, '\n')}</pre>
                          </div>
                          <div className={cn(
                            "p-3 rounded-lg border",
                            result.passed
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          )}>
                            <span className="text-muted-foreground font-medium">Your Output:</span>
                            <pre className="font-mono mt-1.5 text-foreground">{result.actualOutput}</pre>
                            {result.error && (
                              <p className="text-red-400 mt-2 text-xs font-medium">{result.error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm p-8">
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-center">Submit your code to see test results</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between px-4 py-4 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border-t border-border/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isRunning || isSubmitting}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="min-w-[110px] bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 shadow-lg shadow-secondary/10"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover border border-border">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-3 w-3" />
                  <span>Ctrl + Enter</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="min-w-[130px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 border-0 transition-all hover:shadow-green-500/40"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? "Evaluating..." : "Submit"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-popover border border-border">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-3 w-3" />
                  <span>Ctrl + Shift + Enter</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCodeEditor;
