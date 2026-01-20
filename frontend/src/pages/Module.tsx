import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { modules } from "@/data/modules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Code2, FileText, Play, Sparkles, Lightbulb, IndianRupee, GraduationCap, BookOpen, ExternalLink } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { LessonCard } from "@/components/LessonCard";
import { LessonContent } from "@/components/LessonContent";
import { Progress } from "@/components/ui/progress";

// Language options for code examples
const languageOptions = [
  { key: "javascript", label: "JavaScript", icon: "JS" },
  { key: "python", label: "Python", icon: "PY" },
  { key: "cpp", label: "C++", icon: "C++" },
  { key: "java", label: "Java", icon: "JV" },
] as const;

type LanguageKey = typeof languageOptions[number]["key"];

const Module = () => {
  const { id } = useParams();
  const module = modules.find(m => m.id === id);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("javascript");
  const [activeTab, setActiveTab] = useState("lessons");
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  const { 
    lessons, 
    progress, 
    loading, 
    userId,
    isLessonUnlocked, 
    getLessonProgress, 
    updateProgress 
  } = useLessonProgress(id || '');

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module not found</h1>
          <Link to="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get available languages for current module
  const getAvailableLanguages = () => {
    const allLanguages = new Set<LanguageKey>();
    module.content.code.forEach(codeBlock => {
      Object.keys(codeBlock.languages).forEach(lang => {
        allLanguages.add(lang as LanguageKey);
      });
    });
    return languageOptions.filter(opt => allLanguages.has(opt.key));
  };

  const availableLanguages = getAvailableLanguages();

  // Calculate progress
  const completedLessons = lessons.filter(lesson => {
    const lessonProgress = getLessonProgress(lesson.id);
    return lessonProgress?.completed;
  }).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const selectedLesson = lessons[selectedLessonIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to modules
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{module.category}</Badge>
              <Badge variant="outline">{module.difficulty}</Badge>
              {module.price === 0 ? (
                <Badge className="bg-secondary text-secondary-foreground font-bold text-base px-4 py-1">
                  FREE MODULE
                </Badge>
              ) : (
                <Badge variant="outline" className="text-base px-4 py-1 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {module.price}
                </Badge>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-foreground">{module.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{module.description}</p>
          
          {/* Progress Bar */}
          {lessons.length > 0 && (
            <Card className="bg-muted/30 border-border mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="font-medium">Your Progress</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {completedLessons}/{lessons.length} lessons completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardContent>
            </Card>
          )}
          
          {/* Funny Fact Card */}
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Did You Know?</h3>
                  <p className="text-sm text-muted-foreground">{module.funnyFact}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Animations
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="border-border">
                      <CardContent className="p-4">
                        <div className="animate-pulse flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-muted" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="lg:col-span-2">
                  <Card className="border-border">
                    <CardContent className="p-8">
                      <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : lessons.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lesson List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    {lessons.length} Lessons
                  </h3>
                  {lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      progress={getLessonProgress(lesson.id)}
                      isUnlocked={isLessonUnlocked(index)}
                      isActive={selectedLessonIndex === index}
                      onClick={() => setSelectedLessonIndex(index)}
                    />
                  ))}
                </div>

                {/* Lesson Content */}
                <div className="lg:col-span-2">
                  {selectedLesson ? (
                    <LessonContent
                      lesson={selectedLesson}
                      progress={getLessonProgress(selectedLesson.id)}
                      onProgressUpdate={(updates) => updateProgress(selectedLesson.id, updates)}
                      isLoggedIn={!!userId}
                    />
                  ) : (
                    <Card className="border-border">
                      <CardContent className="p-8 text-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a lesson to begin</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Lessons Yet</h3>
                  <p className="text-muted-foreground">
                    Structured lessons with quizzes and coding challenges are coming soon!
                    <br />
                    Check out the Code, Notes, and Videos tabs for learning materials.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg w-fit">
              {availableLanguages.map((lang) => (
                <Button
                  key={lang.key}
                  variant={selectedLanguage === lang.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang.key)}
                  className="font-mono"
                >
                  {lang.icon}
                </Button>
              ))}
            </div>

            {module.content.code.map((codeBlock, index) => {
              const code = codeBlock.languages[selectedLanguage];
              if (!code) return null;

              const openInPlayground = () => {
                const encodedCode = btoa(code);
                const title = encodeURIComponent(codeBlock.title);
                const url = `/playground?code=${encodedCode}&lang=${selectedLanguage}&title=${title}`;
                window.open(url, '_blank');
              };

              return (
                <Card key={index} className="overflow-hidden border-border">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{codeBlock.title}</CardTitle>
                        <CardDescription>{codeBlock.explanation}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openInPlayground}
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Editor
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {selectedLanguage}
                        </Badge>
                      </div>
                      <SyntaxHighlighter
                        language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                          padding: '1.5rem',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="notes">
            <Card className="border-border">
              <CardContent className="notes-content prose prose-slate dark:prose-invert max-w-none p-8">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-6 text-foreground border-b-4 border-primary pb-3" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground flex items-center gap-2 before:content-[''] before:w-1.5 before:h-8 before:bg-gradient-primary before:rounded-full" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-primary" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-2 text-accent" {...props} />,
                    p: ({ node, ...props }) => <p className="text-base leading-relaxed mb-4 text-foreground" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-accent" {...props} />,
                    code: ({ node, inline, ...props }: any) => 
                      inline ? (
                        <code className="px-2 py-1 bg-code-bg border border-code-border rounded text-accent font-mono text-sm" {...props} />
                      ) : (
                        <code className="block p-4 bg-code-bg border border-code-border rounded-lg my-4 font-mono text-sm overflow-x-auto" {...props} />
                      ),
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />,
                    li: ({ node, ...props }) => <li className="text-foreground leading-relaxed" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-accent bg-muted/30 pl-4 py-3 my-4 italic text-muted-foreground" {...props} />
                    ),
                  }}
                >
                  {module.content.notes}
                </ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations" className="space-y-4">
            {module.content.animations.map((animation, index) => (
              <Card key={index} className="border-border overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    {animation.title}
                  </CardTitle>
                  <CardDescription>{animation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                    {/* Interactive Animation Demos */}
                    {animation.component === 'scope-animation' && (
                      <div className="w-full space-y-4">
                        <div className="bg-card border-2 border-primary rounded-lg p-4 animate-fade-in">
                          <div className="font-mono text-sm text-primary mb-2">Global Scope</div>
                          <div className="bg-primary/10 p-3 rounded">
                            <div className="bg-card border-2 border-accent rounded-lg p-3 animate-fade-in animation-delay-300">
                              <div className="font-mono text-sm text-accent mb-2">Function Scope</div>
                              <div className="bg-accent/10 p-2 rounded">
                                <div className="bg-card border-2 border-secondary rounded-lg p-2 animate-fade-in animation-delay-600">
                                  <div className="font-mono text-sm text-secondary">Block Scope</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {animation.component === 'event-loop-animation' && (
                      <div className="w-full grid grid-cols-3 gap-4">
                        <div className="bg-primary/20 rounded-lg p-4 animate-pulse">
                          <div className="font-mono text-sm text-primary text-center">Call Stack</div>
                        </div>
                        <div className="bg-accent/20 rounded-lg p-4 animate-pulse animation-delay-300">
                          <div className="font-mono text-sm text-accent text-center">Web APIs</div>
                        </div>
                        <div className="bg-secondary/20 rounded-lg p-4 animate-pulse animation-delay-600">
                          <div className="font-mono text-sm text-secondary text-center">Callback Queue</div>
                        </div>
                      </div>
                    )}
                    {animation.component === 'hoisting-animation' && (
                      <div className="w-full space-y-4">
                        <div className="font-mono text-sm bg-card p-4 rounded-lg border border-border transform translate-y-0 animate-[slide-in-right_1s_ease-out]">
                          function hoistedFunction() {'{'}..{'}'}
                        </div>
                        <div className="font-mono text-sm bg-card p-4 rounded-lg border border-border transform translate-y-0 animate-[slide-in-right_1s_ease-out_0.3s]">
                          var hoistedVar = undefined
                        </div>
                      </div>
                    )}
                    {!['scope-animation', 'event-loop-animation', 'hoisting-animation'].includes(animation.component || '') && (
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />
                        <p className="text-muted-foreground">Interactive {animation.type} animation</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {module.content.videos.map((video, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-accent" />
                      {video.title}
                    </CardTitle>
                    <Badge variant="secondary">{video.duration}</Badge>
                  </div>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Module;
