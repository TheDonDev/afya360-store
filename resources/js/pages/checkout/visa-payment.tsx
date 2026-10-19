import { Head, Link, useState } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CreditCard,
    Lock,
    ShieldCheck,
    Sparkles,
    Truck,
    X,
} from 'lucide-react';

type VisaPaymentProps = {
    order: {
        reference: string;
        order_number: string;
        subtotal: number;
        payment_method: string;
    };
    gateway_configured: boolean;
    gateway_config: {
        environment: string | null;
        org_id: string | null;
        key_id: string | null;
    };
};

const formatPrice = (price: number) => `KSh ${price.toLocaleString('en-KE')}`;

export default function VisaPayment({
    order,
    gateway_configured,
    gateway_config,
}: VisaPaymentProps) {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'card' | 'processing' | 'success' | 'failed'>('card');

    const handlePayWithVisa = async () => {
        if (!gateway_configured) {
            alert(
                'Visa gateway is not configured. Please contact support to complete this payment.'
            );
            return;
        }

        setProcessing(true);
        setStep('processing');

        try {
            // Simulate Visa gateway payment processing
            // In production, this would redirect to the gateway's hosted payment page
            // or call the gateway API to create a payment intent
            const response = await fetch('/api/visa/payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    order_reference: order.reference,
                    order_number: order.order_number,
                    amount: order.subtotal,
                    currency: 'KES',
                    environment: gateway_config.environment,
                    org_id: gateway_config.org_id,
                    key_id: gateway_config.key_id,
                }),
            });

            const data = await response.json();

            if (data.success && data.payment_url) {
                // Redirect to gateway hosted payment page
                window.location.href = data.payment_url;
            } else if (data.success && data.status === 'paid') {
                // Immediate success (sandbox simulation)
                setStep('success');
                setProcessing(false);
            } else {
                setStep('failed');
                setProcessing(false);
            }
        } catch (error) {
            console.error('Visa payment error:', error);
            setStep('failed');
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title={`Visa Payment | Afya360`} />
            <div className="min-h-screen bg-[#f5f4ee] text-[#242923]">
                <div className="bg-[#244c3b] px-4 py-2 text-center text-[10px] font-medium tracking-[0.16em] text-white">
                    AFYA360 · SECURE PAYMENT
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
                            <ArrowLeft size={16} /> Continue shopping
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-16">
                    <section className="border border-[#e3e0d8] bg-[#fffdf9]">
                        {step === 'card' ? (
                            <div className="border-b border-[#e8e5dd] px-6 py-8 text-center sm:px-10">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eee7] text-[#244c3b]">
                                    <CreditCard size={23} />
                                </span>
                                <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                                    SECURE CARD PAYMENT
                                </p>
                                <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                                    Complete Your Payment
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#686b62]">
                                    Pay for your order securely with Visa. Your card
                                    details are processed on a secure payment page
                                    and are never stored by Afya360.
                                </p>
                            </div>
                        ) : step === 'processing' ? (
                            <div className="border-b border-[#e8e5dd] px-6 py-8 text-center sm:px-10">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eee7] text-[#244c3b] animate-spin">
                                    <Sparkles size={23} strokeWidth={2} />
                                </span>
                                <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                                    PROCESSING PAYMENT
                                </p>
                                <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                                    Please Wait
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#686b62]">
                                    Your payment is being processed securely.
                                    Please do not close this page.
                                </p>
                            </div>
                        ) : step === 'success' ? (
                            <div className="border-b border-[#e8e5dd] px-6 py-8 text-center sm:px-10">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eee7] text-[#244c3b]">
                                    <Check size={23} />
                                </span>
                                <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                                    PAYMENT SUCCESSFUL
                                </p>
                                <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                                    Payment Confirmed
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#686b62]">
                                    Your Visa payment has been processed
                                    successfully. You will be redirected to your
                                    order confirmation shortly.
                                </p>
                            </div>
                        ) : (
                            <div className="border-b border-[#e8e5dd] px-6 py-8 text-center sm:px-10">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f5ef] text-[#c28d61]">
                                    <X size={23} strokeWidth={2} />
                                </span>
                                <p className="mt-5 text-[10px] font-medium tracking-[0.18em] text-[#a97b53]">
                                    PAYMENT FAILED
                                </p>
                                <h1 className="mt-2 font-serif text-3xl text-[#244c3b] sm:text-4xl">
                                    Payment Could Not Be Completed
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[#686b62]">
                                    Your Visa payment was declined or could not be
                                    processed. Please try again or use an alternative
                                    payment method.
                                </p>
                            </div>
                        )}

                        {step === 'card' && (
                            <div className="px-6 py-6 sm:px-10">
                                <div className="border border-[#e3e0d8] bg-[#f7f5ef] p-6 rounded-lg">
                                    <p className="mb-3 text-xs tracking-[0.18em] text-[#8b8c81]">
                                        ORDER {order.order_number}
                                    </p>
                                    <p className="mt-1 font-medium text-[#33382f]">
                                        Subtotal: <span className="font-semibold text-[#244c3b]">{formatPrice(order.subtotal)}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-[#77786e]">
                                        Delivery charges will be confirmed before
                                        final payment.
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <p className="mb-3 text-xs tracking-[0.18em] text-[#8b8c81]">
                                        PAYMENT METHOD
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handlePayWithVisa}
                                        disabled={processing}
                                        className={`flex w-full items-center justify-center gap-3 border px-5 py-4 text-xs font-semibold tracking-[0.1em] transition ${
                                            processing
                                                ? 'border-[#d6d2c8] bg-[#e8e5dd] text-[#77786e] cursor-not-allowed'
                                                : 'border-[#244c3b] bg-[#244c3b] text-white hover:bg-[#183a2b]'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <Sparkles
                                                    size={17}
                                                    strokeWidth={2}
                                                    className="shrink-0 animate-spin"
                                                />
                                                <span>PROCESSING PAYMENT...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={17} className="shrink-0" />
                                                <span>
                                                    PAY WITH VISA CARD
                                                    <span className="ml-1 inline-block border border-white/30 bg-white px-1 py-0.5 text-[9px] font-bold text-[#334b79]">
                                                        VISA
                                                    </span>
                                                </span>
                                                <Lock size={17} className="shrink-0" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#77786e]">
                                    <ShieldCheck
                                        size={15}
                                        className="mt-0.5 shrink-0 text-[#244c3b]"
                                    />
                                    <div>
                                        <p className="font-medium text-[#33382f]">
                                            Secure payment processing
                                        </p>
                                        <p>
                                            Card details are encrypted and
                                            processed by our payment
                                            provider. We never see or store
                                            your full card number.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(step === 'success' || step === 'failed') && (
                            <div className="px-6 py-6 sm:px-10">
                                {step === 'success' ? (
                                    <button
                                        onClick={() => {
                                            window.location.href = `/checkout/confirmation/${order.reference}`;
                                        }}
                                        className="mt-6 flex w-full items-center justify-center gap-3 border border-[#244c3b] bg-[#244c3b] px-5 py-4 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#183a2b]"
                                    >
                                        <ArrowLeft size={16} />
                                        VIEW ORDER CONFIRMATION
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setStep('card')}
                                            className="w-full border border-[#244c3b] bg-[#fffdf9] px-5 py-4 text-xs font-semibold tracking-[0.1em] text-[#244c3b] transition hover:bg-[#f3f6f1] mb-3"
                                        >
                                            <ArrowLeft size={16} />
                                            TRY AGAIN
                                        </button>
                                        <button
                                            onClick={() => {
                                                window.location.href = `/checkout/confirmation/${order.reference}`;
                                            }}
                                            className="w-full border border-[#244c3b] bg-[#244c3b] px-5 py-4 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#183a2b]"
                                        >
                                            VIEW ORDER CONFIRMATION
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </section>

                    <div className="mt-10 text-center">
                        <Link
                            href={`/checkout/confirmation/${order.reference}`}
                            className="inline-flex items-center gap-2 border-b border-[#244c3b] pb-2 text-[10px] font-semibold tracking-[0.16em] text-[#244c3b] sm:text-xs"
                        >
                            RETURN TO ORDER <ArrowLeft size={15} />
                        </Link>
                    </div>
                </main>

                <footer className="mt-12 bg-[#f7f5ef] px-4 py-8 text-center text-xs text-[#77786e]">
                    © {new Date().getFullYear()} Afya360 Cosmetics & Supplements
                </footer>
            </div>
        </>
    );
}
