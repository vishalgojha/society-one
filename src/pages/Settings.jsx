import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Settings() {
  const queryClient = useQueryClient();
  const { operator, societyId } = useAuth();
  const [form, setForm] = useState({ whatsappEnabled: true, emailEnabled: false });

  useQuery({
    queryKey: ['notification-settings', operator?.id],
    enabled: Boolean(operator?.id),
    queryFn: async () => {
      const [settings] = await entities.NotificationSettings.filter({ operatorId: operator.id });
      if (settings) {
        setForm({ whatsappEnabled: settings.whatsappEnabled, emailEnabled: settings.emailEnabled });
      }
      return settings;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const [settings] = await entities.NotificationSettings.filter({ operatorId: operator.id });
      if (settings) {
        return entities.NotificationSettings.update(settings.id, form);
      }
      return entities.NotificationSettings.create({ ...form, societyId, operatorId: operator.id });
    },
    onSuccess: () => {
      toast.success('Notification settings updated');
      queryClient.invalidateQueries({ queryKey: ['notification-settings', operator?.id] });
    },
  });

  return (
    <Card className="max-w-2xl rounded-3xl border-slate-800 bg-slate-900/80">
      <CardHeader><CardTitle className="text-white">Notification settings</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <p className="font-medium text-white">WhatsApp alerts</p>
            <p className="text-sm text-slate-500">Send real-time visitor notifications to on-duty staff.</p>
          </div>
          <Switch checked={form.whatsappEnabled} onCheckedChange={(checked) => setForm((current) => ({ ...current, whatsappEnabled: checked }))} />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div>
            <p className="font-medium text-white">Email digests</p>
            <p className="text-sm text-slate-500">Send report summaries and resident notifications by email.</p>
          </div>
          <Switch checked={form.emailEnabled} onCheckedChange={(checked) => setForm((current) => ({ ...current, emailEnabled: checked }))} />
        </div>
        <Button onClick={() => mutation.mutate()} className="h-12 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">
          Save settings
        </Button>
      </CardContent>
    </Card>
  );
}
