import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bgColor?: string;
}

const StatsCard = ({ icon: Icon, label, value, bgColor = "bg-primary" }: StatsCardProps) => {
  return (
    <Card className="p-6 hover:shadow-elevated transition-smooth">
      <div className="flex items-center gap-4">
        <div className={`${bgColor} p-3 rounded-xl text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
