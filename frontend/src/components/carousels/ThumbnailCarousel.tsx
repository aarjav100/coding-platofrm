import { useEffect, useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ThumbnailSlide {
  src: string;
  alt: string;
  title?: string;
}

interface ThumbnailCarouselProps {
  slides: ThumbnailSlide[];
  className?: string;
}

export function ThumbnailCarousel({ slides, className }: ThumbnailCarouselProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onThumbClick = useCallback((index: number) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;

    setCurrent(mainApi.selectedScrollSnap());

    mainApi.on("select", () => {
      setCurrent(mainApi.selectedScrollSnap());
      thumbApi?.scrollTo(mainApi.selectedScrollSnap());
    });
  }, [mainApi, thumbApi]);

  return (
    <div className={cn("relative w-full space-y-4", className)}>
      {/* Main carousel */}
      <Carousel 
        setApi={setMainApi}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                {slide.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-white text-xl font-bold">{slide.title}</h3>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm" />
        <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm" />
      </Carousel>
      
      {/* Thumbnail navigation */}
      <Carousel
        setApi={setThumbApi}
        opts={{ 
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {slides.map((slide, index) => (
            <CarouselItem 
              key={index} 
              className="pl-2 basis-1/4 md:basis-1/5 lg:basis-1/6"
            >
              <button
                onClick={() => onThumbClick(index)}
                className={cn(
                  "relative aspect-video w-full overflow-hidden rounded-lg transition-all duration-300",
                  current === index 
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                    : "opacity-50 hover:opacity-80"
                )}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
