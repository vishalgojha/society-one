import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-400">
          <span className="font-medium text-slate-200">{pageName || 'This route'}</span> is not available in the current app shell.
        </p>
        <Button asChild className="mt-6 bg-emerald-500 text-white hover:bg-emerald-600">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to app
          </Link>
        </Button>
      </div>
    </div>
  );
}
