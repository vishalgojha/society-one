import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiceInput({ onTranscript, placeholder = "Tap to speak...", language = "en-US" }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;
        recognitionRef.current.lang = language;

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + ' ';
                } else {
                    interimTranscript += result[0].transcript;
                }
            }
            
            const currentText = transcript + finalTranscript;
            setTranscript(currentText + interimTranscript);
            
            if (finalTranscript) {
                setTranscript(currentText.trim());
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            // Restart if silence timeout occurs
            if (event.error === 'no-speech') {
                recognitionRef.current?.start();
            }
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const stopAndSubmit = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
        if (transcript.trim()) {
            onTranscript(transcript.trim());
            // Don't clear transcript immediately - let parent control when to reset
        }
    };

    if (!isSupported) {
        return (
            <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <MicOff className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-amber-200">Voice input not supported in this browser</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className={cn(
                "min-h-[120px] p-4 rounded-xl border-2 transition-all duration-300",
                isListening 
                    ? "border-emerald-500/50 bg-emerald-500/5" 
                    : "border-slate-700 bg-slate-800/50"
            )}>
                {transcript ? (
                    <p className="text-lg text-white leading-relaxed">{transcript}</p>
                ) : (
                    <p className="text-slate-500 text-lg">{placeholder}</p>
                )}
                {isListening && (
                    <div className="flex items-center gap-2 mt-4">
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm text-emerald-400">Listening...</span>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-4">
                {!isListening ? (
                    <Button
                        onClick={toggleListening}
                        size="lg"
                        className="h-20 w-20 rounded-full bg-emerald-500 hover:bg-emerald-600"
                    >
                        <Mic className="h-8 w-8" />
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={toggleListening}
                            size="lg"
                            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                        >
                            <Square className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={stopAndSubmit}
                            disabled={!transcript.trim()}
                            size="lg"
                            className="h-20 px-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Finish
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}