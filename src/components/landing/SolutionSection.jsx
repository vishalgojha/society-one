import React from 'react';
import { Camera, Mic, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Camera,
        number: "1",
        title: "PHOTO",
        description: "Guard takes visitor's photo on phone camera. One tap. Done.",
        color: "bg-blue-500"
    },
    {
        icon: Mic,
        number: "2",
        title: "VOICE",
        description: "Guard speaks visitor details in Hindi, English, or Hinglish. System captures everything.",
        color: "bg-emerald-500"
    },
    {
        icon: CheckCircle,
        number: "3",
        title: "DONE",
        description: "Visitor is logged. Admins can see it instantly. Complete in under 30 seconds.",
        color: "bg-purple-500"
    },
];

export default function SolutionSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Three steps. Every visitor. Every time.
                    </h2>
                    <p className="text-xl text-slate-400">
                        Guards love it because it's faster. Admins love it because it's complete.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center h-full hover:border-slate-600/50 transition-all">
                                    <div className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-slate-700 mb-2">{step.number}</div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <ArrowRight className="h-8 w-8 text-slate-700" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Language Support */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 max-w-4xl mx-auto text-center">
                    <p className="text-emerald-400 font-medium mb-2">Speaks your language</p>
                    <p className="text-white text-lg">
                        Guards can speak in <strong>Hindi</strong>, <strong>English</strong>, or <strong>Hinglish</strong>. 
                        The system logs everything in English for clean, exportable records.
                    </p>
                </div>
                
                {/* Visual Placeholder */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-16 text-center">
                        <div className="flex justify-center gap-8 mb-4">
                            <Camera className="h-12 w-12 text-slate-600" />
                            <ArrowRight className="h-12 w-12 text-slate-700" />
                            <Mic className="h-12 w-12 text-slate-600" />
                            <ArrowRight className="h-12 w-12 text-slate-700" />
                            <CheckCircle className="h-12 w-12 text-slate-600" />
                        </div>
                        <p className="text-slate-500 italic">Visual: Simple flow diagram or demo video frame</p>
                    </div>
                </div>
            </div>
        </section>
    );
}