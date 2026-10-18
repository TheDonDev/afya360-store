import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    MessageCircle,
    ShieldCheck,
} from 'lucide-react';

type OrderItem = {
    name: string;
    sku: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
};

type Props = {
    order: {
        reference: string;
        order_number: string;
        subtotal: number;
        payment_method: 'whatsapp';
        items: OrderItem[];
        reservation_expires_at: string | null;
        reservation_expired: boolean;
    };
    whatsapp_url: string;
};

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function Confirmation({ order, whatsapp_url }: Props) {
    return (
        <>
            <Head title={`Order ${order.order_number} | Afya360`} />
            <div className="min-h-screen bg-[#f5f4ee] text-[#242923]">
                <header className="border-b border-[#e5e3dc] bg-[#fffdf9]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
                        <Link
                            href="/"
                            className="font-serif text-3xl font-semibold text-[#244c3b]"
                        >
                            afya360<span className="text-[#c28d61]">.</span>
                        </Link>
                        <Link
                            href="/#shop"
                            className="inline-flex items-center gap-2 text-sm text-[#244c3b] hover:underline"
                        >
                            <ArrowLeft size={16} /> Continue shopping
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
                    <section className="border border-[#e3e0d8] bg-[#fffdf9]">
                        <div className="border-b border-[#e8e5dd] px-6 py-8 text-center sm:px-10">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eee7] text-[#244c3b]">
                                <Check size={23} />
                            </span>
                            <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                                ORDER CREATED
                            </p>
                            <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                                Thank you for your order
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-[#686b62]">
                                {order.reservation_expired
                                    ? 'This order’s stock reservation has expired. Check current availability before arranging payment.'
                                    : 'Your items are held for two hours while we confirm delivery and payment details with you.'}
                            </p>
                            <p className="mt-5 inline-block border border-[#e3e0d8] bg-[#f7f5ef] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#244c3b]">
                                ORDER {order.order_number}
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-10">
                            <h2 className="font-serif text-xl text-[#244c3b]">
                                Order summary
                            </h2>
                            <div className="mt-4 divide-y divide-[#ece9e2]">
                                {order.items.map((item, index) => (
                                    <div
                                        key={`${item.sku ?? item.name}-${index}`}
                                        className="flex items-start justify-between gap-4 py-3 text-sm"
                                    >
                                        <div>
                                            <p className="font-medium text-[#33382f]">
                                                {item.name}
                                            </p>
                                            <p className="mt-1 text-xs text-[#85867e]">
                                                Qty {item.quantity} ·{' '}
                                                {formatPrice(item.unit_price)}{' '}
                                                each
                                            </p>
                                        </div>
                                        <span className="shrink-0 font-medium text-[#244c3b]">
                                            {formatPrice(item.line_total)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-[#e8e5dd] pt-4 text-sm">
                                <span className="font-medium text-[#686b62]">
                                    Order subtotal
                                </span>
                                <span className="text-lg font-semibold text-[#244c3b]">
                                    {formatPrice(order.subtotal)}
                                </span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-[#77786e]">
                                Delivery charges are not included and will be
                                confirmed before payment.
                            </p>
                            {order.reservation_expires_at &&
                                !order.reservation_expired && (
                                    <p className="mt-2 text-xs text-[#77786e]">
                                        Reservation expires{' '}
                                        {new Date(
                                            order.reservation_expires_at,
                                        ).toLocaleString('en-KE', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                        .
                                    </p>
                                )}

                            <a
                                href={whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                referrerPolicy="no-referrer"
                                className="mt-7 flex items-center justify-center gap-3 bg-[#1f6b4a] px-5 py-4 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#18563b]"
                            >
                                <MessageCircle size={18} />
                                {order.reservation_expired
                                    ? 'CHECK AVAILABILITY ON WHATSAPP'
                                    : 'CONFIRM DELIVERY & PAYMENT ON WHATSAPP'}
                                <ArrowRight size={16} />
                            </a>
                            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#77786e]">
                                <ShieldCheck
                                    size={15}
                                    className="mt-0.5 shrink-0 text-[#244c3b]"
                                />
                                WhatsApp opens with this order prefilled. Press
                                Send in WhatsApp to contact Afya360. Do not send
                                payment until you have confirmed the delivery
                                fee and order details.
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
