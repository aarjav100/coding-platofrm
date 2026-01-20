import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoSlide {
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
  type?: 'youtube' | 'local';
}

interface VideoCarouselProps {
  slides: VideoSlide[];
  className?: string;
}

export function VideoCarousel({ slides, className }: VideoCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setIsPlaying(null); // Stop playing when slide changes
    });
  }, [api]);

  const togglePlay = (index: number) => {
    setIsPlaying(isPlaying === index ? null : index);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`;
  };

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
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black group">
                {isPlaying === index ? (
                  isYouTube(slide.src) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(slide.src)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={slide.src}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      controls
                    />
                  )
                ) : (
                  <>
                    {slide.thumbnail ? (
                      <img
                        src={slide.thumbnail}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => togglePlay(index)}
                        className="rounded-full w-16 h-16 bg-white/90 hover:bg-white"
                      >
                        <Play className="w-8 h-8 text-black fill-current" />
                      </Button>
                    </div>
                    
                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-white text-xl font-bold mb-1">{slide.title}</h3>
                      {slide.description && (
                        <p className="text-white/70 text-sm">{slide.description}</p>
                      )}
                    </div>
                  </>
                )}
                
                {/* Mute toggle for playing videos */}
                {isPlaying === index && !isYouTube(slide.src) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleMute}
                    className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </Button>
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
