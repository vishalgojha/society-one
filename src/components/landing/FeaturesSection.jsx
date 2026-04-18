import React from 'react';
import { 
    Mic, Camera, LayoutDashboard, Building2, 
    Shield, Smartphone, Database, Clock 
} from "lucide-react";

const features = [
    {
        icon: Mic,
        title: "Visitor self check-in by voice",
        description: "Visitors speak their name and purpose. No typing, no confusion, no delays."
    },
    {
        icon: Camera,
        title: "Face photo + timestamp",
        description: "Every check-in is timestamped with a photo. Clear audit trail."
    },
    {
        icon: LayoutDashboard,
        title: "Guard supervision dashboard",
        description: "Guards see who's in the building right now. Approve or escalate instantly."
    },
    {
        icon: Building2,
        title: "Multi-property support",
        description: "Run multiple societies or hotels from one admin account."
    },
    {
        icon: Shield,
        title: "Admin-controlled system",
        description: "Full control over guards, approvals, and visitor logs."
    },
    {
        icon: Smartphone,
        title: "Works on any smartphone",
        description: "Android or iPhone. Standard hardware. No special setup."
    },
    {
        icon: Database,
        title: "Digital visitor records",
        description: "Search, export, archive. Print or save to Excel. Compliance ready."
    },
    {
        icon: Clock,
        title: "Faster than a register",
        description: "Visitor self check-in in under 30 seconds. Peak hours just work."
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Everything you need. Nothing you don't.
                    </h2>
                    <p className="text-xl text-slate-400">
                        Built for Indian societies and hotels. Simple, secure, and reliable.
                    </p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div 
                                key={index}
                                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
                            >
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}