import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, Loader2, Lock, Unlock, ChevronRight,
  Compass, BookOpen, Code2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Hint {
  level: number;
  type: 'direction' | 'concept' | 'logic';
  content: string;
  isAIGenerated?: boolean;
}

interface ProgressiveHintsProps {
  problemId: string;
  problemTitle?: string;
  problemDescription?: string;
  userCode?: string;
}

export default function ProgressiveHints({ 
  problemId, 
  problemTitle,
  problemDescription,
  userCode 
}: ProgressiveHintsProps) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const hintLevels = [
    { 
      level: 1, 
      name: 'Direction', 
      icon: Compass, 
      description: 'Which way to go',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
    },
    { 
      level: 2, 
      name: 'Concept', 
      icon: BookOpen, 
      description: 'Key algorithm/DS',
      color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
    },
    { 
      level: 3, 
      name: 'Logic', 
      icon: Code2, 
      description: 'Partial solution',
      color: 'from-red-500/20 to-rose-500/20 border-red-500/30'
    }
  ];

  const revealHint = async (level: number) => {
    if (level > currentLevel + 1) {
      toast({
        title: "Unlock Previous Hints First",
        description: `You need to reveal Level ${level - 1} hint first`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('progressive-hints', {
        body: { 
          problemId, 
          hintLevel: level,
          userCode,
          problemTitle,
          problemDescription
        }
      });

      if (error) throw error;

      if (data.success) {
        setHints(prev => [...prev.filter(h => h.level !== level), data.hint]);
        setCurrentLevel(Math.max(currentLevel, level));
        toast({
          title: `Hint ${level} Revealed`,
          description: `${hintLevels[level - 1].name} hint unlocked`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Failed to get hint",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHintByLevel = (level: number) => hints.find(h => h.level === level);

  return (
    <Card className="border-border bg-gradient-to-br from-card via-card to-yellow-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          Progressive Hints
          <Badge variant="secondary" className="text-xs">
            {currentLevel}/3 Revealed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hintLevels.map((level, index) => {
          const hint = getHintByLevel(level.level);
          const isUnlocked = currentLevel >= level.level;
          const canUnlock = currentLevel >= level.level - 1;
          const Icon = level.icon;

          return (
            <div key={level.level} className="space-y-2">
              <div
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  isUnlocked 
                    ? `bg-gradient-to-r ${level.color}` 
                    : "bg-muted/20 border-border/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isUnlocked ? "bg-background/30" : "bg-muted/50"
                    )}>
                      {isUnlocked ? (
                        <Unlock className="h-4 w-4 text-foreground" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Level {level.level}: {level.name}
                        </span>
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    </div>
                  </div>
                  {!isUnlocked && (
                    <Button
                      size="sm"
                      variant={canUnlock ? "default" : "secondary"}
                      onClick={() => revealHint(level.level)}
                      disabled={!canUnlock || isLoading}
                      className={cn(
                        "min-w-[80px]",
                        canUnlock && "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black"
                      )}
                    >
                      {isLoading && currentLevel + 1 === level.level ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          Reveal
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {hint && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <p className="text-sm text-foreground leading-relaxed">
                      {hint.content}
                    </p>
                    {hint.isAIGenerated && (
                      <Badge variant="outline" className="text-[10px] mt-2">
                        AI Generated
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {index < hintLevels.length - 1 && (
                <div className="flex justify-center">
                  <div className={cn(
                    "h-4 w-0.5 rounded-full",
                    currentLevel > level.level ? "bg-primary/50" : "bg-border/50"
                  )} />
                </div>
              )}
            </div>
          );
        })}

        <p className="text-[11px] text-muted-foreground text-center pt-2 italic">
          💡 Try to solve without hints for better learning!
        </p>
      </CardContent>
    </Card>
  );
}
