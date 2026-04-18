import React from 'react';
import { Building2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Society One</span>
                        </div>
                        <p className="text-slate-400 max-w-md">
                            Voice-powered visitor management for housing societies, hotels, and guesthouses across India.
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
                            <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
                    <p>© 2026 Society One. All rights reserved. Made in India 🇮🇳</p>
                </div>
            </div>
        </footer>
    );
}