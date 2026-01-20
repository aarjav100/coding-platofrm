import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LogoItem {
  src: string;
  alt: string;
  link?: string;
}

interface InfiniteLoopCarouselProps {
  items: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteLoopCarousel({ 
  items, 
  speed = 30, 
  direction = 'left',
  pauseOnHover = true,
  className 
}: InfiniteLoopCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!scrollerRef.current || !scrollerInnerRef.current) return;

    const scrollerContent = Array.from(scrollerInnerRef.current.children);
    
    // Duplicate items for infinite scroll effect
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement;
      scrollerInnerRef.current?.appendChild(duplicatedItem);
    });

    scrollerRef.current.style.setProperty('--animation-duration', `${speed}s`);
    scrollerRef.current.setAttribute('data-animated', 'true');
  }, [speed]);

  return (
    <div 
      ref={scrollerRef}
      className={cn(
        "scroller relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        pauseOnHover && "hover:[animation-play-state:paused]",
        className
      )}
    >
      <ul 
        ref={scrollerInnerRef}
        className={cn(
          "flex gap-8 w-max animate-scroll",
          direction === 'right' && "animate-scroll-reverse",
          pauseOnHover && "[&:hover]:paused"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex-shrink-0"
          >
            {item.link ? (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </a>
            ) : (
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img 
                  src={item.src} 
                  alt={item.alt} 
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
