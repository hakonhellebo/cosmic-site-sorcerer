
import React from 'react';
import { Lightbulb, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DimensionsCardProps {
  dimensions: Array<{ name: string; description: string }>;
}

const DimensionsCard: React.FC<DimensionsCardProps> = ({ dimensions }) => {
  return (
    <div className="bg-muted/50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Dine topp dimensjoner</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="inline-flex">
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Dimensjoner er egenskaper og ferdighetskategorier som hjelper deg å forstå hva du kan være god til og trives med.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {dimensions.slice(0, 3).map((dim, index) => (
          <div 
            key={index} 
            className="p-3 bg-primary/10 rounded-md border border-primary/20 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium">{dim.name}</h4>
            <p className="text-sm text-muted-foreground">{dim.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DimensionsCard;
