import {CreditCard, HelpCircle, Package, RotateCcw} from "lucide-react";

export interface FaqCategory {
    icon: React.ReactNode
    label: string
    items: FaqItem[]
}

export interface FaqItem {
    question: string
    answer: string
}


export const FAQ_CATEGORIES: FaqCategory[] = [
    {
        icon: <Package size={18} />,
        label: "Orders & Shipping",
        items: [
            {
                question: "How long does delivery take?",
                answer: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for an additional fee.",
            },
            {
                question: "Can I change or cancel my order?",
                answer: "Orders can be changed or cancelled within 1 hour of placement. After that, the order enters fulfilment and can no longer be modified.",
            },
            {
                question: "How do I track my order?",
                answer: "Once your order ships, you'll receive a confirmation email with a tracking link. You can also check order status in your account under My Orders.",
            },
        ],
    },
    {
        icon: <RotateCcw size={18} />,
        label: "Returns & Refunds",
        items: [
            {
                question: "What is the return policy?",
                answer: "You can return most items within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached.",
            },
            {
                question: "How long does a refund take?",
                answer: "Refunds are processed within 5–7 business days after we receive and inspect your return. The amount is credited to your original payment method.",
            },
            {
                question: "Are return shipping costs covered?",
                answer: "Return shipping is free for defective or incorrect items. For other returns, a flat fee of €3.95 is deducted from your refund.",
            },
        ],
    },
    {
        icon: <CreditCard size={18} />,
        label: "Payments",
        items: [
            {
                question: "What payment methods are accepted?",
                answer: "We accept Visa, Mastercard, iDEAL, PayPal, Apple Pay, and Klarna. All transactions are secured with SSL encryption.",
            },
            {
                question: "Can I pay in instalments?",
                answer: "Yes — Klarna is available at checkout, letting you pay in 3 interest-free instalments.",
            },
        ],
    },
    {
        icon: <HelpCircle size={18} />,
        label: "Account & General",
        items: [
            {
                question: "How do I reset my password?",
                answer: "Go to the login page and click 'Forgot password'. We'll send a reset link to your email address.",
            },
            {
                question: "How do I unsubscribe from emails?",
                answer: "Click the unsubscribe link at the bottom of any marketing email, or manage your preferences under My Profile → Notifications.",
            },
        ],
    },
]