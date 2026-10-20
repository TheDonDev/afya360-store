import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    RotateCcw,
    Truck,
} from 'lucide-react';

export default function DeliveryReturns() {
    return (
        <>
            <Head title="Delivery & Returns | Afya360" />
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
                                <Truck size={19} strokeWidth={1.6} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b]">
                                <Truck size={24} />
                            </div>
                            <h1 className="font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                Delivery & Returns
                            </h1>
                        </div>

                        <div className="grid gap-12 md:grid-cols-2">
                            {/* Delivery section */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] shrink-0">
                                        <Truck size={20} strokeWidth={1.6} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#244c3b]">Delivery</h3>
                                        <p className="mt-1 text-sm text-[#686b62]">
                                            We deliver across Kenya with care and speed.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">1-2 days</span>
                                        <p className="text-sm text-[#56594f]">
                                            Orders processed within 1-2 business days
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">2-5 days</span>
                                        <p className="text-sm text-[#56594f]">
                                            Delivery within Nairobi
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">3-7 days</span>
                                        <p className="text-sm text-[#56594f]">
                                            Delivery countrywide
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">Calculated</span>
                                        <p className="text-sm text-[#56594f]">
                                            Delivery fee at checkout based on location
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">WhatsApp</span>
                                        <p className="text-sm text-[#56594f]">
                                            Tracking updates sent via WhatsApp
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Returns section */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] shrink-0">
                                        <RotateCcw size={20} strokeWidth={1.6} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#244c3b]">Returns & Exchanges</h3>
                                        <p className="mt-1 text-sm text-[#686b62]">
                                            We want you to love every product you receive.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#f7f5ef] rounded-xl border border-[#e9e6df] p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">7 days</span>
                                        <p className="text-sm text-[#56594f]">
                                            Return window from delivery date
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">5-7 days</span>
                                        <p className="text-sm text-[#56594f]">
                                            Refund processed after return received
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">Unused</span>
                                        <p className="text-sm text-[#56594f]">
                                            Items must be unused with seal intact
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-semibold text-[#244c3b] shrink-0">Original</span>
                                        <p className="text-sm text-[#56594f]">
                                            Must be in original packaging
                                        </p>
                                    </div>
                                </div>

                                <div className="border-l-4 border-[#c28d61] bg-[#faf8f4] p-6">
                                    <p className="text-sm text-[#77786e]">
                                        <strong className="text-[#244c3b]">Non-returnable items:</strong>
                                        Personal care items (for hygiene reasons), clearance items,
                                        and gift cards unless damaged or defective.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <h3 className="font-semibold text-[#244c3b] mb-4">How to start a return</h3>
                            <ol className="space-y-3 text-sm text-[#56594f] list-decimal list-inside">
                                <li>
                                    WhatsApp us at{' '}
                                    <a
                                        href="https://wa.me/254724151522"
                                        className="text-[#244c3b] hover:underline font-medium"
                                    >
                                        0724151522
                                    </a>
                                    with your order number and a photo of the item
                                </li>
                                <li>
                                    We'll confirm your return eligibility and provide
                                    return instructions
                                </li>
                                <li>
                                    Ship the item back to us in its original packaging
                                </li>
                                <li>
                                    Once received and inspected, your refund will be
                                    processed within 5-7 business days
                                </li>
                            </ol>
                        </div>

                        <div className="mt-16 border-t border-[#e9e6df] pt-12 text-center">
                            <p className="text-[10px] tracking-[0.2em] text-[#9a7959] mb-4">
                                STILL HAVE QUESTIONS?
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
