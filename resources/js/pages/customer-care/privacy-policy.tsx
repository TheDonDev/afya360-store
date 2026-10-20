import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Lock,
    ShieldCheck,
} from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy | Afya360" />
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
                                <ShieldCheck size={19} strokeWidth={1.6} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b]">
                                <Lock size={24} />
                            </div>
                            <h1 className="font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                Privacy Policy
                            </h1>
                        </div>

                        <p className="text-lg leading-8 text-[#56594f] max-w-2xl sm:text-xl mb-12">
                            At Afya360, your privacy matters. We collect and use your
                            personal information only to process your orders, improve your
                            shopping experience, and communicate about our products.
                        </p>

                        <div className="space-y-8">
                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    What We Collect
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        <strong className="text-[#244c3b]">Order details:</strong>
                                        Name, phone, email, delivery address
                                    </li>
                                    <li>
                                        <strong className="text-[#244c3b]">Payment information:</strong>
                                        Processed securely through our payment gateway (we never
                                        store your full card details)
                                    </li>
                                    <li>
                                        <strong className="text-[#244c3b]">Account information:</strong>
                                        If you create an account, we store your profile details
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    How We Use It
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        To fulfill and ship your orders
                                    </li>
                                    <li>
                                        To send order updates via WhatsApp and email
                                    </li>
                                    <li>
                                        To improve our website and product recommendations
                                    </li>
                                    <li>
                                        To comply with legal and tax obligations
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    What We Don't Do
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        <span className="text-[#c28d61] font-medium">❌</span>
                                        We never sell your data to third parties
                                    </li>
                                    <li>
                                        <span className="text-[#c28d61] font-medium">❌</span>
                                        We never share your payment details with anyone
                                    </li>
                                    <li>
                                        <span className="text-[#c28d61] font-medium">❌</span>
                                        We never spam you with unrelated marketing
                                    </li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-[#c28d61] bg-[#faf8f4] p-6">
                                <h3 className="font-semibold text-[#244c3b] mb-3">
                                    Your Rights
                                </h3>
                                <p className="text-sm text-[#56594f]">
                                    You can request to view, update, or delete your data at
                                    any time by contacting us at{' '}
                                    <a
                                        href="mailto:support@afya360.co.ke"
                                        className="text-[#244c3b] hover:underline"
                                    >
                                        support@afya360.co.ke
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>

                        <div className="mt-16 border-t border-[#e9e6df] pt-12 text-center">
                            <p className="text-[10px] tracking-[0.2em] text-[#9a7959] mb-4">
                                QUESTIONS ABOUT YOUR PRIVACY?
                            </p>
                            <h2 className="font-serif text-2xl tracking-tight text-[#244c3b] sm:text-3xl mb-6">
                                Contact Customer Care
                            </h2>
                            <a
                                href="/customer-care/contact"
                                className="inline-flex items-center gap-3 border-b border-[#244c3b] pb-2 text-[10px] font-semibold tracking-[0.16em] text-[#244c3b] sm:text-xs"
                            >
                                GET IN TOUCH
                                <ArrowRight size={15} />
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
