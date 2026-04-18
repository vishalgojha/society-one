import React from 'react';
import { AlertTriangle, FileX, Clock, ShieldAlert } from "lucide-react";

const problems = [
    {
        icon: FileX,
        title: "Paper registers are a mess",
        description: "Illegible handwriting, missing entries, torn pages. When you need records, they're nowhere to be found."
    },
    {
        icon: Clock,
        title: "Typing slows everything down",
        description: "Guards waste time typing on small screens. Long queues at the gate. Visitors get frustrated."
    },
    {
        icon: ShieldAlert,
        title: "No real security records",
        description: "Can't verify who visited when. No photos. No way to search past visitors during emergencies."
    },
    {
        icon: AlertTriangle,
        title: "Errors everywhere",
        description: "Wrong names, wrong flat numbers, fake phone numbers. Guards make mistakes when rushed."
    },
];

export default function ProblemSection() {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Still using a visitor register book?
                    </h2>
                    <p className="text-xl text-slate-400">
                        You're not alone. But there's a better way.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;
                        return (
                            <div 
                                key={index}
                                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all"
                            >
                                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-red-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{problem.description}</p>
                            </div>
                        );
                    })}
                </div>
                
                {/* Visual */}
                <div className="mt-16 max-w-2xl mx-auto">
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center">
                        <FileX className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 italic">Visual: Messy paper register or stressed guard</p>
                    </div>
                </div>
            </div>
        </section>
    );
}