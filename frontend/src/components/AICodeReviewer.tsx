import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Sparkles, Loader2, ChevronDown, AlertTriangle, 
  CheckCircle2, Zap, Clock, HardDrive, TrendingUp,
  Code2, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CodeReviewFeedback {
  overall_score: number;
  summary: string;
  strengths: string[];
  improvements: Array<{
    category: string;
    severity: string;
    issue: string;
    suggestion: string;
    code_snippet?: string;
  }>;
  time_complexity: string;
  space_complexity: string;
  better_approach?: string;
}

interface AICodeReviewerProps {
  code: string;
  language: string;
  problemId?: string;
  problemTitle?: string;
  problemDescription?: string;
}

export default function AICodeReviewer({ 
  code, 
  language, 
  problemId, 
  problemTitle,
  problemDescription 
}: AICodeReviewerProps) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [feedback, setFeedback] = useState<CodeReviewFeedback | null>(null);
  const [reviewType, setReviewType] = useState<'full' | 'logic' | 'optimization' | 'edge_cases'>('full');

  const handleReview = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to review",
        description: "Please write some code first",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-code-review', {
        body: { 
          code, 
          language, 
          problemId,
          problemTitle,
          problemDescription,
          reviewType 
        }
      });

      if (error) throw error;

      if (data.success) {
        setFeedback(data.feedback);
        toast({
          title: "Review Complete",
          description: `Your code scored ${data.feedback.overall_score}/10`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Review Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'logic': return <Code2 className="h-3.5 w-3.5" />;
      case 'optimization': return <Zap className="h-3.5 w-3.5" />;
      case 'edge_case': return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'style': return <Sparkles className="h-3.5 w-3.5" />;
      default: return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="border-border bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Code Reviewer
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value as typeof reviewType)}
              className="text-xs bg-muted border border-border rounded-md px-2 py-1"
            >
              <option value="full">Full Review</option>
              <option value="logic">Logic Only</option>
              <option value="optimization">Optimization</option>
              <option value="edge_cases">Edge Cases</option>
            </select>
            <Button
              size="sm"
              onClick={handleReview}
              disabled={isReviewing}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isReviewing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              )}
              {isReviewing ? "Reviewing..." : "Review Code"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {feedback && (
        <CardContent className="pt-0">
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-4">
              {/* Score & Summary */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex flex-col items-center">
                  <span className={cn("text-3xl font-bold", getScoreColor(feedback.overall_score))}>
                    {feedback.overall_score}
                  </span>
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{feedback.summary}</p>
                </div>
              </div>

              {/* Complexity Analysis */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-muted-foreground">Time Complexity</span>
                  </div>
                  <span className="text-sm font-mono font-medium">{feedback.time_complexity}</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <HardDrive className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-xs text-muted-foreground">Space Complexity</span>
                  </div>
                  <span className="text-sm font-mono font-medium">{feedback.space_complexity}</span>
                </div>
              </div>

              {/* Strengths */}
              {feedback.strengths.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">Strengths</span>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        {feedback.strengths.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-green-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground pl-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Improvements */}
              {feedback.improvements.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/15 transition-colors">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Improvements</span>
                      <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                        {feedback.improvements.length}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 text-yellow-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-3">
                    {feedback.improvements.map((improvement, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(improvement.category)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {improvement.category.replace('_', ' ')}
                            </span>
                          </div>
                          <Badge className={cn("text-[10px]", getSeverityColor(improvement.severity))}>
                            {improvement.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{improvement.issue}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary font-medium">Suggestion: </span>
                          {improvement.suggestion}
                        </p>
                        {improvement.code_snippet && (
                          <pre className="text-xs font-mono bg-muted/50 p-2 rounded-md overflow-x-auto">
                            {improvement.code_snippet}
                          </pre>
                        )}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Better Approach */}
              {feedback.better_approach && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Better Approach</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.better_approach}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
