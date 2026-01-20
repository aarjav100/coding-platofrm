import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MixedSlide {
  type: 'image' | 'video' | 'content';
  image?: string;
  videoUrl?: string;
  title: string;
  description: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  gradient?: string;
}

interface MixedContentCarouselProps {
  slides: MixedSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
}

export function MixedContentCarousel({
  slides,
  autoplay = true,
  autoplayInterval = 6000,
  className
}: MixedContentCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setPlayingVideo(null);
    });
  }, [api]);

  useEffect(() => {
    if (!api || !autoplay || playingVideo !== null) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayInterval, playingVideo]);

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
              <div
                className={cn(
                  "relative aspect-[21/9] md:aspect-[21/7] overflow-hidden rounded-xl",
                  !slide.image && !slide.videoUrl && (slide.gradient || "bg-gradient-to-br from-primary to-accent")
                )}
              >
                {/* Background */}
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {slide.type === 'video' && playingVideo === index && slide.videoUrl && (
                  <iframe
                    src={`${slide.videoUrl}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center p-8 md:p-12 max-w-2xl">
                  {slide.badge && (
                    <Badge className="w-fit mb-4 bg-primary/90">{slide.badge}</Badge>
                  )}

                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                    {slide.title}
                  </h2>

                  <p className="text-white/80 text-sm md:text-base mb-6 line-clamp-2">
                    {slide.description}
                  </p>

                  <div className="flex gap-3">
                    {slide.ctaText && (
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90"
                        onClick={() => {
                          if (slide.ctaLink) {
                            if (slide.ctaLink.startsWith('#')) {
                              const element = document.querySelector(slide.ctaLink);
                              element?.scrollIntoView({ behavior: 'smooth' });
                            } else if (slide.ctaLink.startsWith('/')) {
                              window.location.href = slide.ctaLink; // Simple navigation or we could accept navigate prop
                            } else {
                              window.open(slide.ctaLink, '_blank');
                            }
                          }
                        }}
                      >
                        {slide.ctaText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}

                    {slide.type === 'video' && playingVideo !== index && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                        onClick={() => setPlayingVideo(index)}
                      >
                        <Play className="w-4 h-4 mr-2 fill-current" />
                        Watch Video
                      </Button>
                    )}
                  </div>
                </div>
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
