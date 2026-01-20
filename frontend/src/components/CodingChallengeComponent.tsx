import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play, Send, RotateCcw, Settings, Share2, Download, Copy, Maximize2, Minimize2,
  Moon, Lightbulb, Bug, ChevronLeft, Home, Folder
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { CodingChallenge } from '@/hooks/useLessonProgress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { executeCode } from '@/utils/mockExecutor';

interface CodingChallengeComponentProps {
  challenge: CodingChallenge;
  onComplete: () => void;
}

export function CodingChallengeComponent({ challenge, onComplete }: CodingChallengeComponentProps) {
  const [code, setCode] = useState(challenge.starter_code);
  const [output, setOutput] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState('input');
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState(challenge.language || 'javascript');

  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setOutput('Running...');

    try {
      const result = await executeCode(code, language, customInput);
      setOutput(result.output);
    } catch (err) {
      setOutput('Error executing code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Submitted",
      description: "Solution submitted successfully!"
    });
    // Validate logic could go here, for now just complete
    onComplete();
  };

  // --- Feature Handlers ---

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast({ description: `Switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode` });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: "Link copied to clipboard!" });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution_${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ description: "Code downloaded!" });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ description: "Code copied to clipboard!" });
  };

  const toggleMaximize = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSettings = () => {
    toast({ description: "Settings menu would open here" });
  };

  const handleShowHint = () => {
    toast({
      title: "Hint",
      description: challenge.hints && challenge.hints[0] ? String(challenge.hints[0]) : "No hints available for this challenge."
    });
  };

  const handleReportBug = () => {
    toast({ description: "Bug report form would open here" });
  };


  return (
    <div className={cn(
      "flex flex-col bg-background rounded-xl overflow-hidden border shadow-sm transition-all duration-300 font-sans",
      isExpanded ? "fixed inset-0 z-50 h-[100vh] w-[100vw] rounded-none bg-background" : "h-[600px] w-full"
    )}>
      {/* Header / Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-[#f8fafc]">
        <div className="flex items-center gap-4">
          {/* Window Controls */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors cursor-pointer" onClick={() => setIsExpanded(false)} />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors cursor-pointer" onClick={() => setIsExpanded(true)} />
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px] h-8 bg-[#eff6ff] border-0 text-foreground/80 font-medium focus:ring-1 focus:ring-blue-200">
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  <SelectValue placeholder="Language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 bg-[#e0f2fe] hover:bg-[#e0f2fe] text-slate-600 font-medium px-3 py-1 rounded-full border-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            # 463
          </Badge>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Saved
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={toggleTheme}>
            <Moon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={toggleMaximize}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-600" onClick={handleSettings}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50" onClick={handleShowHint}>
            <Lightbulb className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={handleReportBug}>
            <Bug className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={isDarkMode ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'JetBrains Mono', monospace",
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Right: Output/Input Panel */}
        <div className="w-[450px] flex flex-col bg-[#dbeafe]/30 backdrop-blur-sm border-l border-slate-200">
          {/* Tabs Header */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-3 flex items-center justify-between">
              <TabsList className="bg-white/50 p-1 h-auto rounded-lg gap-1 border border-white/60">
                <TabsTrigger
                  value="input"
                  className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Input
                </TabsTrigger>
                <TabsTrigger
                  value="output"
                  className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Output
                </TabsTrigger>
                <TabsTrigger
                  value="tests"
                  className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Tests
                </TabsTrigger>
              </TabsList>
              <span className="text-[10px] font-mono text-slate-400">v1.0.2</span>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <div className="h-full rounded-xl bg-white/40 border border-white/50 p-4 shadow-sm">
                <TabsContent value="input" className="mt-0 h-full flex flex-col">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" />
                    Custom Input
                  </h3>
                  <textarea
                    className="flex-1 w-full bg-slate-50/50 rounded-lg border border-slate-200 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-mono text-sm text-slate-700 placeholder:text-slate-400"
                    placeholder="Enter your test input here..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="output" className="mt-0 h-full flex flex-col">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-500 rounded-full" />
                    Console Output
                  </h3>
                  {output ? (
                    <div className="flex-1 w-full bg-[#1e1e1e] rounded-lg border border-slate-800 p-4 font-mono text-sm text-slate-300 overflow-auto whitespace-pre-wrap">
                      {output}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-400 italic bg-slate-50/50 rounded-lg border border-slate-200 border-dashed">
                      Run code to see output
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tests" className="mt-0 h-full flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-lg border border-slate-200 border-dashed">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
                      <Folder className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">No Tests Run Yet</h4>
                    <p className="text-xs text-slate-500 max-w-[200px]">
                      Submit your code to run the automated test suite.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#dbeafe]/30 backdrop-blur-sm border-t border-slate-200 flex items-center justify-between">
        <Button variant="ghost" onClick={() => setCode(challenge.starter_code)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 gap-2">
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180" />
          Reset
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-[#bae6fd] hover:bg-[#bae6fd]/80 text-[#0284c7] border-0 font-medium px-6"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Run Code
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-medium px-6 shadow-md shadow-green-500/20"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
