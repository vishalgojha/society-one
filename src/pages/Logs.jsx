import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Logs() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: visitors = [] } = useQuery({
    queryKey: ['visitors'],
    queryFn: () => entities.VisitorEntry.list('-checkInTime', 300),
  });

  const mutation = useMutation({
    mutationFn: ({ id, updates }) => entities.VisitorEntry.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visitors'] }),
  });

  const filtered = visitors.filter((visitor) => {
    const haystack = [visitor.name, visitor.phone, visitor.flatOrRoom, visitor.purpose].join(' ').toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
      <CardHeader className="gap-4">
        <CardTitle className="text-white">Visitor logs</CardTitle>
        <Input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 rounded-2xl border-slate-700 bg-slate-950 text-white" placeholder="Search name, flat, purpose..." />
      </CardHeader>
      <CardContent className="space-y-3">
        {filtered.map((visitor) => (
          <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{visitor.name || 'Unknown visitor'}</p>
                <p className="text-sm text-slate-500">{visitor.phone || 'No phone'} • {visitor.flatOrRoom || 'General entry'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => mutation.mutate({ id: visitor.id, updates: { isVIP: !visitor.isVIP } })} className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                  {visitor.isVIP ? 'Remove VIP' : 'Mark VIP'}
                </Button>
                {visitor.status !== 'checked_out' && (
                  <Button onClick={() => mutation.mutate({ id: visitor.id, updates: { status: 'checked_out', checkOutTime: new Date().toISOString() } })} className="bg-emerald-500 text-white hover:bg-emerald-600">
                    Check out
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
