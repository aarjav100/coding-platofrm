import { Link } from "react-router-dom";
import { Code2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ImageCarousel,
  CodeSnippetCarousel,
  VideoCarousel,
  TestimonialCarousel,
  MixedContentCarousel,
  ThumbnailCarousel,
  InfiniteLoopCarousel,
} from "@/components/carousels";

// Sample data for carousels
const imageSlides = [
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
    alt: "Code on screen",
    title: "Master Programming",
    description: "Learn to code with interactive tutorials",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
    alt: "Laptop coding",
    title: "Build Real Projects",
    description: "Create portfolio-worthy applications",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
    alt: "Programming setup",
    title: "Modern Tech Stack",
    description: "React, TypeScript, and more",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
    alt: "Clean code",
    title: "Clean Code Practices",
    description: "Write maintainable, scalable code",
  },
];

const codeSlides = [
  {
    title: "React Hooks Example",
    language: "javascript",
    code: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    description: "A simple counter using useState and useEffect hooks",
  },
  {
    title: "TypeScript Interface",
    language: "typescript",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
    description: "Type-safe interfaces for better code quality",
  },
  {
    title: "Python Quick Sort",
    language: "python",
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Example usage
print(quicksort([3, 6, 8, 10, 1, 2, 1]))`,
    description: "Efficient O(n log n) sorting algorithm",
  },
];

const videoSlides = [
  {
    src: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    title: "JavaScript Fundamentals",
    description: "Complete beginner's guide to JavaScript",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
  },
  {
    src: "https://www.youtube.com/watch?v=O6P86uwfdR0",
    title: "React Hooks Deep Dive",
    description: "Master useState, useEffect, and custom hooks",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  },
  {
    src: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
    title: "TypeScript for Beginners",
    description: "Add type safety to your JavaScript projects",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
  },
];

const testimonials = [
  {
    quote: "This platform helped me transition from a complete beginner to landing my first developer job in just 6 months!",
    author: "Aarjav Jain",
    role: "Frontend Developer",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "The interactive coding challenges and real-time feedback made learning algorithms so much easier and fun.",
    author: "Priya Sharma",
    role: "Software Engineer",
    company: "StartupXYZ",
    rating: 5,
  },
  {
    quote: "Best investment I made in my career. The content quality and teaching methodology is top-notch.",
    author: "Rahul Kumar",
    role: "Full Stack Developer",
    company: "Digital Agency",
    rating: 5,
  },
  {
    quote: "I was skeptical at first, but the project-based approach really helped me understand complex concepts.",
    author: "Sneha Patel",
    role: "Junior Developer",
    company: "InnovateTech",
    rating: 4,
  },
];

const mixedSlides = [
  {
    type: 'image' as const,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    title: "Learn Together",
    description: "Join our community of 50,000+ developers learning and growing together",
    badge: "Community",
    ctaText: "Join Now",
    ctaLink: "/auth",
  },
  {
    type: 'video' as const,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200",
    videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
    title: "Free JavaScript Course",
    description: "Start your coding journey with our comprehensive JavaScript fundamentals course",
    badge: "Free Course",
    ctaText: "Start Learning",
    ctaLink: "/module/javascript-basics",
  },
  {
    type: 'content' as const,
    title: "Weekly Coding Contests",
    description: "Challenge yourself with algorithmic problems and compete with developers worldwide",
    badge: "Contests",
    ctaText: "View Contests",
    ctaLink: "/contests",
    gradient: "bg-gradient-to-br from-green-600 to-emerald-700",
  },
];

const thumbnailSlides = [
  { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800", alt: "Coding", title: "Web Development" },
  { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", alt: "Setup", title: "Development Setup" },
  { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", alt: "Laptop", title: "Clean Code" },
  { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", alt: "Work", title: "Remote Work" },
  { src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800", alt: "Debug", title: "Debugging" },
  { src: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800", alt: "TypeScript", title: "TypeScript" },
];

const techLogos = [
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", alt: "JavaScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", alt: "TypeScript" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", alt: "Java" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", alt: "C++" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", alt: "MongoDB" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", alt: "PostgreSQL" },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker" },
];

export default function CarouselShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CodeMaster</span>
          </Link>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Carousel <span className="text-primary">Showcase</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore all 7 types of carousels available in our platform
          </p>
        </div>

        {/* 1. Image Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">1. Image Slideshow</h2>
            <p className="text-muted-foreground">Automatic sliding with navigation arrows and dot indicators</p>
          </div>
          <ImageCarousel slides={imageSlides} autoplay autoplayInterval={4000} />
        </section>

        {/* 2. Code Snippet Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">2. Code Snippet Slideshow</h2>
            <p className="text-muted-foreground">Syntax-highlighted code with copy functionality</p>
          </div>
          <CodeSnippetCarousel slides={codeSlides} />
        </section>

        {/* 3. Video Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">3. Video Slideshow</h2>
            <p className="text-muted-foreground">Video tutorials with play controls and thumbnails</p>
          </div>
          <VideoCarousel slides={videoSlides} />
        </section>

        {/* 4. Testimonial Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">4. Testimonial Slider</h2>
            <p className="text-muted-foreground">Student reviews with ratings and profile info</p>
          </div>
          <TestimonialCarousel testimonials={testimonials} autoplay />
        </section>

        {/* 5. Mixed Content Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">5. Mixed Content Slideshow</h2>
            <p className="text-muted-foreground">Combines images, videos, and CTAs in hero-style slides</p>
          </div>
          <MixedContentCarousel slides={mixedSlides} />
        </section>

        {/* 6. Thumbnail Navigation Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">6. Thumbnail Navigation Slider</h2>
            <p className="text-muted-foreground">Main slide with clickable thumbnail previews below</p>
          </div>
          <ThumbnailCarousel slides={thumbnailSlides} />
        </section>

        {/* 7. Infinite Loop Carousel */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">7. Infinite Loop Slider</h2>
            <p className="text-muted-foreground">Seamlessly looping logos/icons - perfect for tech stacks or partners</p>
          </div>
          <div className="bg-muted/30 py-8 rounded-xl">
            <InfiniteLoopCarousel items={techLogos} speed={25} />
          </div>
        </section>
      </main>
    </div>
  );
}
