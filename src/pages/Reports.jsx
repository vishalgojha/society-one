import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText } from 'lucide-react';
import { entities } from '@/api/entities';
import { invokeFunction } from '@/api/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Reports() {
  const { data } = useQuery({
    queryKey: ['reports-summary'],
    queryFn: async () => {
      const [visitors, scheduledTasks] = await Promise.all([
        entities.VisitorEntry.list('-checkInTime', 100),
        entities.ScheduledTask.list('-createdAt', 20),
      ]);
      return { visitors, scheduledTasks };
    },
  });

  const exportCsv = async () => {
    const response = await invokeFunction('exportVisitors', { filters: {} });
    const blob = new Blob([response.data.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `societyone-visitors-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV export generated');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Export visitors</CardTitle>
          <Button onClick={exportCsv} className="bg-emerald-500 text-white hover:bg-emerald-600">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.visitors || []).slice(0, 12).map((visitor) => (
            <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="font-medium text-white">{visitor.name || 'Unknown visitor'}</p>
              <p className="text-sm text-slate-500">{visitor.purpose || 'Visit'} • {visitor.checkInTime || 'No time'}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Scheduled reports</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(data?.scheduledTasks || []).map((task) => (
            <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-emerald-300" />
                <div>
                  <p className="font-medium text-white">{task.name}</p>
                  <p className="text-sm text-slate-500">{task.cron}</p>
                </div>
              </div>
            </div>
          ))}
          {!data?.scheduledTasks?.length && <p className="text-sm text-slate-500">No scheduled reports configured.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
