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
        "cursor-pointer transition-all duration-200 border-2",
        isActive && "border-primary bg-primary/5",
        !isActive && isUnlocked && "border-border hover:border-primary/50 hover:bg-muted/50",
        !isUnlocked && "opacity-60 cursor-not-allowed border-border bg-muted/20"
      )}
      onClick={() => isUnlocked && onClick()}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isCompleted && "bg-green-500/20 text-green-500",
          !isCompleted && isUnlocked && "bg-primary/20 text-primary",
          !isUnlocked && "bg-muted text-muted-foreground"
        )}>
          {!isUnlocked ? (
            <Lock className="w-5 h-5" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-sm truncate",
            !isUnlocked && "text-muted-foreground"
          )}>
            {lesson.title}
          </h3>
          {lesson.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {lesson.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {progress?.quiz_score !== null && progress?.quiz_score !== undefined && (
              <Badge variant="secondary" className="text-xs">
                Quiz: {progress.quiz_score}%
              </Badge>
            )}
            {progress?.challenge_completed && (
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
                Challenge ✓
              </Badge>
            )}
          </div>
        </div>

        {isUnlocked && (
          <ChevronRight className={cn(
            "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform",
            isActive && "text-primary transform translate-x-1"
          )} />
        )}
      </CardContent>
    </Card>
  );
}
