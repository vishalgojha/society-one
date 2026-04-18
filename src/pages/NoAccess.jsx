import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { useAuth } from '@/lib/AuthContext';

export default function NoAccess() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-slate-400 mb-8">
                    You don't have an operator account yet. Please contact the administrator to get access.
                </p>
                
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
                    <div className="flex items-center gap-3 text-slate-300">
                        <Mail className="h-5 w-5 text-emerald-400" />
                        <div className="text-left">
                            <p className="text-sm text-slate-400">Contact Admin:</p>
                            <a href="mailto:hello@chaoscraftlabs.com" className="font-semibold hover:text-emerald-400 transition-colors">
                                hello@chaoscraftlabs.com
                            </a>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
