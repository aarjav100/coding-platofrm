import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, HelpCircle, Code2, CheckCircle2, Lock } from 'lucide-react';
import { Lesson, useLessonDetails, LessonProgress } from '@/hooks/useLessonProgress';
import { QuizComponent } from './QuizComponent';
import { CodingChallengeComponent } from './CodingChallengeComponent';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface LessonContentProps {
  lesson: Lesson;
  progress?: LessonProgress;
  onProgressUpdate: (updates: Partial<{ completed: boolean; quiz_score: number; challenge_completed: boolean }>) => void;
  isLoggedIn: boolean;
}

export function LessonContent({ lesson, progress, onProgressUpdate, isLoggedIn }: LessonContentProps) {
  const { quiz, questions, challenge, loading } = useLessonDetails(lesson.id);
  const [activeTab, setActiveTab] = useState('content');

  const quizPassed = progress?.quiz_score !== null && progress?.quiz_score !== undefined && progress.quiz_score >= (quiz?.passing_score || 70);
  const challengeCompleted = progress?.challenge_completed ?? false;
  const allCompleted = quizPassed && (challenge ? challengeCompleted : true);

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      onProgressUpdate({ 
        quiz_score: score,
        completed: challenge ? challengeCompleted : true
      });
    }
  };

  const handleChallengeComplete = () => {
    onProgressUpdate({ 
      challenge_completed: true,
      completed: quizPassed
    });
  };

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{lesson.title}</h2>
          {lesson.description && (
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          )}
        </div>
        {allCompleted && (
          <Badge className="bg-green-500/20 text-green-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      {/* Progress Requirements */}
      <Card className="border-border bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Complete to Unlock Next Lesson:</h4>
          <div className="flex flex-wrap gap-3">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
              quizPassed ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"
            )}>
              {quizPassed ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
              Pass Quiz {progress?.quiz_score !== undefined && `(${progress.quiz_score}%)`}
            </div>
            {challenge && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                challengeCompleted ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"
              )}>
                {challengeCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                Complete Coding Challenge
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lesson
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Quiz
            {quizPassed && <CheckCircle2 className="w-3 h-3 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger 
            value="challenge" 
            className="flex items-center gap-2"
            disabled={!challenge}
          >
            <Code2 className="w-4 h-4" />
            Challenge
            {challengeCompleted && <CheckCircle2 className="w-3 h-3 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card className="border-border">
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          {!isLoggedIn ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-4">
                  Please login to take quizzes and track your progress.
                </p>
              </CardContent>
            </Card>
          ) : quiz ? (
            <QuizComponent 
              quiz={quiz} 
              questions={questions} 
              onComplete={handleQuizComplete} 
            />
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quiz available for this lesson yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="challenge" className="mt-4">
          {!isLoggedIn ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-4">
                  Please login to attempt coding challenges.
                </p>
              </CardContent>
            </Card>
          ) : challenge ? (
            <CodingChallengeComponent 
              challenge={challenge} 
              onComplete={handleChallengeComplete} 
            />
          ) : (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No coding challenge available for this lesson yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
