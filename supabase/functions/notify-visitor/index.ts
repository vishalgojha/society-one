import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (request) => {
  const body = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    notified: Boolean(body.visitorName),
  });
});
