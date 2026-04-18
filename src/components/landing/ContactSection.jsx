import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { toast } from 'sonner';

export default function ContactSection() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill all fields');
            return;
        }

        setSubmitting(true);
        try {
            // In a real app, this would send to a backend
            toast.success("Message sent! We'll get back to you soon.");
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get in Touch</h2>
                    <p className="text-xl text-slate-400">
                        Have questions? Want a demo? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Email</h4>
                                <a href="mailto:hello@chaoscraftlabs.com" className="text-slate-400 hover:text-emerald-400 transition-colors">
                                    hello@chaoscraftlabs.com
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Support</h4>
                                <p className="text-slate-400">Response within 24 hours</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Location</h4>
                                <p className="text-slate-400">Built in India, for India</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                            <p className="text-slate-300 mb-4">
                                Want to talk to someone? Schedule a demo and we'll walk you through Society One.
                            </p>
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                Schedule a Demo
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Your name"
                                className="h-12 bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="your@email.com"
                                className="h-12 bg-slate-800 border-slate-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Tell us how we can help..."
                                rows="5"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}