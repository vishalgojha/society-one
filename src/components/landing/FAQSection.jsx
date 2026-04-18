import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "How much training do guards need?",
        answer: "Guards learn Society One in under 30 minutes. Most are comfortable using it within one day. If a guard can use WhatsApp, they can use this."
    },
    {
        question: "Does voice recognition work reliably?",
        answer: "Yes. It works with Hindi, English, and Hinglish. Even with heavy accents. Guards don't need to speak perfectly—the system captures what they say and logs it in English."
    },
    {
        question: "What phones or tablets do we need?",
        answer: "Any smartphone running Android 8+ or iPhone 7+. No special hardware required. Works on phones guards already have."
    },
    {
        question: "How secure is visitor data?",
        answer: "All data is encrypted and stored securely in India. Only authorized admins and guards can access records. We never share visitor data with anyone."
    },
    {
        question: "Can we export visitor logs?",
        answer: "Yes. Export to Excel or print anytime. Filter by date, visitor type, or flat number. Perfect for compliance and record-keeping."
    },
    {
        question: "What languages are supported?",
        answer: "Guards can speak in Hindi, English, or Hinglish. The system logs everything in English for clean, exportable records."
    },
    {
        question: "What happens if internet is down?",
        answer: "Visitor entries are saved locally on the phone and synced automatically when internet returns. No data is lost."
    },
    {
        question: "Can we try it before paying?",
        answer: "Yes. 14-day free trial. No credit card required. Cancel anytime if it's not right for you."
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Questions? Answers.
                    </h2>
                    <p className="text-xl text-slate-400">
                        Everything you need to know before getting started.
                    </p>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <span className="font-semibold text-white text-lg pr-4">{faq.question}</span>
                                <ChevronDown 
                                    className={cn(
                                        "h-5 w-5 text-slate-400 flex-shrink-0 transition-transform",
                                        openIndex === index && "rotate-180"
                                    )}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5">
                                    <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}