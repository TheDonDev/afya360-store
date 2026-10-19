import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    MessageCircle,
    Phone,
    Send,
    ShieldCheck,
} from 'lucide-react';

export default function Contact() {
    return (
        <>
            <Head title="Contact Us | Afya360 Customer Care" />
            <div className="min-h-screen bg-[#fffdf9] text-[#242923]">
                {/* Announcement bar */}
                <div className="bg-[#244c3b] px-4 py-2.5 text-center text-[10px] font-medium tracking-[0.18em] text-white sm:text-xs">
                    YOUR EVERYDAY BEAUTY & WELLNESS DESTINATION
                    <span className="mx-2 text-[#d8b991]">✦</span>
                    SHOP AFYA360
                </div>

                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-[#e9e6df] bg-[#fffdf9]/95 backdrop-blur-md">
                    <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded-full p-2 transition hover:bg-[#f2eee6]"
                        >
                            <ArrowLeft size={21} />
                        </button>

                        <a
                            href="/"
                            className="shrink-0 leading-none"
                            aria-label="Afya360 home"
                        >
                            <span className="block font-serif text-[27px] font-semibold tracking-[-0.06em] text-[#244c3b] sm:text-[32px]">
                                afya360<span className="text-[#c28d61]">.</span>
                            </span>
                            <span className="mt-1 block text-[8px] tracking-[0.24em] text-[#77786e] sm:text-[9px]">
                                BEAUTY · CARE · WELLNESS
                            </span>
                        </a>

                        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                            <button
                                type="button"
                                className="rounded-full p-2.5 transition hover:bg-[#f2eee6]"
                            >
                                <Phone size={19} strokeWidth={1.6} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b]">
                                <MessageCircle size={24} />
                            </div>
                            <h1 className="font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                Contact Us
                            </h1>
                        </div>

                        <p className="text-lg leading-8 text-[#56594f] max-w-2xl sm:text-xl mb-12">
                            Got a question about a product? Need help with your order? Want a
                            personal recommendation? Our customer care team is ready to assist.
                        </p>

                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Contact methods */}
                            <div className="space-y-6">
                                <div
                                    className="flex gap-4 p-6 bg-[#f7f5ef] rounded-xl border border-[#e9e6df]"
                                >
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] shrink-0">
                                        <MessageCircle size={20} strokeWidth={1.6} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#244c3b]">WhatsApp</h3>
                                        <p className="mt-1 text-sm text-[#686b62]">
                                            <a
                                                href="https://wa.me/254724151522"
                                                className="text-[#244c3b] hover:underline"
                                            >
                                                0724151522
                                            </a>
                                        </p>
                                        <p className="mt-1 text-xs text-[#77786e]">
                                            Fastest response — typically within 2 hours
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-4 p-6 bg-[#f7f5ef] rounded-xl border border-[#e9e6df]"
                                >
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] shrink-0">
                                        <Send size={20} strokeWidth={1.6} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#244c3b]">Email</h3>
                                        <p className="mt-1 text-sm text-[#686b62]">
                                            <a
                                                href="mailto:support@afya360.co.ke"
                                                className="text-[#244c3b] hover:underline"
                                            >
                                                support@afya360.co.ke
                                            </a>
                                        </p>
                                        <p className="mt-1 text-xs text-[#77786e]">
                                            For order inquiries and general questions
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-4 p-6 bg-[#f7f5ef] rounded-xl border border-[#e9e6df]"
                                >
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] shrink-0">
                                        <Phone size={20} strokeWidth={1.6} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#244c3b]">Phone</h3>
                                        <p className="mt-1 text-sm text-[#686b62]">
                                            0724151522
                                        </p>
                                        <p className="mt-1 text-xs text-[#77786e]">
                                            Mon–Sat, 8:00 AM – 6:00 PM (EAT)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact form */}
                            <div className="bg-[#fffdf9] border border-[#e9e6df] rounded-xl p-8">
                                <h3 className="font-semibold text-[#244c3b] mb-6">
                                    Send us a message
                                </h3>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[#56594f]">
                                            Your name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-[#dedbd2] bg-white py-3 px-4 text-sm outline-none focus:border-[#244c3b] placeholder:text-[#9a9b92]"
                                            placeholder="John Mwangi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[#56594f]">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border border-[#dedbd2] bg-white py-3 px-4 text-sm outline-none focus:border-[#244c3b] placeholder:text-[#9a9b92]"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[#56594f]">
                                            Order number (if applicable)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-[#dedbd2] bg-white py-3 px-4 text-sm outline-none focus:border-[#244c3b] placeholder:text-[#9a9b92]"
                                            placeholder="AFY-261019-ABC123"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-[#56594f]">
                                            Message
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full border border-[#dedbd2] bg-white py-3 px-4 text-sm outline-none focus:border-[#244c3b] placeholder:text-[#9a9b92]"
                                            placeholder="How can we help you today?"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#244c3b] px-6 py-3 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#183a2b]"
                                    >
                                        <Send size={16} className="mr-2" />
                                        SEND MESSAGE
                                    </button>
                                </form>

                                <div className="mt-8 border-t border-[#e9e6df] pt-6">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-[#244c3b]" />
                                        <div>
                                            <p className="text-xs font-medium text-[#33382f]">
                                                Secure & Private
                                            </p>
                                            <p className="text-xs text-[#77786e]">
                                                Your message is encrypted and handled
                                                confidentially by our support team.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-[#e9e6df] pt-12 text-center">
                            <p className="text-[10px] tracking-[0.2em] text-[#9a7959] mb-4">
                                NEED IMMEDIATE HELP?
                            </p>
                            <h2 className="font-serif text-2xl tracking-tight text-[#244c3b] sm:text-3xl mb-6">
                                Chat with us on WhatsApp
                            </h2>
                            <a
                                href="https://wa.me/254724151522"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-[#1f6b4a] px-6 py-4 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#18563b]"
                            >
                                <MessageCircle size={18} />
                                MESSAGE US ON WHATSAPP
                            </a>
                        </div>
                    </section>
                </main>

                <footer className="mt-12 bg-[#f7f5ef] px-4 py-8 text-center text-xs text-[#77786e]">
                    © {new Date().getFullYear()} Afya360 Cosmetics & Supplements
                </footer>
            </div>
        </>
    );
}
