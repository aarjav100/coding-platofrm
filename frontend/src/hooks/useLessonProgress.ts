import { useState, useEffect } from 'react';
import api from '@/lib/api';
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LessonProgress {
  id: string;
  lesson_id: string;
  completed: boolean;
  quiz_score: number | null;
  challenge_completed: boolean;
  completed_at: string | null;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content: string;
  order_index: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  passing_score: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: unknown;
  correct_answer: number;
  explanation: string | null;
  order_index: number;
}

export interface CodingChallenge {
  id: string;
  lesson_id: string;
  title: string;
  description: string | null;
  starter_code: string;
  expected_output: string;
  hints: unknown;
  difficulty: string;
  language: string;
}

// Mock Data for "Variables and Data Types"
const MOCK_LESSONS: Lesson[] = [
  {
    id: "l1",
    module_id: "javascript-basics",
    title: "Variables and Data Types",
    description: "Learn how to declare variables and understand different data types in JavaScript",
    content: `
# Variables and Data Types

## What are Variables?
Variables are containers for storing data values. Think of them as labeled boxes where you can put information and retrieve it later.

### Declaring Variables
JavaScript provides three ways to declare variables:

\`\`\`javascript
var oldWay = "I am the old way"; // function-scoped, avoid using
let modern = "I can be reassigned"; // block-scoped, preferred
const constant = "I cannot change"; // block-scoped, immutable
\`\`\`

## Data Types
### Primitive Types

**String** - Text data enclosed in quotes
\`\`\`javascript
let name = "Alice";
let greeting = 'Hello World';
let template = \`Hello \${name}\`;
\`\`\`

**Number** - Both integers and decimals
\`\`\`javascript
let age = 25;
let price = 19.99;
let negative = -10;
\`\`\`

**Boolean** - True or false values
\`\`\`javascript
let isActive = true;
let isComplete = false;
\`\`\`

**Undefined** - Variable declared but not assigned
\`\`\`javascript
let notAssigned;
console.log(notAssigned); // undefined
\`\`\`

**Null** - Intentional absence of any object value
\`\`\`javascript
let empty = null;
\`\`\`
`,
    order_index: 0
  },
  {
    id: "l2",
    module_id: "javascript-basics",
    title: "Functions and Scope",
    description: "Master function declaration, arrow functions, and understanding scope",
    content: "# Functions and Scope\n\nContent coming soon...",
    order_index: 1
  },
  {
    id: "l3",
    module_id: "javascript-basics",
    title: "Arrays and Objects",
    description: "Work with arrays and objects to store and manipulate collections of data",
    content: "# Arrays and Objects\n\nContent coming soon...",
    order_index: 2
  }
];

export function useLessonProgress(moduleId: string) {
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(false);
  // Fake user ID for now
  const [userId] = useState<string | null>("mock-user-id");
  const { toast } = useToast();

  // Load progress from local storage instead of Supabase
  useEffect(() => {
    const savedProgress = localStorage.getItem(`lesson_progress_${moduleId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [moduleId]);

  const isLessonUnlocked = (lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true;
    const previousLesson = lessons[lessonIndex - 1];
    if (!previousLesson) return false;
    const previousProgress = progress.find(p => p.lesson_id === previousLesson.id);
    return previousProgress?.completed ?? false;
  };

  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  const updateProgress = async (
    lessonId: string,
    updates: Partial<{ completed: boolean; quiz_score: number; challenge_completed: boolean }>
  ) => {
    const newProgress = [...progress];
    const existingIndex = newProgress.findIndex(p => p.lesson_id === lessonId);

    const progressData = {
      id: existingIndex >= 0 ? newProgress[existingIndex].id : Math.random().toString(),
      lesson_id: lessonId,
      user_id: userId || 'anon',
      completed: updates.completed ?? false,
      quiz_score: updates.quiz_score ?? null,
      challenge_completed: updates.challenge_completed ?? false,
      completed_at: updates.completed ? new Date().toISOString() : null,
      ...updates // Override if needed
    };

    if (existingIndex >= 0) {
      newProgress[existingIndex] = { ...newProgress[existingIndex], ...progressData };
    } else {
      newProgress.push(progressData as LessonProgress);
    }

    setProgress(newProgress);
    localStorage.setItem(`lesson_progress_${moduleId}`, JSON.stringify(newProgress));

    // Award points if completed
    if (updates.completed) {
      try {
        await api.post('/auth/add-points', {
          points: 10, // Default 10 points for lesson, can be dynamic
          reason: 'lesson_complete'
        });
        toast({
          title: "Lesson Completed!",
          description: "You earned 10 points!",
          variant: "default",
          className: "bg-green-500 text-white"
        });
      } catch (error) {
        console.error('Failed to award points', error);
      }
    } else if (updates.quiz_score && updates.quiz_score >= 70) {
      // Potentially award points for quiz pass if not already awarded for lesson?
      // For now let's stick to simple lesson completion triggers points
    }

    if (!updates.completed) {
      toast({
        title: "Progress Saved",
        description: "Your progress has been updated locally!",
      });
    }
  };

  return {
    lessons,
    progress,
    loading,
    userId,
    isLessonUnlocked,
    getLessonProgress,
    updateProgress,
  };
}

// Mock details for the mock lessons
export function useLessonDetails(lessonId: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [challenge, setChallenge] = useState<CodingChallenge | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Return mock data based on lessonId
    if (lessonId === "l1") {
      setQuiz({
        id: "q1",
        lesson_id: "l1",
        title: "Variables Quiz",
        description: "Test your knowledge.",
        passing_score: 70
      });
      setQuestions([
        {
          id: "qq1",
          quiz_id: "q1",
          question: "Which keyword creates a constant variable?",
          options: ["var", "let", "const", "static"],
          correct_answer: 2,
          explanation: "const creates a read-only reference.",
          order_index: 0
        }
      ]);
      setChallenge({
        id: "c1",
        lesson_id: "l1",
        title: "Declare a Variable",
        description: "Create a variable named 'hero' with value 'Batman'.",
        starter_code: "// Your code here",
        expected_output: "Batman",
        hints: [],
        difficulty: "easy",
        language: "javascript"
      });
    }
  }, [lessonId]);

  return { quiz, questions, challenge, loading };
}
