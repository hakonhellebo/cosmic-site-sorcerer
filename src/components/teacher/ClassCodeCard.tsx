import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  joinCode: string;
  className?: string;
}

const ClassCodeCard: React.FC<Props> = ({ joinCode, className }) => {
  const surveyUrl = `${window.location.origin}/survey/join/${joinCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode);
    toast.success('Kode kopiert!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    toast.success('Lenke kopiert!');
  };

  return (
    <Card className={`bg-teal-50 border-teal-100 ${className || ''}`}>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-500 mb-2">Klassekode</p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-mono font-bold text-teal-700 tracking-wider">{joinCode}</span>
          <Button variant="outline" size="sm" onClick={copyCode} className="gap-1">
            <Copy className="h-3 w-3" /> Kopier
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded px-3 py-2 text-xs text-slate-500 truncate border">
            {surveyUrl}
          </div>
          <Button variant="outline" size="sm" onClick={copyLink} className="gap-1 shrink-0">
            <Link2 className="h-3 w-3" /> Kopier lenke
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCodeCard;
