import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    FileText,
    ShieldCheck,
} from 'lucide-react';

export default function TermsOfService() {
    return (
        <>
            <Head title="Terms of Service | Afya360" />
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
                                <FileText size={19} strokeWidth={1.6} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b]">
                                <FileText size={24} />
                            </div>
                            <h1 className="font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                Terms of Service
                            </h1>
                        </div>

                        <p className="text-lg leading-8 text-[#56594f] max-w-2xl sm:text-xl mb-12">
                            By placing an order with Afya360, you agree to the following
                            terms. Please read them carefully before shopping with us.
                        </p>

                        <div className="space-y-8">
                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Your Order
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        All prices are in Kenyan Shillings (KES) and include
                                        applicable taxes
                                    </li>
                                    <li>
                                        Product availability is subject to stock; we'll notify
                                        you if an item is unavailable
                                    </li>
                                    <li>
                                        We reserve the right to cancel orders due to pricing
                                        errors or stock issues
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Payment
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        All payments are processed securely through our payment
                                        partners
                                    </li>
                                    <li>
                                        Visa card transactions are subject to our payment
                                        gateway's terms
                                    </li>
                                    <li>
                                        WhatsApp orders require confirmation before dispatch
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Delivery
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        Delivery estimates are guidelines, not guarantees
                                    </li>
                                    <li>
                                        You're responsible for providing an accurate delivery
                                        address
                                    </li>
                                    <li>
                                        We're not liable for delays caused by circumstances
                                        beyond our control
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Returns
                                </h3>
                                <ul className="space-y-3 text-sm text-[#56594f] list-disc list-inside">
                                    <li>
                                        Returns accepted within 7 days of delivery for unused,
                                        sealed products
                                    </li>
                                    <li>
                                        Refunds are issued to the original payment method
                                    </li>
                                    <li>
                                        Shipping fees are non-refundable unless the item is
                                        damaged or incorrect
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Limitation of Liability
                                </h3>
                                <p className="text-sm text-[#56594f]">
                                    Afya360 is not responsible for indirect or consequential
                                    damages arising from the use of our products or website.
                                    Our liability is limited to the amount paid for the
                                    affected order.
                                </p>
                            </div>

                            <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-8">
                                <h3 className="font-serif text-xl text-[#244c3b] mb-4">
                                    Governing Law
                                </h3>
                                <p className="text-sm text-[#56594f]">
                                    These terms are governed by the laws of Kenya. Any
                                    disputes will be resolved in Kenyan courts.
                                </p>
                            </div>
                        </div>

                        <div className="border-l-4 border-[#c28d61] bg-[#faf8f4] p-6 mt-8">
                            <h3 className="font-semibold text-[#244c3b] mb-3">
                                Questions?
                            </h3>
                            <p className="text-sm text-[#56594f]">
                                Contact us at{' '}
                                <a
                                    href="mailto:support@afya360.co.ke"
                                    className="text-[#244c3b] hover:underline"
                                >
                                    support@afya360.co.ke
                                </a>
                                or WhatsApp{' '}
                                <a
                                    href="https://wa.me/254724151522"
                                    className="text-[#244c3b] hover:underline"
                                >
                                    0724151522
                                </a>
                                .
                            </p>
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
