import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code2, Clock, ArrowLeft, Timer, Sparkles, Search, Filter,
  ChevronRight, CheckCircle2, Trophy, List, Layout, Play
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
    sampleOutput: "0 1"
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
    sampleOutput: "true"
  },
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

const Contests = () => {
  const [selectedProblem, setSelectedProblem] = useState<ContestProblem>(MOCK_PROBLEMS[0]);
  const [activeTab, setActiveTab] = useState("problems");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "text-green-600 bg-green-50 border-green-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRandomColor = (id: string) => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"];
    const index = parseInt(id.replace(/\D/g, '')) % colors.length;
    return colors[index];
  };

  const filteredProblems = MOCK_PROBLEMS.filter(p =>
    (difficultyFilter === "All" || p.difficulty === difficultyFilter) &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 flex items-center px-6 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">Weekly Coding Challenge #1</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-slate-500">Back to Dashboard</Button>
          </Link>
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            JD
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-slate-200">
            <div className="bg-slate-100 p-1 rounded-lg flex mb-4">
              <button
                onClick={() => setActiveTab("problems")}
                className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2", activeTab === "problems" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
              >
                <List className="w-4 h-4" /> Problems
              </button>
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={cn("flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2", activeTab === "leaderboard" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
              >
                <Trophy className="w-4 h-4" /> Leaderboard
              </button>
            </div>

            {activeTab === "problems" && (
              <div className="space-y-3">
                <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                  {["All", "Easy", "Medium", "Hard"].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setDifficultyFilter(filter)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                        difficultyFilter === filter
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search problems..."
                    className="pl-9 bg-slate-50 border-slate-200 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            {activeTab === "problems" ? (
              <div>
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={cn(
                      "group px-4 py-3 cursor-pointer border-l-4 transition-all hover:bg-slate-50",
                      selectedProblem.id === problem.id
                        ? "bg-blue-50/50 border-blue-500"
                        : "border-transparent"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", getRandomColor(problem.id))} />
                        <h3 className={cn("text-sm font-semibold", selectedProblem.id === problem.id ? "text-blue-700" : "text-slate-700")}>
                          {problem.title}
                        </h3>
                      </div>
                      <Badge className={cn("text-[10px] h-5 px-1.5 font-normal border",
                        selectedProblem.id === problem.id ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-sky-100 text-sky-700 border-sky-200"
                      )}>
                        {problem.points} pts
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredProblems.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No problems found.
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {MOCK_LEADERBOARD.map((user) => (
                  <div key={user.rank} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        user.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                          user.rank === 2 ? "bg-slate-200 text-slate-700" :
                            user.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {user.rank}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{user.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{user.score}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* content Area */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0 bg-white">
          {/* Problem Description */}
          <div className="flex-1 lg:max-w-xl h-full overflow-y-auto border-r border-slate-200 bg-white">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-slate-900">{selectedProblem.title}</h2>
                <Badge className={cn("ml-2", getDifficultyColor(selectedProblem.difficulty))}>
                  {selectedProblem.difficulty}
                </Badge>
              </div>

              <div className="prose prose-slate prose-sm max-w-none">
                <p className="text-slate-600 text-base leading-relaxed mb-8">
                  {selectedProblem.description}
                </p>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Input Format</h3>
                    <div className="font-mono text-sm text-slate-700 whitespace-pre-line">
                      {selectedProblem.inputFormat}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Output Format</h3>
                    <div className="font-mono text-sm text-slate-700 whitespace-pre-line">
                      {selectedProblem.outputFormat}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sample Input</h3>
                    </div>
                    <div className="p-4 font-mono text-sm text-slate-700 whitespace-pre">
                      {selectedProblem.sampleInput}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sample Output</h3>
                    </div>
                    <div className="p-4 font-mono text-sm text-slate-700 whitespace-pre">
                      {selectedProblem.sampleOutput}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <Trophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Contest has ended. Practice mode enabled.</p>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 h-full flex flex-col min-w-0 bg-[#1e1e1e]">
            <AdvancedCodeEditor
              problemId={selectedProblem.id}
              defaultLanguage="javascript"
              height="100%"
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button for smaller screens logic or other tools could go here */}
    </div>
  );
};

export default Contests;

