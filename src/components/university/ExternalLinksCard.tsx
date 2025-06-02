
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface LinkItem {
  url: string;
  label: string;
}

interface ExternalLinksCardProps {
  links: LinkItem[];
}

const ExternalLinksCard: React.FC<ExternalLinksCardProps> = ({ links }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Les mer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link, index) => (
            <Button key={index} variant="outline" className="w-full" asChild>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalLinksCard;
