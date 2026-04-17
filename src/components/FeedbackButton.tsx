import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface FeedbackButtonProps {
  type: 'yrke' | 'studie' | 'bedrift' | 'sektor' | 'institusjon';
  entityId: string;
  entityLabel?: string;
}

const KATEGORIER: Record<string, string> = {
  feil_bransje:      'Feil bransje / sektor',
  feil_data:         'Feil data (lønn, ledighet, opptakspoeng, …)',
  feil_kobling:      'Feil kobling til yrke/studie/bedrift',
  mangler_data:      'Mangler data / tomt',
  duplikat:          'Duplikat (samme element flere ganger)',
  feil_beskrivelse:  'Feil eller villedende beskrivelse',
  annet:             'Annet',
};

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ type, entityId, entityLabel }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [kategori, setKategori] = useState<string>('');
  const [melding, setMelding] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!kategori) {
      toast.error("Velg en kategori først");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.from('feedback_reports').insert({
        type,
        entity_id: entityId,
        entity_label: entityLabel || entityId,
        url: location.pathname,
        kategori,
        melding: melding.trim() || null,
      });
      if (error) throw error;
      toast.success("Takk! Rapporten er mottatt.", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      });
      setOpen(false);
      setKategori('');
      setMelding('');
    } catch (e: any) {
      toast.error("Kunne ikke sende: " + (e?.message || 'ukjent feil'));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
          Rapportér feil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rapportér feil på «{entityLabel || entityId}»</DialogTitle>
          <DialogDescription>
            Hjelp oss å gjøre dataene bedre. Hva er galt?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium mb-1.5 block">Kategori</label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger><SelectValue placeholder="Velg en kategori" /></SelectTrigger>
              <SelectContent>
                {Object.entries(KATEGORIER).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1.5 block">Utdyping (valgfritt)</label>
            <Textarea
              value={melding}
              onChange={(e) => setMelding(e.target.value)}
              placeholder="F.eks. 'Bunkersmegler burde ligge i Transport, ikke Økonomi'"
              className="text-sm"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button onClick={send} disabled={sending || !kategori}>
            {sending ? 'Sender…' : 'Send rapport'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;
