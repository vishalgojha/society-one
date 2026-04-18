import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Mic, CheckCircle, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const demoSteps = [
    {
        step: 1,
        title: "Take Photo",
        description: "Guard taps camera and takes visitor's photo",
        visual: Camera,
        color: "bg-blue-500"
    },
    {
        step: 2,
        title: "Speak Details",
        description: "Guard says: 'Rahul Kumar, Flat 205, mobile 98765 43210'",
        visual: Mic,
        color: "bg-emerald-500",
        transcript: "राहुल कुमार फ्लैट नंबर 205 मोबाइल नंबर 98765 43210"
    },
    {
        step: 3,
        title: "Done",
        description: "Visitor logged in English. Admin can see it instantly.",
        visual: CheckCircle,
        color: "bg-purple-500",
        result: "Rahul Kumar • Flat 205 • Mobile 98765 43210"
    },
];

export default function DemoModal({ open, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const step = demoSteps[currentStep];
    const Icon = step.visual;

    const handleNext = () => {
        if (currentStep < demoSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
            setCurrentStep(0);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="pt-6">
                    {/* Progress */}
                    <div className="flex gap-2 mb-8">
                        {demoSteps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 flex-1 rounded-full transition-all ${
                                    i <= currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <div className={`h-24 w-24 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4 shadow-xl`}>
                                    <Icon className="h-12 w-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Step {step.step}: {step.title}
                                </h3>
                                <p className="text-slate-400 text-lg">{step.description}</p>
                            </div>

                            {/* Visual Demo */}
                            <div className="bg-slate-800/50 rounded-2xl p-8 min-h-[200px] flex items-center justify-center border border-slate-700">
                                {step.step === 1 && (
                                    <div className="text-center">
                                        <div className="h-32 w-32 rounded-2xl bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                                            <Camera className="h-16 w-16 text-slate-500" />
                                        </div>
                                        <p className="text-slate-400">Camera opens automatically</p>
                                    </div>
                                )}
                                
                                {step.step === 2 && (
                                    <div className="text-center space-y-4 w-full">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                                            <div className="flex items-center gap-2 justify-center mb-3">
                                                <span className="flex h-3 w-3">
                                                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-sm text-emerald-400">Listening...</span>
                                            </div>
                                            <p className="text-2xl text-white font-hindi">{step.transcript}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">Guard speaks in Hindi/English/Hinglish</p>
                                    </div>
                                )}
                                
                                {step.step === 3 && (
                                    <div className="text-center space-y-4 w-full">
                                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                                            <p className="text-xl text-white font-medium mb-2">{step.result}</p>
                                            <p className="text-sm text-slate-400">Logged in English • Searchable • Exportable</p>
                                        </div>
                                        <p className="text-emerald-400 font-medium">✓ Check-in complete in 30 seconds</p>
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="flex gap-3">
                                {currentStep > 0 && (
                                    <Button
                                        onClick={handlePrev}
                                        variant="outline"
                                        className="flex-1 h-12 border-slate-700 text-slate-300 hover:bg-slate-800"
                                    >
                                        Previous
                                    </Button>
                                )}
                                <Button
                                    onClick={handleNext}
                                    className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                    {currentStep === demoSteps.length - 1 ? 'Close Demo' : 'Next'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}