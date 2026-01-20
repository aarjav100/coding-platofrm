import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain, X, Send, Bot, User, Bug, Lightbulb, Map,
  MessageSquare, Sparkles, Code, Loader2
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type MentorMode = "general" | "explain" | "debug" | "hints" | "roadmap";

const MODE_CONFIG = {
  general: {
    icon: MessageSquare,
    label: "Chat",
    placeholder: "Ask anything about coding...",
    color: "text-blue-500"
  },
  explain: {
    icon: Lightbulb,
    label: "Explain",
    placeholder: "What concept should I explain?",
    color: "text-yellow-500"
  },
  debug: {
    icon: Bug,
    label: "Debug",
    placeholder: "Paste your code and describe the error...",
    color: "text-red-500"
  },
  hints: {
    icon: Sparkles,
    label: "Hints",
    placeholder: "Describe the problem you're solving...",
    color: "text-purple-500"
  },
  roadmap: {
    icon: Map,
    label: "Roadmap",
    placeholder: "What's your goal? (e.g., Google interview in 3 months)",
    color: "text-green-500"
  },
};

export const AIMentor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<MentorMode>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const streamChat = async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const body: any = {
        messages: newMessages,
        mode
      };

      // Add code context for debug mode
      if (mode === "debug" && codeInput.trim()) {
        body.code = codeInput;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
          return;
        }
        if (response.status === 402) {
          toast.error("AI credits exhausted. Please add credits.");
          return;
        }
        throw new Error(error.error || "Failed to get response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch (e) {
              // Incomplete JSON chunk
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        for (const line of buffer.split("\n")) {
          if (line.startsWith("data: ") && line.slice(6) !== "[DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch { }
          }
        }
      }
    } catch (error) {
      console.error("AI Mentor error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await streamChat(userMessage);
  };

  const clearChat = () => {
    setMessages([]);
    setCodeInput("");
  };

  const CurrentModeIcon = MODE_CONFIG[mode].icon;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 animate-pulse"
        size="icon"
      >
        <Brain className="w-7 h-7" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[450px] h-[700px] flex flex-col shadow-2xl border-border z-50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Brain className="w-6 h-6" />
          AI Mentor
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {MODE_CONFIG[mode].label}
          </span>
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-white/80 hover:text-white hover:bg-white/20 text-xs"
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as MentorMode)} className="px-2 pt-2 bg-muted/50">
        <TabsList className="grid grid-cols-5 w-full h-auto gap-1 bg-transparent p-0">
          {Object.entries(MODE_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col gap-1 py-2 px-1 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs"
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-[10px]">{config.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Code Input for Debug Mode */}
        {mode === "debug" && (
          <div className="p-3 border-b border-border bg-muted/30">
            <Textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Paste your buggy code here..."
              className="h-24 font-mono text-xs resize-none"
            />
          </div>
        )}

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <CurrentModeIcon className={`w-16 h-16 mx-auto mb-4 opacity-30 ${MODE_CONFIG[mode].color}`} />
              <p className="text-sm font-medium">
                {mode === "general" && "Ask me anything about coding! 🚀"}
                {mode === "explain" && "What concept should I explain? 📚"}
                {mode === "debug" && "Paste your code above, then describe the error 🐛"}
                {mode === "hints" && "Describe your problem for step-by-step hints 💡"}
                {mode === "roadmap" && "Tell me your goal for a personalized plan 🗺️"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {mode === "general" && (
                  <>
                    <QuickAction onClick={() => setInput("Explain Big O notation")} text="Big O" />
                    <QuickAction onClick={() => setInput("What is recursion?")} text="Recursion" />
                    <QuickAction onClick={() => setInput("Best DSA roadmap")} text="DSA Roadmap" />
                  </>
                )}
                {mode === "explain" && (
                  <>
                    <QuickAction onClick={() => setInput("Explain Binary Search")} text="Binary Search" />
                    <QuickAction onClick={() => setInput("Explain Dynamic Programming")} text="DP" />
                    <QuickAction onClick={() => setInput("Explain Graph BFS/DFS")} text="Graphs" />
                  </>
                )}
                {mode === "debug" && (
                  <>
                    <QuickAction onClick={() => setInput("Why is my code giving wrong output?")} text="Wrong Output" />
                    <QuickAction onClick={() => setInput("My code is too slow")} text="TLE Issue" />
                    <QuickAction onClick={() => setInput("Getting runtime error")} text="Runtime Error" />
                  </>
                )}
              </div>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-3 max-w-[85%] ${message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                    }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md text-xs"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-muted-foreground/20 px-1 py-0.5 rounded text-xs" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="rounded-lg px-4 py-3 bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={MODE_CONFIG[mode].placeholder}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Quick action button component
const QuickAction = ({ onClick, text }: { onClick: () => void; text: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
  >
    {text}
  </button>
);
