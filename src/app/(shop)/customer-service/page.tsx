"use client"

import { Mail, MessageCircle } from "lucide-react"
import ContactCard from "@/components/account/customer-service/ContactCard"
import FaqSection from "@/components/account/customer-service/FaqSection"
import ContactForm from "@/components/account/customer-service/ContactForm"

function SectionHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h2 className="text-[15px] font-semibold text-neutral-900">{title}</h2>
            <p className="text-[13px] text-neutral-400 mt-0.5">{description}</p>
        </div>
    )
}

export default function CustomerServicePage() {
    return (
        <div className="flex flex-col gap-8 px-2 xl:px-0">
            {/* Header */}
            <div>
                <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">
                    Customer Service
                </h1>
                <p className="text-[13px] text-neutral-400 mt-0.5">
                    Find answers or get in touch — we're here to help.
                </p>
            </div>

            {/* Contact options */}
            <div className="flex flex-col gap-4">
                <SectionHeader
                    title="Get in touch"
                    description="Choose the most convenient way to reach us."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ContactCard
                        icon={<Mail size={16} />}
                        title="Email us"
                        description="Response within 24 hours"
                        action={() => { window.location.href = "mailto:support@otrium.com" }}
                        actionLabel="support@otrium.com"
                    />
                    <ContactCard
                        icon={<MessageCircle size={16} />}
                        title="Live chat"
                        description="Available Mon–Fri, 9:00–18:00"
                        action={() => {}}
                        actionLabel="Start a chat →"
                    />
                </div>
            </div>

            {/* FAQ */}
            <div className="flex flex-col gap-4">
                <SectionHeader
                    title="Frequently asked questions"
                    description="Quick answers to common questions."
                />
                <FaqSection />
            </div>

            {/* Contact form */}
            <div className="flex flex-col gap-4">
                <SectionHeader
                    title="Still need help?"
                    description="Fill in the form and we'll get back to you as soon as possible."
                />
                <ContactForm />
            </div>
        </div>
    )
}