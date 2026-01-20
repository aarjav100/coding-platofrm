import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import AdvancedCodeEditor from "@/components/AdvancedCodeEditor";

const CodePlayground = () => {
  const [searchParams] = useSearchParams();
  const [initialCode, setInitialCode] = useState<string>("");
  const [initialLanguage, setInitialLanguage] = useState<string>("javascript");
  const [title, setTitle] = useState<string>("Code Playground");

  useEffect(() => {
    // Get code from URL params (base64 encoded)
    const encodedCode = searchParams.get("code");
    const language = searchParams.get("lang") || "javascript";
    const titleParam = searchParams.get("title");

    if (encodedCode) {
      try {
        const decodedCode = atob(encodedCode);
        setInitialCode(decodedCode);
      } catch (e) {
        console.error("Failed to decode code:", e);
      }
    }

    setInitialLanguage(language);
    if (titleParam) {
      setTitle(decodeURIComponent(titleParam));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
          </div>
        </div>
      </header>

      {/* Code Editor */}
      <main className="container px-4 py-4">
        <AdvancedCodeEditor
          initialCode={initialCode}
          defaultLanguage={initialLanguage}
          onSubmit={(code, language) => {
            console.log("Submitted:", { code, language });
          }}
        />
      </main>
    </div>
  );
};

export default CodePlayground;