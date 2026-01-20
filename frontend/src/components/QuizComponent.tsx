import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Quiz, QuizQuestion } from '@/hooks/useLessonProgress';

interface QuizComponentProps {
  quiz: Quiz;
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export function QuizComponent({ quiz, questions, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Calculate final score
      const correctCount = answers.reduce((count, answer, index) => {
        return answer === questions[index].correct_answer ? count + 1 : count;
      }, selectedAnswer === currentQuestion.correct_answer ? 1 : 0);
      
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= quiz.passing_score;
      setIsCompleted(true);
      onComplete(score, passed);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(questions.length).fill(null));
    setIsCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No quiz questions available for this lesson yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    const correctCount = answers.reduce((count, answer, index) => {
      return answer === questions[index].correct_answer ? count + 1 : count;
    }, 0);
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passing_score;

    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
            passed ? "bg-green-500/20" : "bg-destructive/20"
          )}>
            {passed ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive" />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </h3>
          <p className="text-muted-foreground mb-4">
            You scored {score}% ({correctCount}/{questions.length} correct)
          </p>
          <Badge variant={passed ? "default" : "destructive"} className="mb-6">
            {passed ? "PASSED" : "NOT PASSED"} (Required: {quiz.passing_score}%)
          </Badge>
          {!passed && (
            <div className="mt-4">
              <Button onClick={handleRetry} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <Badge variant="outline">Pass: {quiz.passing_score}%</Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <CardTitle className="text-xl mt-4">{quiz.title}</CardTitle>
        {quiz.description && (
          <CardDescription>{quiz.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>
          <div className="space-y-3">
            {((currentQuestion.options || []) as string[]).map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct_answer;
              const showCorrectness = showResult;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    !showCorrectness && isSelected && "border-primary bg-primary/5",
                    !showCorrectness && !isSelected && "border-border hover:border-primary/50",
                    showCorrectness && isCorrect && "border-green-500 bg-green-500/10",
                    showCorrectness && !isCorrect && isSelected && "border-destructive bg-destructive/10",
                    showResult && "cursor-default"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      !showCorrectness && isSelected && "bg-primary text-primary-foreground",
                      !showCorrectness && !isSelected && "bg-muted",
                      showCorrectness && isCorrect && "bg-green-500 text-white",
                      showCorrectness && !isCorrect && isSelected && "bg-destructive text-white"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showCorrectness && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {showCorrectness && !isCorrect && isSelected && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && currentQuestion.explanation && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h5 className="font-medium mb-1">Explanation:</h5>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!showResult ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
