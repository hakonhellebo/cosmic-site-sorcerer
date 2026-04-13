import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onCreateClass: (name: string, gradeLevel?: string, programArea?: string) => Promise<any>;
}

const CreateClassDialog: React.FC<Props> = ({ onCreateClass }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [programArea, setProgramArea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Skriv inn klassenavn'); return; }
    setLoading(true);
    const result = await onCreateClass(name.trim(), gradeLevel || undefined, programArea || undefined);
    setLoading(false);
    if (result) {
      toast.success('Klasse opprettet!');
      setName(''); setGradeLevel(''); setProgramArea('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4" /> Opprett klasse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opprett ny klasse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="class-name">Klassenavn *</Label>
            <Input id="class-name" value={name} onChange={e => setName(e.target.value)} placeholder="F.eks. VG2 Studiespesialisering A" />
          </div>
          <div>
            <Label>Årstrinn</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger><SelectValue placeholder="Velg årstrinn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="VG1">VG1</SelectItem>
                <SelectItem value="VG2">VG2</SelectItem>
                <SelectItem value="VG3">VG3</SelectItem>
                <SelectItem value="10. trinn">10. trinn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="program-area">Programområde</Label>
            <Input id="program-area" value={programArea} onChange={e => setProgramArea(e.target.value)} placeholder="F.eks. Studiespesialisering" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            {loading ? 'Oppretter...' : 'Opprett klasse'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
