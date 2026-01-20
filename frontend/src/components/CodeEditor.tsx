import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw, Send, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  onSubmit: (code: string, language: string, isCorrect?: boolean) => void;
  defaultLanguage?: string;
  expectedOutput?: string;
  problemId?: string;
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

// Language configurations - Har language ke liye default templates
const languageConfigs = {
  javascript: {
    label: "JavaScript",
    monacoLang: "javascript",
    template: `// JavaScript solution likho yahan
function solve(input) {
  // Your code here
  return input;
}

// Test your solution
console.log(solve("test"));
`
  },
  python: {
    label: "Python",
    monacoLang: "python",
    template: `# Python solution likho yahan
def solve(input_data):
    # Your code here
    return input_data

# Test your solution
print(solve("test"))
`
  },
  cpp: {
    label: "C++",
    monacoLang: "cpp",
    template: `// C++ solution likho yahan
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Your code here
    string input;
    cin >> input;
    cout << input << endl;
    return 0;
}
`
  },
  java: {
    label: "Java",
    monacoLang: "java",
    template: `// Java solution likho yahan
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
        String input = sc.nextLine();
        System.out.println(input);
    }
}
`
  }
};

const CodeEditor = ({ onSubmit, defaultLanguage = "javascript", expectedOutput, problemId }: CodeEditorProps) => {
  const [language, setLanguage] = useState<keyof typeof languageConfigs>(defaultLanguage as keyof typeof languageConfigs);
  const [code, setCode] = useState(languageConfigs[language].template);
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Language change handler - Language badalne pe template update karo
  const handleLanguageChange = (newLang: string) => {
    const lang = newLang as keyof typeof languageConfigs;
    setLanguage(lang);
    setCode(languageConfigs[lang].template);
    setOutput("");
    setTestResults([]);
    setSummary(null);
  };

  // Reset code to template - Code reset karo
  const handleReset = () => {
    setCode(languageConfigs[language].template);
    setOutput("");
    setTestResults([]);
    setSummary(null);
  };

  // Run code using edge function - Code run karo backend pe
  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running your code...\n");
    setTestResults([]);
    setSummary(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, language, problemId }
      });

      if (error) throw error;

      const result = data as ExecutionResult;

      if (result.success) {
        setOutput(result.output || "Code executed successfully (no output)");
      } else {
        setOutput(`Error: ${result.error}`);
      }

      if (result.testResults && result.testResults.length > 0) {
        setTestResults(result.testResults);
        setSummary(result.summary || null);
      }

      if (result.executionTime) {
        setOutput(prev => prev + `\n\n⏱️ Execution time: ${result.executionTime}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Error running code: ${errorMessage}`);
      toast({
        title: "Execution Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution with evaluation - Solution submit karo aur check karo
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Submitting and evaluating your solution...\n");
    setTestResults([]);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, language, expectedOutput, problemId }
      });

      if (error) throw error;

      const result = data as ExecutionResult;

      let resultMessage = result.success 
        ? `✅ Output: ${result.output}` 
        : `❌ Error: ${result.error}`;

      // Show test results if available
      if (result.testResults && result.testResults.length > 0) {
        setTestResults(result.testResults);
        setSummary(result.summary || null);
        
        if (result.summary) {
          resultMessage = `📊 Test Results: ${result.summary.passed}/${result.summary.total} passed`;
        }
      }

      if (result.isCorrect !== null && result.isCorrect !== undefined) {
        resultMessage += result.isCorrect 
          ? "\n\n🎉 All test cases passed! Great job!" 
          : "\n\n❌ Some test cases failed. Check the details below.";
      }

      if (result.executionTime) {
        resultMessage += `\n⏱️ Execution time: ${result.executionTime}`;
      }

      setOutput(resultMessage);

      // Call parent onSubmit with result
      onSubmit(code, language, result.isCorrect);

      toast({
        title: result.isCorrect ? "All Tests Passed!" : "Some Tests Failed",
        description: result.isCorrect 
          ? `Great job! ${result.summary?.passed || 0}/${result.summary?.total || 0} test cases passed.` 
          : `${result.summary?.passed || 0}/${result.summary?.total || 0} test cases passed. Check the details.`,
        variant: result.isCorrect ? "default" : "destructive"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Error submitting: ${errorMessage}`);
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-lg relative group">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Editor Header - Language selector aur buttons */}
      <div className="relative flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/80 via-muted/50 to-muted/80 border-b border-border backdrop-blur-sm">
        {/* Status indicator */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80 shadow-lg shadow-destructive/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-lg shadow-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-lg shadow-green-500/20" />
        </div>
        
        <div className="ml-16">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            disabled={isRunning || isSubmitting}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRun} 
            disabled={isRunning || isSubmitting}
            className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border border-secondary/30"
          >
            {isRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />}
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={isRunning || isSubmitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 border-0"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
            {isSubmitting ? "Evaluating..." : "Submit"}
          </Button>
        </div>
      </div>

      {/* Monaco Editor - Code likhne ka area */}
      <div className="h-80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/5 pointer-events-none z-10" />
        <Editor
          height="100%"
          language={languageConfigs[language].monacoLang}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            tabSize: 2,
            automaticLayout: true,
            wordWrap: "on",
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

      {/* Test Results Panel - Test case results dikhane ka area */}
      {testResults.length > 0 && (
        <div className="border-t border-border bg-gradient-to-b from-muted/20 to-transparent">
          <div className="px-4 py-3 bg-muted/30 text-sm font-medium text-foreground flex items-center justify-between backdrop-blur-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Test Results
            </span>
            {summary && (
              <span className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full shadow-lg",
                summary.failed === 0 
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-green-500/10" 
                  : "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 shadow-red-500/10"
              )}>
                {summary.passed}/{summary.total} Passed
              </span>
            )}
          </div>
          <div className="max-h-48 overflow-auto">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={cn(
                  "px-4 py-4 border-b border-border/50 last:border-b-0 transition-colors",
                  result.passed 
                    ? "bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5" 
                    : "bg-gradient-to-r from-red-500/5 via-transparent to-rose-500/5"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm flex items-center gap-2">
                    {result.passed ? (
                      <div className="p-1 rounded-full bg-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-red-500/20">
                        <XCircle className="h-4 w-4 text-red-400" />
                      </div>
                    )}
                    Test Case {result.testCaseIndex}
                  </span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md",
                    result.passed 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                    <span className="text-muted-foreground block mb-1.5 font-medium">Input:</span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">{result.input.replace(/\\n/g, '\n')}</pre>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                    <span className="text-muted-foreground block mb-1.5 font-medium">Expected:</span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">{result.expectedOutput.replace(/\\n/g, '\n')}</pre>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg border",
                    result.passed 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-red-500/10 border-red-500/30"
                  )}>
                    <span className="text-muted-foreground block mb-1.5 font-medium">Your Output:</span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">{result.actualOutput}</pre>
                    {result.error && (
                      <p className="text-red-400 mt-2 text-xs">{result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output Panel - Output dikhane ka area */}
      {output && testResults.length === 0 && (
        <div className="border-t border-border bg-gradient-to-b from-muted/20 to-transparent">
          <div className="px-4 py-3 bg-muted/30 text-sm font-medium text-foreground flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Output
          </div>
          <pre className="px-4 py-4 text-sm font-mono bg-background/50 max-h-32 overflow-auto whitespace-pre-wrap text-foreground">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
