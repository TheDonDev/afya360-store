import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Package, Settings2, ShoppingBag } from 'lucide-react';
import type { Auth } from '@/types/auth';
import type { BreadcrumbItem } from '@/types/navigation';

type DashboardProps = {
    auth: Auth;
};

export default function Dashboard() {
    const { auth } = usePage<DashboardProps>().props;

    return (
        <>
            <Head title="Your Afya360 account" />
            <div className="min-h-full bg-[#f5f4ee] p-4 text-[#242923] sm:p-8">
                <div className="mx-auto max-w-5xl">
                    <p className="text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                        AFYA360 ACCOUNT
                    </p>
                    <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                        Welcome back, {auth.user.name}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#686b62]">
                        Your account is ready. Browse the current collection or
                        update your profile details.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/#shop"
                            className="group flex min-h-44 flex-col justify-between border border-[#e3e0d8] bg-[#fffdf9] p-6 transition hover:border-[#244c3b]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center bg-[#e8eee7] text-[#244c3b]">
                                <ShoppingBag size={20} />
                            </span>
                            <span>
                                <span className="block font-serif text-2xl text-[#244c3b]">
                                    Shop Afya360
                                </span>
                                <span className="mt-2 flex items-center gap-2 text-xs text-[#686b62]">
                                    Browse beauty, care and wellness
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                            </span>
                        </Link>

                        <Link
                            href="/settings/profile"
                            className="group flex min-h-44 flex-col justify-between border border-[#e3e0d8] bg-[#fffdf9] p-6 transition hover:border-[#244c3b]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center bg-[#f1e9dd] text-[#8d6749]">
                                <Settings2 size={20} />
                            </span>
                            <span>
                                <span className="block font-serif text-2xl text-[#244c3b]">
                                    Profile settings
                                </span>
                                <span className="mt-2 flex items-center gap-2 text-xs text-[#686b62]">
                                    Manage your personal details
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                            </span>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-start gap-3 border-t border-[#dedbd2] py-5 text-xs leading-5 text-[#686b62]">
                        <Package
                            size={17}
                            className="mt-0.5 shrink-0 text-[#244c3b]"
                        />
                        <p>
                            Order history will appear here as order management
                            is added to your account.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Your account',
            href: '/dashboard',
        } satisfies BreadcrumbItem,
    ],
};
