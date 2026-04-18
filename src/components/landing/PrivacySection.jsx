import React from 'react';
import { Shield } from "lucide-react";

export default function PrivacySection() {
    return (
        <section id="privacy" className="py-24 bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-emerald-400" />
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h2>
                    </div>
                    <p className="text-slate-400">Last updated: January 2026</p>
                </div>

                <div className="space-y-8 text-slate-300">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
                        <p className="mb-3">Society One collects the following types of information:</p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>Visitor information: Name, photo, ID details, purpose of visit</li>
                            <li>Property information: Address, type, administrator details</li>
                            <li>Operator information: Name, email, phone, role</li>
                            <li>Device and usage data: IP address, device type, app usage patterns</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>To provide and improve our visitor management service</li>
                            <li>To send notifications about visitor entries</li>
                            <li>To generate reports and analytics</li>
                            <li>To comply with legal requirements</li>
                            <li>To prevent fraud and maintain security</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">3. Data Storage & Security</h3>
                        <p>
                            All data is encrypted using industry-standard protocols and stored securely on servers located in India. 
                            We use SSL/TLS encryption for data in transit and AES-256 for data at rest. Access to visitor data is 
                            restricted to authorized administrators and guards only.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h3>
                        <p>
                            We never sell or share visitor data with third parties. Data is only shared with authorized property 
                            administrators and guards who need access. We may be required to disclose data if legally compelled by 
                            court orders or government requests.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">5. Your Rights</h3>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 text-slate-400">
                            <li>Access your data anytime</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account and associated data</li>
                            <li>Export your data in standard formats</li>
                            <li>Opt out of optional communications</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">6. Compliance</h3>
                        <p>
                            Society One complies with GDPR, CCPA, and Indian data protection regulations. We conduct regular 
                            security audits and penetration testing to ensure data safety.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">7. Contact Us</h3>
                        <p>
                            Questions about our privacy practices? Email us at hello@chaoscraftlabs.com
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}