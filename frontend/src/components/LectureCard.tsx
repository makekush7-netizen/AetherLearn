import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LectureCardProps {
  id: string;
  title: string;
  subject: string;
  duration: string;
  progress: number;
  thumbnail?: string;
}

const LectureCard = ({ id, title, subject, duration, progress, thumbnail }: LectureCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-smooth">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="h-16 w-16 text-primary/40" />
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <p className="text-xs text-primary font-medium">{subject}</p>
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">{title}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>

        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Link to={`/lecture/${id}`}>
          <Button className="w-full">
            {progress > 0 ? "Continue" : "Start"} Lecture
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default LectureCard;
