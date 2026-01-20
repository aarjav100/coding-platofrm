import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSlide {
  title: string;
  code: string;
  language: string;
  description?: string;
}

interface CodeSnippetCarouselProps {
  slides: CodeSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
}

export function CodeSnippetCarousel({
  slides,
  autoplay = false,
  autoplayInterval = 5000,
  className
}: CodeSnippetCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  const copyCode = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayInterval]);

  return (
    <div className={cn("relative w-full", className)}>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="bg-[#1e1e1e] border border-border/50 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 group transition-all hover:shadow-primary/5">
                {/* Mac-style Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-border/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="ml-4 flex items-center gap-2 text-xs font-medium text-zinc-400 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                      <Code2 className="w-3 h-3" />
                      {slide.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block">
                      {slide.language}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(slide.code, index)}
                      className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-green-500 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Code */}
                <div className="max-h-[300px] overflow-auto relative font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <SyntaxHighlighter
                    language={slide.language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent', // Transparent to let container bg show
                      fontSize: '0.9rem',
                    }}
                    showLineNumbers
                    lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", color: "#6e6e6e", textAlign: "right" }}
                  >
                    {slide.code}
                  </SyntaxHighlighter>
                </div>

                {/* Footer/Description */}
                {slide.description && (
                  <div className="px-5 py-4 bg-[#252526] border-t border-white/5 flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium border-l-2 border-primary pl-3">
                      {slide.description}
                    </p>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" title="Live Interpreter Ready" />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm" />
        <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm" />
      </Carousel>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              current === index
                ? "bg-primary w-8"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
