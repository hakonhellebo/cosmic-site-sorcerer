
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle2, BarChart3, Lightbulb, Target, Book, Briefcase, User, Clock } from "lucide-react";

interface ResultCardProps {
  title: string;
  icon: string;
  items: {
    label: string;
    value: string | React.ReactNode;
  }[];
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, items }) => {
  const getIcon = (iconName: string) => {
    const icons = {
      award: <Award className="h-6 w-6 text-primary" />,
      check: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      chart: <BarChart3 className="h-6 w-6 text-blue-500" />,
      idea: <Lightbulb className="h-6 w-6 text-amber-500" />,
      target: <Target className="h-6 w-6 text-red-500" />,
      education: <Book className="h-6 w-6 text-indigo-500" />,
      work: <Briefcase className="h-6 w-6 text-purple-500" />,
      user: <User className="h-6 w-6 text-slate-500" />,
      time: <Clock className="h-6 w-6 text-orange-500" />
    };
    return icons[iconName as keyof typeof icons] || icons.chart;
  };

  return (
    <Card className="overflow-hidden animate-scale-in">
      <CardContent className="p-0">
        <div className="bg-muted/40 p-4 flex items-center gap-4 border-b">
          {getIcon(icon)}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="grid grid-cols-2 gap-4">
                <span className="font-medium text-muted-foreground">{item.label}:</span>
                <span className="font-medium">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
