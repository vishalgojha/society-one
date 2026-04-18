import React from 'react';
import { FileText } from "lucide-react";

export default function TermsSection() {
    return (
        <section id="terms" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-8 w-8 text-emerald-400" />
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h2>
                    </div>
                    <p className="text-slate-400">Last updated: January 2026</p>
                </div>

                <div className="space-y-8 text-slate-300">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
                        <p>
                            By accessing and using Society One, you agree to be bound by these terms. If you do not agree, 
                            please do not use our service.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">2. User Eligibility</h3>
                        <p>
                            You must be at least 18 years old or have parental consent to use Society One. Organizations must 
                            provide accurate information during registration.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">3. Service Description</h3>
                        <p>
                            Society One is a voice-powered visitor management system. We provide tools to log, track, and manage 
                            visitor entries for properties. We are not liable for how you use this data.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">4. User Responsibilities</h3>
                        <p className="mb-3">You agree to:</p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>Provide accurate information</li>
                            <li>Keep login credentials confidential</li>
                            <li>Use the service lawfully</li>
                            <li>Respect visitor privacy</li>
                            <li>Comply with applicable laws</li>
                            <li>Not misuse or attempt to hack the system</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">5. Billing & Payments</h3>
                        <p className="mb-3">
                            Paid plans require valid payment information. We charge monthly on your renewal date. You can cancel 
                            anytime—refunds are issued prorated. Free trials are non-renewable.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h3>
                        <p>
                            Society One and all its content (design, code, features) are owned by Chaos Craft Labs. You cannot 
                            copy, modify, or redistribute without permission. Visitor data remains your property.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h3>
                        <p>
                            Society One is provided "as is". We are not responsible for data loss, service interruptions, or 
                            indirect damages. Our liability is limited to the amount you paid.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">8. Service Availability</h3>
                        <p>
                            We aim for 99.9% uptime but cannot guarantee uninterrupted service. We reserve the right to modify 
                            or discontinue features with notice.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">9. Termination</h3>
                        <p>
                            We may suspend accounts that violate these terms. You can delete your account anytime. Upon termination, 
                            you can export your data within 30 days.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h3>
                        <p>
                            We may update these terms. Continued use after changes means you accept them. We'll notify you of 
                            material changes.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">11. Governing Law</h3>
                        <p>
                            These terms are governed by Indian law. Disputes will be resolved in Indian courts.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">12. Contact</h3>
                        <p>
                            Questions? Email hello@chaoscraftlabs.com
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}