import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "999",
        period: "month",
        description: "Perfect for single properties",
        features: [
            "1 property",
            "Unlimited visitors",
            "Voice & photo logging",
            "Admin dashboard",
            "Export to Excel",
            "Email support"
        ],
        cta: "Start Free Trial",
        highlighted: false
    },
    {
        name: "Professional",
        price: "2,499",
        period: "month",
        description: "Perfect for multiple properties",
        features: [
            "Up to 5 properties",
            "Unlimited visitors",
            "Voice & photo logging",
            "Admin dashboard",
            "Export to Excel",
            "Priority support",
            "Custom branding",
            "Advanced reports"
        ],
        cta: "Start Free Trial",
        highlighted: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "Perfect for large organizations",
        features: [
            "Unlimited properties",
            "Unlimited visitors",
            "Voice & photo logging",
            "Admin dashboard",
            "Export to Excel",
            "Dedicated support",
            "Custom integrations",
            "SLA guarantee"
        ],
        cta: "Contact Sales",
        highlighted: false
    },
];

export default function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Simple pricing. No surprises.
                    </h2>
                    <p className="text-xl text-slate-400 mb-6">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                        <span className="text-emerald-400 font-medium">₹ INR pricing • GST extra</span>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`rounded-2xl p-8 ${
                                plan.highlighted 
                                    ? 'bg-emerald-500/10 border-2 border-emerald-500 relative' 
                                    : 'bg-slate-800/50 border border-slate-700/50'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                            
                            <div className="mb-6">
                                {plan.price === "Custom" ? (
                                    <div className="text-3xl font-bold text-white">Custom</div>
                                ) : (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                                        <span className="text-slate-400">/{plan.period}</span>
                                    </div>
                                )}
                            </div>
                            
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <Button 
                                className={`w-full h-12 rounded-full ${
                                    plan.highlighted 
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                }`}
                            >
                                {plan.cta}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                
                <p className="text-center text-slate-500 mt-12">
                    All plans include unlimited visitor entries and photo storage. Cancel anytime.
                </p>
            </div>
        </section>
    );
}