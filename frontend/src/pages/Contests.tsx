import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code2, Clock, ArrowLeft, Timer, Sparkles, Search, Filter,
  ChevronRight, CheckCircle2, Trophy, List, Layout, Play, Terminal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdvancedCodeEditor from "@/components/AdvancedCodeEditor";
import { cn } from "@/lib/utils";

// --- Mock Data ---

interface ContestProblem {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  examples?: { input: string; output: string; explanation?: string }[];
}

const MOCK_PROBLEMS: ContestProblem[] = [
  {
    id: "p1",
    title: "Two Sum",
    description: "Given an array of integers, find two numbers that add up to a target value.",
    points: 5,
    difficulty: "Easy",
    inputFormat: "First line: n (array size)\nSecond line: n integers\nThird line: target",
    outputFormat: "Two indices of the numbers",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    examples: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "3\n3 2 4\n6",
        output: "1 2",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ]
  },
  {
    id: "p2",
    title: "Palindrome Check",
    description: "Determine if a given string is a palindrome (reads the same forwards and backwards).",
    points: 8,
    difficulty: "Easy",
    inputFormat: "A single string S",
    outputFormat: "true or false",
    sampleInput: "racecar",
    sampleOutput: "true",
    examples: [
      {
        input: "racecar",
        output: "true"
      },
      {
        input: "hello",
        output: "false"
      }
    ]
  },
  // ... (rest of the mock data would ideally be updated similarly, but for brevity/safety we focus on the structure and first few)
  {
    id: "p3",
    title: "Binary Search Tree",
    description: "Implement a function to insert a node into a Binary Search Tree.",
    points: 15,
    difficulty: "Medium",
    inputFormat: "First line: N (number of nodes)\nSecond line: N integers",
    outputFormat: "Pre-order traversal of the tree",
    sampleInput: "5\n4 2 7 1 3",
    sampleOutput: "4 2 1 3 7"
  },
  {
    id: "p4",
    title: "Longest Substring",
    description: "Find the length of the longest substring without repeating characters.",
    points: 18,
    difficulty: "Medium",
    inputFormat: "A string S",
    outputFormat: "Integer length",
    sampleInput: "abcabcbb",
    sampleOutput: "3"
  },
  {
    id: "p5",
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    points: 20,
    difficulty: "Medium",
    inputFormat: "N lines containing start and end times",
    outputFormat: "Merged intervals",
    sampleInput: "1 3\n2 6\n8 10\n15 18",
    sampleOutput: "1 6\n8 10\n15 18"
  },
  {
    id: "p6",
    title: "Graph Traversal",
    description: "Perform a BFS traversal on a graph starting from node 0.",
    points: 25,
    difficulty: "Hard",
    inputFormat: "Adjacency matrix or list",
    outputFormat: "Nodes in BFS order",
    sampleInput: "4\n0 1\n0 2\n1 2\n2 0\n2 3\n3 3",
    sampleOutput: "0 1 2 3"
  },
  {
    id: "p7",
    title: "Dynamic Programming",
    description: "Solve the classic Knapsack problem.",
    points: 30,
    difficulty: "Hard",
    inputFormat: "Weights and Values arrays",
    outputFormat: "Maximum value",
    sampleInput: "3 50\n10 60\n20 100\n30 120",
    sampleOutput: "220"
  },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "AlgoWizard", score: 300, lang: "C++" },
  { rank: 2, name: "Pythonista", score: 290, lang: "Python" },
  { rank: 3, name: "JavaGuru", score: 280, lang: "Java" },
  { rank: 4, name: "CodeNinja", score: 250, lang: "JS" },
  { rank: 5, name: "Rustacean", score: 240, lang: "Rust" },
];

// --- Theme Colors ---
const THEME = {
  bg: "bg-[#0f172a]",
  card: "bg-white/5 backdrop-blur-lg border-white/10",
  primary: "bg-[#3b82f6]",
  accent: "text-[#22c55e]",
  text: "text-[#e5e7eb]",
  textMuted: "text-slate-400",
};

