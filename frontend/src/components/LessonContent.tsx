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
    <div className="space-y-8">
      {/* Lesson Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            {lesson.title}
          </h2>
          {lesson.description && (
            <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
              {lesson.description}
            </p>
          )}
        </div>
        {allCompleted && (
          <div className="animate-in fade-in zoom-in duration-500">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Lesson Completed
            </Badge>
          </div>
        )}
      </div>

      {/* Progress Requirements - Mission Control Style */}
      <Card className="border-0 bg-[#0f172a] shadow-xl shadow-black/20 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
        <CardContent className="p-6 relative">
          <h4 className="font-semibold text-slate-200 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Lock className="w-4 h-4 text-slate-400" />
            Unlock Next Lesson
          </h4>
          <div className="flex flex-wrap gap-4">
            <div className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300",
              quizPassed
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10"
            )}>
              <div className={cn("p-2 rounded-lg", quizPassed ? "bg-emerald-500/10" : "bg-white/5")}>
                {quizPassed ? <CheckCircle2 className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Pass Quiz</span>
                <span className="text-xs opacity-70">Min score: 70%</span>
              </div>
              {progress?.quiz_score !== undefined && (
                <Badge variant="outline" className={cn("ml-2 border-0 bg-white/5", quizPassed && "text-emerald-400")}>
                  {progress.quiz_score}%
                </Badge>
              )}
            </div>

            {challenge && (
              <div className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300",
                challengeCompleted
                  ? "bg-purple-950/30 border-purple-500/30 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                  : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/10"
              )}>
                <div className={cn("p-2 rounded-lg", challengeCompleted ? "bg-purple-500/10" : "bg-white/5")}>
                  {challengeCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Coding Challenge</span>
                  <span className="text-xs opacity-70">Complete solution</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs - Pill Style */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-2 mb-6 border-b border-white/5 pb-1">
          <TabsTrigger
            value="content"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--primary),0.3)] border border-transparent data-[state=active]:border-primary/50 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Lesson Content
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-transparent transition-all duration-300"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Quiz
            {quizPassed && <CheckCircle2 className="w-3 h-3 ml-2 text-current" />}
          </TabsTrigger>
          <TabsTrigger
            value="challenge"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-transparent transition-all duration-300 disabled:opacity-30"
            disabled={!challenge}
          >
            <Code2 className="w-4 h-4 mr-2" />
            Challenge
            {challengeCompleted && <CheckCircle2 className="w-3 h-3 ml-2 text-current" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-0 animate-in slide-in-from-bottom-5 duration-500 fade-in">
          <Card className="border-0 bg-transparent shadow-none">
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-0">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-6" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-slate-200 mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="text-slate-300 leading-relaxed mb-4 text-lg" {...props} />,
                  li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
                }}
              >
                {lesson.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-0 animate-in slide-in-from-bottom-5 duration-500 fade-in">
          {!isLoggedIn ? (
            <Card className="border-dashed border-2 border-white/10 bg-transparent">
              <CardContent className="p-12 text-center">
                <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Login Required</h3>
                <p className="text-slate-400">Please login to access the quiz.</p>
              </CardContent>
            </Card>
          ) : quiz ? (
            <div className="bg-card/30 rounded-2xl border border-white/5 p-1">
              <QuizComponent
                quiz={quiz}
                questions={questions}
                onComplete={handleQuizComplete}
              />
            </div>
          ) : (
            <Card className="border-0 bg-transparent">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No quiz available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="challenge" className="mt-0 animate-in slide-in-from-bottom-5 duration-500 fade-in">
          {!isLoggedIn ? (
            <Card className="border-dashed border-2 border-white/10 bg-transparent">
              <CardContent className="p-12 text-center">
                <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Login Required</h3>
                <p className="text-slate-400">Please login to access the challenge.</p>
              </CardContent>
            </Card>
          ) : challenge ? (
            <div className="bg-card/30 rounded-2xl border border-white/5 overflow-hidden">
              <CodingChallengeComponent
                challenge={challenge}
                onComplete={handleChallengeComplete}
              />
            </div>
          ) : (
            <Card className="border-0 bg-transparent">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">No challenge available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
