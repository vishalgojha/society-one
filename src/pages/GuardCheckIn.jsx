import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { uploadFile } from '@/api/storage';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function GuardCheckIn() {
  const queryClient = useQueryClient();
  const { operator, societyId } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('gate-entry');
  const [propertyId, setPropertyId] = useState(localStorage.getItem('activePropertyId') || '');
  const [faceFile, setFaceFile] = useState(null);

  const { data: properties = [] } = useQuery({
    queryKey: ['guard-properties'],
    queryFn: () => entities.Property.list('-createdAt', 50),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const facePhoto = faceFile ? await uploadFile(faceFile) : null;
      return entities.VisitorEntry.create({
        societyId,
        propertyId: propertyId || null,
        operatorId: operator?.id,
        name,
        phone,
        purpose,
        visitorType: 'walk_in',
        facePhoto,
        status: 'checked_in',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      toast.success('Guard entry added');
      setName('');
      setPhone('');
      setPurpose('gate-entry');
      setFaceFile(null);
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Guard quick check-in</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-300">Fast lane</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={name} onChange={(event) => setName(event.target.value)} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Visitor name" />
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Phone number" />
          <Input value={purpose} onChange={(event) => setPurpose(event.target.value)} className="h-14 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Purpose" />
          <select value={propertyId} onChange={(event) => setPropertyId(event.target.value)} className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 text-white">
            <option value="">Select property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name || property.unitNumber || property.id}
              </option>
            ))}
          </select>
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 p-6 text-center text-sm text-slate-400">
            {faceFile?.name || 'Tap to add face photo'}
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setFaceFile(event.target.files?.[0] || null)} />
          </label>
          <Button onClick={() => mutation.mutate()} disabled={!name || !propertyId || mutation.isPending} className="h-14 w-full rounded-2xl bg-emerald-500 text-base text-white hover:bg-emerald-600">
            {mutation.isPending ? 'Saving...' : 'Save entry'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
