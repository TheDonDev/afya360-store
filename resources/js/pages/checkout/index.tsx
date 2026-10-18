import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/components/storefront/cart-provider';

type CheckoutForm = {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    delivery_address: string;
    delivery_area: string;
    delivery_notes: string;
    items: { id: number; quantity: number }[];
};

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-1.5 text-xs text-red-700">{message}</p>
    ) : null;
}

export default function Checkout() {
    const { items, subtotal, clearCart } = useCart();
    const form = useForm<CheckoutForm>({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        delivery_address: '',
        delivery_area: '',
        delivery_notes: '',
        items: [],
    });
    const unavailableItems = items.filter(
        (item) => !item.available || item.quantity > item.maxQuantity,
    );

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            items: items.map(({ id, quantity }) => ({ id, quantity })),
        }));
        form.post('/checkout', {
            preserveScroll: true,
            onSuccess: clearCart,
        });
    }

    return (
        <>
            <Head title="Checkout | Afya360" />

            <div className="min-h-screen bg-[#f5f4ee] text-[#242923]">
                <div className="bg-[#244c3b] px-4 py-2 text-center text-[10px] font-medium tracking-[0.16em] text-white">
                    AFYA360 · SECURE ORDER DETAILS
                </div>

                <header className="border-b border-[#e5e3dc] bg-[#fffdf9]">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
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
                            <ArrowLeft size={16} />
                            Continue shopping
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-[10px] tracking-[0.2em] text-[#a97b53]">
                            YOUR ORDER
                        </p>
                        <h1 className="mt-2 font-serif text-4xl text-[#244c3b]">
                            Delivery details
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-[#686b62]">
                            Add your contact and delivery details. We’ll confirm
                            delivery charges and payment instructions with you
                            on WhatsApp after your order is created.
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <section className="border border-[#e3e0d8] bg-[#fffdf9] px-6 py-14 text-center">
                            <h2 className="font-serif text-2xl text-[#244c3b]">
                                Your bag is empty
                            </h2>
                            <p className="mt-2 text-sm text-[#77786e]">
                                Add available products before starting checkout.
                            </p>
                            <Link
                                href="/#shop"
                                className="mt-6 inline-flex items-center gap-2 bg-[#244c3b] px-5 py-3 text-xs font-semibold tracking-[0.1em] text-white"
                            >
                                BROWSE PRODUCTS <ArrowRight size={15} />
                            </Link>
                        </section>
                    ) : (
                        <form
                            onSubmit={submit}
                            className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
                        >
                            <div className="space-y-6">
                                <section className="border border-[#e3e0d8] bg-[#fffdf9] p-5 sm:p-7">
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center bg-[#e8eee7] text-[#244c3b]">
                                            <Check size={16} />
                                        </span>
                                        <div>
                                            <h2 className="font-serif text-2xl text-[#244c3b]">
                                                Customer details
                                            </h2>
                                            <p className="text-xs text-[#85867e]">
                                                Who should we contact about your
                                                order?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <label className="text-xs font-medium text-[#4e554e] sm:col-span-2">
                                            Full name{' '}
                                            <span className="text-red-700">
                                                *
                                            </span>
                                            <input
                                                required
                                                autoComplete="name"
                                                value={form.data.customer_name}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'customer_name',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.customer_name
                                                }
                                            />
                                        </label>

                                        <label className="text-xs font-medium text-[#4e554e]">
                                            Mobile number{' '}
                                            <span className="text-red-700">
                                                *
                                            </span>
                                            <input
                                                required
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="07XX XXX XXX"
                                                value={form.data.customer_phone}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'customer_phone',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.customer_phone
                                                }
                                            />
                                        </label>

                                        <label className="text-xs font-medium text-[#4e554e]">
                                            Email{' '}
                                            <span className="font-normal text-[#85867e]">
                                                (optional)
                                            </span>
                                            <input
                                                type="email"
                                                autoComplete="email"
                                                value={form.data.customer_email}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'customer_email',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.customer_email
                                                }
                                            />
                                        </label>
                                    </div>
                                </section>

                                <section className="border border-[#e3e0d8] bg-[#fffdf9] p-5 sm:p-7">
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center bg-[#f1e9dd] text-[#8d6749]">
                                            <Truck size={16} />
                                        </span>
                                        <div>
                                            <h2 className="font-serif text-2xl text-[#244c3b]">
                                                Delivery address
                                            </h2>
                                            <p className="text-xs text-[#85867e]">
                                                Share where the order should be
                                                delivered.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <label className="text-xs font-medium text-[#4e554e] sm:col-span-2">
                                            Street, building, estate or landmark{' '}
                                            <span className="text-red-700">
                                                *
                                            </span>
                                            <textarea
                                                required
                                                rows={3}
                                                autoComplete="street-address"
                                                value={
                                                    form.data.delivery_address
                                                }
                                                onChange={(event) =>
                                                    form.setData(
                                                        'delivery_address',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full resize-y border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.delivery_address
                                                }
                                            />
                                        </label>

                                        <label className="text-xs font-medium text-[#4e554e] sm:col-span-2">
                                            Town or delivery area{' '}
                                            <span className="text-red-700">
                                                *
                                            </span>
                                            <input
                                                required
                                                autoComplete="address-level2"
                                                value={form.data.delivery_area}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'delivery_area',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.delivery_area
                                                }
                                            />
                                        </label>

                                        <label className="text-xs font-medium text-[#4e554e] sm:col-span-2">
                                            Delivery notes{' '}
                                            <span className="font-normal text-[#85867e]">
                                                (optional)
                                            </span>
                                            <textarea
                                                rows={2}
                                                placeholder="Helpful directions or preferred delivery time"
                                                value={form.data.delivery_notes}
                                                onChange={(event) =>
                                                    form.setData(
                                                        'delivery_notes',
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 w-full resize-y border border-[#dcdad2] bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#244c3b]"
                                            />
                                            <FieldError
                                                message={
                                                    form.errors.delivery_notes
                                                }
                                            />
                                        </label>
                                    </div>
                                </section>

                                {unavailableItems.length > 0 && (
                                    <div
                                        role="alert"
                                        className="border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                                    >
                                        Some products in your bag are no longer
                                        available in the selected quantities.
                                        Return to your bag to review them before
                                        continuing.
                                        <FieldError
                                            message={form.errors.items}
                                        />
                                    </div>
                                )}
                            </div>

                            <aside className="border border-[#e3e0d8] bg-[#fffdf9] lg:sticky lg:top-6">
                                <div className="border-b border-[#e8e5dd] px-5 py-5">
                                    <h2 className="font-serif text-2xl text-[#244c3b]">
                                        Order summary
                                    </h2>
                                    <p className="mt-1 text-xs text-[#85867e]">
                                        {items.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0,
                                        )}{' '}
                                        item(s)
                                    </p>
                                </div>

                                <div className="max-h-[420px] space-y-4 overflow-y-auto px-5 py-5">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt=""
                                                    className="h-16 w-14 shrink-0 bg-[#f0ece5] object-cover"
                                                />
                                            ) : (
                                                <div className="h-16 w-14 shrink-0 bg-[#f0ece5]" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-2 text-xs leading-5 font-medium text-[#33382f]">
                                                    {item.name}
                                                </p>
                                                <p className="mt-1 text-[11px] text-[#77786e]">
                                                    Qty {item.quantity} ·{' '}
                                                    {formatPrice(item.price)}{' '}
                                                    each
                                                </p>
                                                {!item.available && (
                                                    <p className="mt-1 text-[11px] text-red-700">
                                                        {item.availabilityMessage ??
                                                            'Availability needs to be checked.'}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="shrink-0 text-xs font-semibold text-[#244c3b]">
                                                {formatPrice(
                                                    item.price * item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#e8e5dd] px-5 py-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#686b62]">
                                            Order subtotal
                                        </span>
                                        <span className="font-semibold text-[#244c3b]">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#77786e]">
                                        <ShieldCheck
                                            size={15}
                                            className="mt-0.5 shrink-0 text-[#244c3b]"
                                        />
                                        Delivery fee and final payment amount
                                        will be confirmed on WhatsApp.
                                    </div>
                                    {form.errors.items &&
                                        unavailableItems.length === 0 && (
                                            <p
                                                role="alert"
                                                className="mt-3 text-xs leading-5 text-red-700"
                                            >
                                                {form.errors.items}
                                            </p>
                                        )}
                                    <button
                                        type="submit"
                                        disabled={
                                            form.processing ||
                                            items.length === 0 ||
                                            unavailableItems.length > 0
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-3 bg-[#244c3b] px-5 py-4 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-[#183a2b] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {form.processing
                                            ? 'CREATING YOUR ORDER…'
                                            : 'PLACE ORDER'}
                                        {!form.processing && (
                                            <ArrowRight size={16} />
                                        )}
                                    </button>
                                    <Link
                                        href="/"
                                        className="mt-4 block text-center text-xs text-[#686b62] hover:text-[#244c3b] hover:underline"
                                    >
                                        Return to shopping
                                    </Link>
                                </div>
                            </aside>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}
