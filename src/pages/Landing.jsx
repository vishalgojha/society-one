import React from 'react';
import { Bell, Building2, ScanFace, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import OperatorLogin from '@/components/landing/OperatorLogin';
import { Button } from '@/components/ui/button';

const highlights = [
  { title: 'Per-society RBAC', copy: 'Operators, guards, admins, and residents see only the actions their society allows.', icon: ShieldCheck },
  { title: 'Fast mobile check-in', copy: 'A phone-first flow with photo capture, property targeting, and verification before entry.', icon: ScanFace },
  { title: 'Actionable alerts', copy: 'Pre-approved matches, logs, reports, and analytics all live on one Supabase data model.', icon: Bell },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <section className="flex flex-col justify-between rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-8 shadow-2xl lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              <Building2 className="h-4 w-4" />
              SocietyOne
            </div>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Visitor security for societies that need structure, not spreadsheets.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Multi-tenant visitor management with Supabase auth, role-aware access, edge-function automations, and a PWA shell tuned for front-gate operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-500 text-white hover:bg-emerald-600">
                <Link to="/OperatorAuth">Operator access</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-800">
                <Link to="/Landing">Explore product</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <item.icon className="h-5 w-5 text-emerald-300" />
                <h2 className="mt-3 font-medium">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="flex items-center">
          <div className="w-full rounded-[2rem] border border-slate-800 bg-slate-900/85 p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Secure Sign-In</p>
            <h2 className="mt-3 text-2xl font-semibold">Operator magic link</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your email to receive a sign-in link. Your operator profile and society role are resolved after authentication.
            </p>
            <div className="mt-8">
              <OperatorLogin />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
