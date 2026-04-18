import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { entities } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SecurityDashboard() {
  const { data } = useQuery({
    queryKey: ['security-dashboard'],
    queryFn: async () => {
      const [visitors, preApproved] = await Promise.all([
        entities.VisitorEntry.list('-checkInTime', 200),
        entities.PreApprovedVisitor.list('-createdAt', 100),
      ]);
      return {
        highRisk: visitors.filter((visitor) => visitor.securityVerification?.riskLevel === 'high'),
        unverified: visitors.filter((visitor) => !visitor.verified),
        preApproved,
      };
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><AlertTriangle className="h-4 w-4 text-amber-300" /> High-risk visitors</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(data?.highRisk || []).map((visitor) => (
            <div key={visitor.id} className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="font-medium text-white">{visitor.name}</p>
              <p className="text-sm text-slate-300">{visitor.securityVerification?.recommendation || visitor.purpose}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Unverified check-ins</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(data?.unverified || []).slice(0, 12).map((visitor) => (
            <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="font-medium text-white">{visitor.name}</p>
              <p className="text-sm text-slate-500">{visitor.phone || 'No phone'} • {visitor.checkInTime || 'No time'}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Pre-approved roster</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(data?.preApproved || []).slice(0, 12).map((visitor) => (
            <div key={visitor.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div>
                <p className="font-medium text-white">{visitor.name}</p>
                <p className="text-sm text-slate-500">{visitor.phone || 'No phone'}</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-300">Approved</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
