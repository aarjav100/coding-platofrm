import { Lock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lesson, LessonProgress } from '@/hooks/useLessonProgress';

interface LessonCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
  isUnlocked: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function LessonCard({ lesson, progress, isUnlocked, isActive, onClick }: LessonCardProps) {
  const isCompleted = progress?.completed ?? false;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 border-0 relative overflow-hidden group",
        // Active State: Neon Glow + Dark Background
        isActive
          ? "bg-[#0f172a] shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
          : "bg-card/40 hover:bg-card/60 hover:shadow-md hover:shadow-primary/5 border border-white/5",
        // Locked State
        !isUnlocked && "opacity-50 grayscale bg-muted/20 hover:bg-muted/20 cursor-not-allowed"
      )}
      onClick={() => isUnlocked && onClick()}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
      )}

      <CardContent className="p-4 flex items-center gap-4">
        {/* Icon Container */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-inner",
          isCompleted
            ? "bg-green-500/10 text-green-400 shadow-green-500/10"
            : isActive
              ? "bg-cyan-500/10 text-cyan-400 shadow-cyan-500/10"
              : "bg-muted/50 text-muted-foreground"
        )}>
          {!isUnlocked ? (
            <Lock className="w-5 h-5" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-sm truncate mb-1 transition-colors",
            isActive ? "text-cyan-100" : "text-foreground",
            !isUnlocked && "text-muted-foreground"
          )}>
            {lesson.title}
          </h3>
          {lesson.description && (
            <p className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80 transition-colors">
              {lesson.description}
            </p>
          )}

          {/* Tags/Badges */}
          <div className="flex items-center gap-2 mt-2.5">
            {progress?.quiz_score !== null && progress?.quiz_score !== undefined && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-white/5 hover:bg-white/10 text-slate-300 border-0">
                Quiz: {progress.quiz_score}%
              </Badge>
            )}
            {progress?.challenge_completed && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-green-500/10 text-green-400 border-0">
                Code ✓
              </Badge>
            )}
          </div>
        </div>

        {isUnlocked && (
          <ChevronRight className={cn(
            "w-5 h-5 text-muted-foreground/50 flex-shrink-0 transition-all duration-300",
            isActive ? "text-cyan-400 translate-x-0 opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
          )} />
        )}
      </CardContent>
    </Card>
  );
}
