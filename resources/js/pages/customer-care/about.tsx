import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Leaf,
    ShieldCheck,
    Sparkles,
    Truck,
    UserRound,
} from 'lucide-react';

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

export default function About() {
    return (
        <>
            <Head title="About Afya360 | Beauty & Wellness Store" />
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
                                <UserRound size={19} strokeWidth={1.6} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b]">
                                <Leaf size={24} />
                            </div>
                            <h1 className="font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                About Afya360
                            </h1>
                        </div>

                        <p className="text-lg leading-8 text-[#56594f] max-w-2xl sm:text-xl">
                            At Afya360, we believe self-care isn't a luxury — it's a daily
                            ritual. Named after the Swahili word <em className="italic text-[#244c3b]">"afya"</em> (health),
                            we're Kenya's trusted online destination for thoughtfully
                            curated skincare, hair & body care, supplements, and cosmetics.
                        </p>

                        <p className="mt-6 text-lg leading-8 text-[#56594f] max-w-2xl sm:text-xl">
                            We handpick every product with one question in mind:
                            <em className="italic text-[#244c3b]">"Will this help someone feel more confident in their skin?"</em>
                            From gentle cleansers and nourishing serums to everyday
                            essentials and wellness supplements, each item in our catalogue
                            is chosen for quality, effectiveness, and authenticity.
                        </p>

                        <div className="mt-12 grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: <Sparkles size={20} strokeWidth={1.5} />,
                                    title: 'Curated Quality',
                                    desc: 'Every product is handpicked for effectiveness, authenticity, and everyday beauty.',
                                },
                                {
                                    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
                                    title: 'Secure Payments',
                                    desc: 'Pay with confidence using Visa or WhatsApp. Your details are never stored by us.',
                                },
                                {
                                    icon: <Truck size={20} strokeWidth={1.5} />,
                                    title: 'Delivered with Care',
                                    desc: 'Fast, reliable delivery across Kenya with order tracking via WhatsApp.',
                                },
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="p-6 bg-[#f7f5ef] rounded-xl border border-[#e9e6df]"
                                >
                                    <div className="h-10 w-10 rounded-full bg-[#e8eee7] flex items-center justify-center text-[#244c3b] mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-[#244c3b] mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-6 text-[#686b62]">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 border-t border-[#e9e6df] pt-12 text-center">
                            <p className="text-[10px] tracking-[0.2em] text-[#9a7959] mb-4">
                                YOUR BEAUTY · YOUR WELLNESS · YOUR WAY
                            </p>
                            <h2 className="font-serif text-2xl tracking-tight text-[#244c3b] sm:text-3xl mb-6">
                                Ready to start your ritual?
                            </h2>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 border-b border-[#244c3b] pb-2 text-[10px] font-semibold tracking-[0.16em] text-[#244c3b] sm:text-xs"
                            >
                                SHOP ALL PRODUCTS
                                <ArrowRight size={15} />
                            </Link>
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
