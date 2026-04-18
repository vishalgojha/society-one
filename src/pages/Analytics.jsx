import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { entities } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const colors = ['#34d399', '#38bdf8', '#f59e0b', '#f87171', '#a78bfa'];

export default function Analytics() {
  const { data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const visitors = await entities.VisitorEntry.list('-checkInTime', 300);
      const byTypeMap = visitors.reduce((acc, visitor) => {
        acc[visitor.visitorType || 'unknown'] = (acc[visitor.visitorType || 'unknown'] || 0) + 1;
        return acc;
      }, {});
      const byDayMap = visitors.reduce((acc, visitor) => {
        const key = new Date(visitor.checkInTime || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return {
        byType: Object.entries(byTypeMap).map(([name, value]) => ({ name, value })),
        byDay: Object.entries(byDayMap).slice(-7).map(([day, visitors]) => ({ day, visitors })),
      };
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Daily visitor volume</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byDay || []}>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16 }} />
              <Bar dataKey="visitors" radius={[14, 14, 0, 0]} fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Visitor type mix</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data?.byType || []} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                {(data?.byType || []).map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
