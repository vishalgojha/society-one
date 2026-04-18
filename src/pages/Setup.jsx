import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Setup() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    societyName: '',
    address: '',
    propertyName: '',
    unitNumber: '',
    ownerName: '',
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const society = await entities.Society.create({
        name: form.societyName,
        address: form.address,
      });
      const property = await entities.Property.create({
        societyId: society.id,
        name: form.propertyName,
        unitNumber: form.unitNumber,
        ownerName: form.ownerName,
      });
      if (user?.id) {
        await entities.Operator.create({
          userId: user.id,
          societyId: society.id,
          propertyId: property.id,
          name: user.email,
          role: 'admin',
        });
      }
      localStorage.setItem('activeSocietyName', society.name);
      return { society, property };
    },
    onSuccess: () => toast.success('Society bootstrapped'),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Bootstrap society</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={form.societyName} onChange={(event) => setForm((current) => ({ ...current, societyName: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Society name" />
          <Input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Address" />
          <Input value={form.propertyName} onChange={(event) => setForm((current) => ({ ...current, propertyName: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Primary property name" />
          <Input value={form.unitNumber} onChange={(event) => setForm((current) => ({ ...current, unitNumber: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Unit / tower" />
          <Input value={form.ownerName} onChange={(event) => setForm((current) => ({ ...current, ownerName: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Owner / resident name" />
          <Button onClick={() => mutation.mutate()} className="h-12 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">
            {mutation.isPending ? 'Creating...' : 'Create society'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
