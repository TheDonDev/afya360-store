import { Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <main className="grid min-h-svh bg-[#f5f4ee] text-[#242923] lg:grid-cols-[minmax(300px,0.82fr)_1.18fr]">
            <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#244c3b] px-7 py-7 text-white sm:px-10 sm:py-9 lg:min-h-svh lg:px-14 lg:py-12">
                <Link
                    href={home()}
                    className="inline-flex w-fit items-center gap-2 border border-white/25 px-4 py-2.5 text-xs font-medium text-white transition hover:border-white hover:bg-white/10"
                >
                    <ArrowLeft size={15} />
                    Back to shop
                </Link>

                <div className="relative z-10 mt-12 max-w-md lg:mt-0">
                    <Link
                        href={home()}
                        aria-label="Afya360 home"
                        className="inline-flex items-center gap-3"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                            <AppLogoIcon className="size-8 fill-current text-white" />
                        </span>
                        <span className="font-serif text-3xl font-semibold tracking-tight">
                            afya360<span className="text-[#d8b991]">.</span>
                        </span>
                    </Link>

                    <p className="mt-9 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#d8b991]">
                        <Sparkles size={14} />
                        BEAUTY · CARE · WELLNESS
                    </p>
                    <p className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
                        A little care goes a long way.
                    </p>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                        Sign in to keep your Afya360 shopping experience close
                        at hand.
                    </p>
                </div>

                <p className="mt-10 hidden text-[10px] tracking-[0.12em] text-white/55 lg:block">
                    CARE FOR YOURSELF, EVERY DAY.
                </p>
            </section>

            <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
                <div className="w-full max-w-md border border-[#e3e0d8] bg-[#fffdf9] p-6 shadow-[0_18px_50px_rgba(36,76,59,0.06)] sm:p-9">
                    <div className="mb-7 space-y-2">
                        <p className="text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                            YOUR AFYA360 ACCOUNT
                        </p>
                        <h1 className="font-serif text-3xl text-[#244c3b]">
                            {title}
                        </h1>
                        <p className="text-sm leading-6 text-[#686b62]">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </section>
        </main>
    );
}
