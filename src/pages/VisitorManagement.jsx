import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function VisitorManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState({ name: '', phone: '', purpose: '' });

  const { data: visitors = [] } = useQuery({
    queryKey: ['visitor-management'],
    queryFn: () => entities.VisitorEntry.list('-checkInTime', 200),
  });

  const createMutation = useMutation({
    mutationFn: () => entities.VisitorEntry.create({ ...draft, visitorType: 'manual', status: 'checked_in' }),
    onSuccess: () => {
      setDraft({ name: '', phone: '', purpose: '' });
      toast.success('Visitor added');
      queryClient.invalidateQueries({ queryKey: ['visitor-management'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.VisitorEntry.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visitor-management'] }),
  });

  const filtered = visitors.filter((visitor) =>
    [visitor.name, visitor.phone, visitor.purpose].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Manual visitor entry</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Name" />
          <Input value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Phone" />
          <Input value={draft.purpose} onChange={(event) => setDraft((current) => ({ ...current, purpose: event.target.value }))} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Purpose" />
          <Button onClick={() => createMutation.mutate()} className="h-12 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">Create entry</Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader className="gap-4">
          <CardTitle className="text-white">Visitor records</CardTitle>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Search visitors..." />
        </CardHeader>
        <CardContent className="space-y-3">
          {filtered.map((visitor) => (
            <div key={visitor.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div>
                <p className="font-medium text-white">{visitor.name || 'Unknown visitor'}</p>
                <p className="text-sm text-slate-500">{visitor.phone || 'No phone'} • {visitor.purpose || 'Visit'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => updateMutation.mutate({ id: visitor.id, data: { verified: !visitor.verified } })} className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                  {visitor.verified ? 'Unverify' : 'Verify'}
                </Button>
                <Button variant="outline" onClick={() => updateMutation.mutate({ id: visitor.id, data: { isVIP: !visitor.isVIP } })} className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                  {visitor.isVIP ? 'Remove VIP' : 'Mark VIP'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
