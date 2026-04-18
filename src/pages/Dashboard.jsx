import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Building2, ClipboardCheck, Shield, UserRoundCheck, Users } from 'lucide-react';
import { formatDistanceToNow, parseISO, startOfDay, subDays } from 'date-fns';
import { entities } from '@/api/entities';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const statCards = [
  { key: 'todayVisitors', label: "Today's visitors", icon: Users },
  { key: 'activePreApproved', label: 'Active pre-approved', icon: UserRoundCheck },
  { key: 'onDutyOperators', label: 'On-duty operators', icon: Shield },
  { key: 'pendingCheckouts', label: 'Pending checkouts', icon: ClipboardCheck },
];

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const [visitors, preApproved, operators, properties] = await Promise.all([
        entities.VisitorEntry.list('-checkInTime', 250),
        entities.PreApprovedVisitor.list('-createdAt', 100),
        entities.Operator.list('-updatedDate', 100),
        entities.Property.list('-createdAt', 50),
      ]);

      const today = startOfDay(new Date());
      const todayVisitors = visitors.filter((entry) => entry.checkInTime && new Date(entry.checkInTime) >= today);
      const activePreApproved = preApproved.filter((item) => {
        const now = new Date();
        return (!item.validFrom || new Date(item.validFrom) <= now) && (!item.validUntil || new Date(item.validUntil) >= now);
      });
      const onDutyOperators = operators.filter((item) => item.isOnDuty);
      const pendingCheckouts = visitors.filter((item) => item.status !== 'checked_out' && !item.checkOutTime);

      const trend = Array.from({ length: 7 }).map((_, index) => {
        const date = startOfDay(subDays(new Date(), 6 - index));
        const count = visitors.filter((item) => item.checkInTime && startOfDay(new Date(item.checkInTime)).getTime() === date.getTime()).length;
        return {
          day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
          visitors: count,
        };
      });

      return {
        stats: {
          todayVisitors: todayVisitors.length,
          activePreApproved: activePreApproved.length,
          onDutyOperators: onDutyOperators.length,
          pendingCheckouts: pendingCheckouts.length,
        },
        trend,
        recentVisitors: visitors.slice(0, 6),
        properties,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <Skeleton key={card.key} className="h-32 rounded-3xl bg-slate-800/70" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-3xl bg-slate-800/70" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key} className="rounded-3xl border-slate-800 bg-slate-900/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{card.label}</CardTitle>
              <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300">
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-white">{data.stats[card.key]}</div>
              <p className="mt-2 text-xs text-slate-500">Live within the current society scope.</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-white">7-day visitor trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend}>
                <defs>
                  <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16 }} />
                <Area type="monotone" dataKey="visitors" stroke="#34d399" fill="url(#trend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent visitors</CardTitle>
            <Badge variant="outline" className="border-slate-700 bg-slate-950 text-slate-300">
              {data.properties.length} properties
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <Avatar className="h-11 w-11 border border-slate-700">
                  <AvatarFallback className="bg-slate-800 text-slate-200">
                    {(visitor.name || 'V')
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{visitor.name || 'Unknown visitor'}</p>
                  <p className="truncate text-sm text-slate-400">{visitor.phone || 'No phone'} • {visitor.flatOrRoom || 'General entry'}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-800">{visitor.purpose || 'Visit'}</Badge>
                  <p className="mt-2 text-xs text-slate-500">
                    {visitor.checkInTime ? formatDistanceToNow(parseISO(visitor.checkInTime), { addSuffix: true }) : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
            {!data.recentVisitors.length && (
              <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-sm text-slate-500">
                No recent visitors yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white"><Building2 className="h-4 w-4 text-emerald-300" /> Society footprint</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">
            {data.properties.slice(0, 4).map((property) => (
              <div key={property.id} className="flex items-center justify-between border-b border-slate-800 py-2 last:border-b-0">
                <span>{property.name || property.unitNumber || 'Property'}</span>
                <span className="text-slate-500">{property.block || property.type || 'unit'}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
