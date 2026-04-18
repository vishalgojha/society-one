import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entities } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AI_TASKS = ['security', 'vision', 'notification', 'quick'];

function getAiBaseUrl() {
  if (typeof window === 'undefined') return 'https://api.societyone.live';
  if (window.location.hostname === 'localhost') return 'https://api.societyone.live';
  if (window.location.hostname === 'societyone.live' || window.location.hostname === 'www.societyone.live') {
    return 'https://api.societyone.live';
  }
  return `${window.location.protocol}//${window.location.host}`;
}

export default function Settings() {
  const queryClient = useQueryClient();
  const { operator, societyId } = useAuth();
  const [form, setForm] = useState({ whatsappEnabled: true, emailEnabled: false });
  const aiBaseUrl = getAiBaseUrl();

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

  const { data: aiHealth } = useQuery({
    queryKey: ['ai-health'],
    queryFn: async () => {
      const response = await fetch(`${aiBaseUrl}/health`);
      if (!response.ok) throw new Error('AI health check failed');
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: aiRoutes = [] } = useQuery({
    queryKey: ['ai-model-routes'],
    queryFn: async () => {
      return Promise.all(
        AI_TASKS.map(async (task) => {
          const response = await fetch(`${aiBaseUrl}/debug/model-route?task=${task}`);
          if (!response.ok) throw new Error(`Model route failed for ${task}`);
          return response.json();
        })
      );
    },
    refetchInterval: 30000,
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
    <div className="grid max-w-5xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader><CardTitle className="text-white">Notification settings</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div>
              <p className="font-medium text-white">WhatsApp alerts</p>
              <p className="text-sm text-slate-500">Preference only right now. Baileys transport is not wired yet.</p>
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

      <Card className="rounded-3xl border-slate-800 bg-slate-900/80">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-white">AI routing status</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-300">
              {aiHealth?.ok ? 'Bridge live' : 'Checking'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Live model routing from the Hetzner Ollama bridge.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-white">Bridge endpoint</p>
            <p className="mt-1 break-all text-sm text-slate-400">{aiBaseUrl}</p>
            <p className="mt-3 text-xs text-slate-500">Ollama: {aiHealth?.ollama || 'loading...'}</p>
          </div>

          <div className="space-y-3">
            {aiRoutes.map((route) => (
              <div key={route.task} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium capitalize text-white">{route.task}</p>
                    <p className="text-sm text-slate-500">Preferred: {route.preferredModel}</p>
                  </div>
                  <Badge className="bg-slate-800 text-slate-200">{route.source}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-300">Selected: {route.selectedModel || 'none'}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Fallbacks: {route.fallbackChain?.join(' -> ')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
