"use client"

import { Mail, MessageCircle} from "lucide-react"
import ContactCard from "@/components/account/customer-service/ContactCard";
import FaqSection from "@/components/account/customer-service/FaqSection";
import ContactForm from "@/components/account/customer-service/ContactForm";

export default function CustomerServicePage() {
    return (
        <div className="flex flex-col gap-6 max-w-[900px] w-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-[28px] font-bold text-[var(--text)]">Customer Service</h1>
                <p className="text-[15px] text-[#999]">Find answers or get in touch — we're here to help.</p>
            </div>

            {/* Contact options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContactCard
                    icon={<Mail size={18} />}
                    title="Email us"
                    description="Response within 24 hours"
                    action={() => window.location.href = "mailto:support@otrium.com"}
                    actionLabel="support@otrium.com"
                />
                <ContactCard
                    icon={<MessageCircle size={18} />}
                    title="Live chat"
                    description="Available Mon–Fri, 9:00–18:00"
                    action={() => {}}
                    actionLabel="Start a chat →"
                />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300" />

            {/* FAQ */}
            <div className="flex flex-col gap-5">
                <div>
                    <h2 className="text-[20px] font-semibold text-[var(--text)]">Frequently asked questions</h2>
                    <p className="text-[14px] text-[#999] mt-1">Quick answers to common questions.</p>
                </div>
                <FaqSection />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300" />

            {/* Contact form */}
            <div className="flex flex-col gap-5">
                <div>
                    <h2 className="text-[20px] font-semibold text-[var(--text)]">Still need help?</h2>
                    <p className="text-[14px] text-[#999] mt-1">Fill in the form and we'll get back to you as soon as possible.</p>
                </div>
                <ContactForm />
            </div>

        </div>
    )
}