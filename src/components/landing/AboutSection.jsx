import React from 'react';
import { Building2, Zap, Shield, Users } from "lucide-react";

export default function AboutSection() {
    const values = [
        {
            icon: Building2,
            title: "Built for India",
            description: "Designed specifically for Indian properties, supporting Hindi, English, and Hinglish. Understands local needs."
        },
        {
            icon: Zap,
            title: "Simple & Fast",
            description: "Guards learn it in minutes. No complex training. Just tap, speak, and the system handles the rest."
        },
        {
            icon: Shield,
            title: "Secure & Compliant",
            description: "All data encrypted. Stored in India. GDPR compliant. Your visitor information is always protected."
        },
        {
            icon: Users,
            title: "Customer First",
            description: "Launched in 2026. Trusted by societies across India. We listen to feedback and improve constantly."
        }
    ];

    return (
        <section id="about" className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Society One</h2>
                    <p className="text-xl text-slate-400">
                        Built by Chaos Craft Labs to solve a real problem: managing visitor entries in Indian properties shouldn't be complicated.
                    </p>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-slate-700 mb-16">
                    <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Make visitor management effortless for housing societies, hotels, and guesthouses across India. 
                        Using voice and AI, we help guards log visitors in seconds—no paperwork, no confusion, no delays. 
                        Just accurate, searchable records at your fingertips.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                                <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{value.title}</h4>
                                <p className="text-slate-400">{value.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 pt-16 border-t border-slate-700">
                    <h3 className="text-2xl font-bold text-white mb-8">Why Chaos Craft Labs?</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <p className="text-emerald-400 font-bold text-2xl mb-2">2026</p>
                            <p className="text-slate-300">Founded to revolutionize visitor management in India</p>
                        </div>
                        <div>
                            <p className="text-emerald-400 font-bold text-2xl mb-2">100%</p>
                            <p className="text-slate-300">Built with feedback from real guards and admins</p>
                        </div>
                        <div>
                            <p className="text-emerald-400 font-bold text-2xl mb-2">30 min</p>
                            <p className="text-slate-300">Average onboarding time for any guard</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}