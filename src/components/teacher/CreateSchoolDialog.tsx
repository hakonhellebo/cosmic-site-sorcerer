import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onCreateSchool: (name: string, address?: string, email?: string) => Promise<any>;
}

const CreateSchoolDialog: React.FC<Props> = ({ onCreateSchool }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Skriv inn skolenavn'); return; }
    setLoading(true);
    const result = await onCreateSchool(name.trim(), address.trim() || undefined, email.trim() || undefined);
    setLoading(false);
    if (result) {
      toast.success('Skole opprettet!');
      setName(''); setAddress(''); setEmail('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4" /> Opprett skole
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opprett ny skole</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school-name">Skolenavn *</Label>
            <Input id="school-name" value={name} onChange={e => setName(e.target.value)} placeholder="F.eks. Bergen Katedralskole" />
          </div>
          <div>
            <Label htmlFor="school-address">Adresse</Label>
            <Input id="school-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Valgfritt" />
          </div>
          <div>
            <Label htmlFor="school-email">Kontakt e-post</Label>
            <Input id="school-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Valgfritt" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            {loading ? 'Oppretter...' : 'Opprett skole'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolDialog;