const Contests = () => {
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem>(MOCK_PROBLEMS[0]);
  const [code, setCode] = useState("// Write your solution here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("description"); // description, input, output, examples
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  // Mock Console/Output Logic
  const handleRun = () => {
    setOutput("Running code...\n\n> Output:\nHello World\n\n> Execution Time: 45ms");
  };

  return (
    <div className={`min-h-screen ${THEME.bg} font-sans text-slate-200 flex flex-col overflow-hidden selection:bg-blue-500/30`}>
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 h-14 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Weekly Contest #102
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer Mock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10 text-xs font-mono text-blue-300">
            <Timer className="w-3.5 h-3.5" />
            <span>01:45:22</span>
          </div>

          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">Exit</Button>
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 border border-white/10 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/20">
            JD
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 overflow-hidden p-4 gap-4 grid grid-cols-12 grid-rows-[1fr_auto]">

        {/* COL 1: Problem List (Sidebar) */}
        <Card className={`col-span-2 ${THEME.card} flex flex-col overflow-hidden h-full rounded-xl border-white/10 shadow-2xl`}>
          <div className="p-3 border-b border-white/10 bg-white/5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <List className="w-3.5 h-3.5" /> Problems
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {MOCK_PROBLEMS.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProblem(p)}
                  className={cn(
                    "group px-3 py-2.5 rounded-lg cursor-pointer transition-all border border-transparent",
                    selectedProblem.id === p.id
                      ? "bg-blue-600/20 border-blue-500/30 shadow-inner"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-xs font-bold mr-2",
                      selectedProblem.id === p.id ? "text-blue-400" : "text-slate-500"
                    )}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <Badge variant="outline" className={cn(
                      "text-[10px] h-4 px-1 border-0 bg-opacity-20",
                      p.difficulty === 'Easy' ? "bg-green-500 text-green-400" :
                        p.difficulty === 'Medium' ? "bg-yellow-500 text-yellow-400" :
                          "bg-red-500 text-red-400"
                    )}>
                      {p.points}
                    </Badge>
                  </div>
                  <h3 className={cn(
                    "text-sm font-medium leading-tight",
                    selectedProblem.id === p.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}>
                    {p.title}
                  </h3>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* COL 2: Problem Content (Middle) */}
        <Card className={`col-span-5 ${THEME.card} flex flex-col overflow-hidden h-full rounded-xl border-white/10 shadow-2xl`}>
          {/* Problem Header */}
          <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                {selectedProblem.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold border",
                  selectedProblem.difficulty === 'Easy' ? "border-green-500/30 text-green-400 bg-green-500/10" :
                    selectedProblem.difficulty === 'Medium' ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                      "border-red-500/30 text-red-400 bg-red-500/10"
                )}>
                  {selectedProblem.difficulty}
                </span>
                <span>•</span>
                <span>Time: 1s</span>
                <span>•</span>
                <span>Memory: 256MB</span>
              </div>
            </div>
          </div>

          {/* Problem Tabs */}
          <div className="flex items-center gap-1 px-4 border-b border-white/10 bg-slate-900/20">
            {['description', 'input', 'output', 'examples'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-medium border-b-2 transition-all capitalize",
                  activeTab === tab
                    ? "border-blue-500 text-blue-400 sticky top-0 bg-white/5"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Problem Body */}
          <ScrollArea className="flex-1 p-5">
            {activeTab === 'description' && (
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-slate-300 leading-relaxed text-sm">
                  {selectedProblem.description}
                </p>

                <div className="mt-8 space-y-6">
                  {(selectedProblem.examples || [{ input: selectedProblem.sampleInput, output: selectedProblem.sampleOutput }]).map((example, idx) => (
                    <div key={idx}>
                      <h3 className="text-sm font-bold text-white mb-2">Example {idx + 1}:</h3>
                      <div className="bg-slate-900/50 rounded-lg border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                          <div className="p-3">
                            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                              <ArrowLeft className="w-3 h-3 rotate-180" /> Input
                            </div>
                            <code className="text-xs text-slate-300 font-mono whitespace-pre block bg-black/20 p-2 rounded border border-white/5">
                              {example.input}
                            </code>
                          </div>
                          <div className="p-3">
                            <div className="text-[10px] uppercase text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                              <ArrowLeft className="w-3 h-3" /> Output
                            </div>
                            <code className="text-xs text-slate-300 font-mono whitespace-pre block bg-black/20 p-2 rounded border border-white/5">
                              {example.output}
                            </code>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="p-3 border-t border-white/10 bg-white/5">
                            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Explanation</span>
                            <p className="text-xs text-slate-400 leading-relaxed">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-500/20">
                  <h4 className="text-blue-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Note
                  </h4>
                  <p className="text-blue-200/80 text-xs">
                    Make sure to handle edge cases where the input array might be empty.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'input' && (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3 rotate-180" /> Input Format
                  </div>
                  <div className="p-3 font-mono text-sm text-slate-300 whitespace-pre-line">
                    {selectedProblem.inputFormat}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg border border-white/10 overflow-hidden">
                  <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <ArrowLeft className="w-3 h-3" /> Output Format
                  </div>
                  <div className="p-3 font-mono text-sm text-slate-300 whitespace-pre-line">
                    {selectedProblem.outputFormat}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-900/50 rounded-lg border border-white/10">
                    <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-xs font-bold text-slate-400">Sample 1:</div>
                    <div className="grid grid-cols-2 divide-x divide-white/10">
                      <div className="p-3">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Input</span>
                        <code className="text-xs text-green-400 font-mono whitespace-pre">{selectedProblem.sampleInput}</code>
                      </div>
                      <div className="p-3">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Output</span>
                        <code className="text-xs text-blue-400 font-mono whitespace-pre">{selectedProblem.sampleOutput}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* COL 3: Code Editor (Right) */}
        <div className="col-span-5 flex flex-col gap-4 h-full">
          <Card className={`flex-1 ${THEME.card} flex flex-col overflow-hidden rounded-xl border-white/10 shadow-2xl relative`}>
            {/* Editor renders here - wrapping Simplified Editor or AdvancedCodeEditor */}
            {/* Note: In a real implementation we would strip AdvancedCodeEditor to be purely the editor part */}
            {/* For this demo, we'll wrap the existing one but force styles via CSS/Props if possible, or just use a container */}

            <div className="h-full bg-[#1e1e1e]">
              <AdvancedCodeEditor
                problemId={selectedProblem.id}
                defaultLanguage="python"
                height="100%"
              />
            </div>
          </Card>

          {/* Bottom Console / Output */}
          {/* The user requested this spanning the bottom or in the column. 
                With 3-col layout, putting it below Editor (Column 3) is Vertical Split.
                Putting it below ALL columns is Horizontal Split.
                The diagram:
                | List | Prob | Code |
                | Output-------------|
            */}
        </div>

        {/* Bottom Console Panel (Spanning Rows) - Adjusting grid to make this row 2 */}
        <Card className={`col-span-12 ${THEME.card} mt-4 rounded-xl border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all ${isConsoleOpen ? 'h-48' : 'h-10'}`}>
          <div
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="h-10 px-4 flex items-center justify-between cursor-pointer bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Console / Test Results</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isConsoleOpen ? 'rotate-90' : ''}`} />
          </div>

          {isConsoleOpen && (
            <div className="flex-1 p-0 flex">
              <div className="w-48 border-r border-white/10 bg-slate-900/30 p-2 space-y-1">
                <button className="w-full text-left px-3 py-2 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Test Case 1
                </button>
                <button className="w-full text-left px-3 py-2 rounded text-xs font-medium text-slate-500 hover:bg-white/5">
                  Test Case 2
                </button>
              </div>
              <div className="flex-1 p-4 font-mono text-sm">
                <span className="text-slate-500">// Output will appear here</span>
              </div>
            </div>
          )}
        </Card>

      </main>
    </div>
  );
};

export default Contests;

