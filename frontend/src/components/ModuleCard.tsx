import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, FileText, Play, Sparkles } from "lucide-react";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  topics: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  price: number;
}

const difficultyColors = {
  beginner: "bg-secondary text-secondary-foreground",
  intermediate: "bg-accent text-accent-foreground",
  advanced: "bg-primary text-primary-foreground",
};

export const ModuleCard = ({ id, title, description, category, topics, difficulty, price }: ModuleCardProps) => {
  return (
    <Link to={`/module/${id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-medium hover:-translate-y-1 border-border bg-card">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {category}
            </Badge>
            <Badge className={`text-xs font-medium ${difficultyColors[difficulty]}`}>
              {difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{topics} topics</span>
            </div>
            <div className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Code</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-3.5 h-3.5" />
              <span>Videos</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animations</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
              <span>Start learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-right">
              {price === 0 ? (
                <Badge className="bg-secondary text-secondary-foreground font-bold">FREE</Badge>
              ) : (
                <div className="text-lg font-bold text-primary">₹{price}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
