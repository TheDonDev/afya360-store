import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Plus,
    ShoppingBag,
    ShieldCheck,
    Truck,
} from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/components/storefront/cart-provider';

type ProductDetails = {
    id: number;
    slug: string;
    name: string;
    sku: string | null;
    brand: string;
    category: {
        name: string;
        slug: string;
    };
    short_description: string | null;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    images: string[];
    stock_quantity: number | null;
    stock_status: string | null;
    source_stock_text: string | null;
    allow_customer_reviews: boolean;
};

type Props = {
    product: ProductDetails;
};

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

export default function Show({ product }: Props) {
    const { addItem, itemCount, openCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(
        product.images[0] ?? null,
    );

    const availability =
        product.stock_status === 'limited'
            ? product.stock_quantity !== null
                ? `Only ${product.stock_quantity} left`
                : 'Limited stock'
            : product.stock_status === 'in_stock'
              ? 'In stock'
              : 'Availability to be confirmed';

    return (
        <>
            <Head title={`${product.name} | Afya360`}>
                <meta
                    name="description"
                    content={
                        product.short_description ??
                        `${product.name} from Afya360. View product details and availability.`
                    }
                />
            </Head>

            <div className="min-h-screen bg-[#fffdf9] text-[#242923]">
                <div className="bg-[#244c3b] px-4 py-2.5 text-center text-xs tracking-[0.12em] text-white">
                    AFYA360 · BEAUTY · CARE · WELLNESS
                </div>

                <header className="border-b border-[#e9e6df]">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
                        <Link
                            href="/"
                            className="font-serif text-3xl font-semibold tracking-tight text-[#244c3b]"
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
                        <button
                            type="button"
                            aria-label={`Shopping bag, ${itemCount} items`}
                            onClick={openCart}
                            className="relative rounded-full p-2.5 transition hover:bg-[#f2eee6]"
                        >
                            <ShoppingBag size={19} strokeWidth={1.6} />
                            {itemCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#244c3b] px-1 text-[9px] font-semibold text-white">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[#77786e]"
                    >
                        <Link href="/" className="hover:text-[#244c3b]">
                            Home
                        </Link>
                        <ChevronRight size={14} />
                        <Link href="/#shop" className="hover:text-[#244c3b]">
                            Shop
                        </Link>
                        <ChevronRight size={14} />
                        <span>{product.category.name}</span>
                        <ChevronRight size={14} />
                        <span className="max-w-[220px] truncate text-[#244c3b]">
                            {product.name}
                        </span>
                    </nav>

                    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
                        <section aria-label="Product images">
                            <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#f0ece5]">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="px-6 text-center text-sm text-[#77786e]">
                                        Product image unavailable
                                    </div>
                                )}
                            </div>

                            {product.images.length > 1 && (
                                <div className="mt-3 grid grid-cols-5 gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedImage(image)}
                                            aria-label={`View product image ${index + 1}`}
                                            aria-pressed={selectedImage === image}
                                            className={`aspect-square overflow-hidden border bg-[#f0ece5] ${
                                                selectedImage === image
                                                    ? 'border-[#244c3b]'
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name}, image ${index + 1}`}
                                                loading="lazy"
                                                className="h-full w-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="flex flex-col">
                            <p className="text-xs font-medium tracking-[0.18em] text-[#9a7959]">
                                {product.brand.toUpperCase()}
                            </p>

                            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-[#244c3b] sm:text-4xl">
                                {product.name}
                            </h1>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <span className="text-2xl font-semibold text-[#244c3b]">
                                    {formatPrice(product.price)}
                                </span>

                                {product.compare_at_price !== null &&
                                    product.compare_at_price > product.price && (
                                        <span className="text-sm text-[#898a80] line-through">
                                            {formatPrice(product.compare_at_price)}
                                        </span>
                                    )}
                            </div>

                            <div className="mt-5 flex items-center gap-2 text-sm">
                                <span
                                    className={`h-2 w-2 rounded-full ${
                                        product.stock_status === 'in_stock'
                                            ? 'bg-green-600'
                                            : product.stock_status === 'limited'
                                              ? 'bg-amber-500'
                                              : 'bg-gray-400'
                                    }`}
                                />
                                <span className="text-[#56594f]">
                                    {availability}
                                </span>
                            </div>

                            {product.short_description && (
                                <p className="mt-6 text-sm leading-7 text-[#56594f]">
                                    {product.short_description}
                                </p>
                            )}

                            <div className="mt-7 border-y border-[#e9e6df] py-5">
                                <p className="text-xs text-[#77786e]">Category</p>
                                <p className="mt-1 text-sm text-[#244c3b]">
                                    {product.category.name}
                                </p>

                                {product.sku && (
                                    <p className="mt-4 text-xs text-[#77786e]">
                                        Product code: {product.sku}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 space-y-4 text-xs leading-5 text-[#77786e]">
                                <div className="flex items-start gap-3">
                                    <Truck size={18} className="shrink-0 text-[#244c3b]" />
                                    <p>
                                        Delivery options and charges will be confirmed
                                        during checkout.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <ShieldCheck size={18} className="shrink-0 text-[#244c3b]" />
                                    <p>
                                        Review product details before placing your order.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => void addItem(product)}
                                className="mt-8 inline-flex items-center justify-center gap-2 bg-[#244c3b] px-6 py-4 text-xs font-semibold tracking-[0.12em] text-white transition hover:bg-[#183a2b]"
                            >
                                <Plus size={16} />
                                ADD TO BAG
                            </button>
                        </section>
                    </div>

                    {product.description && (
                        <section className="mt-14 border-t border-[#e9e6df] pt-8 sm:mt-20">
                            <h2 className="font-serif text-2xl text-[#244c3b]">
                                Product description
                            </h2>
                            <div className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#56594f]">
                                {product.description}
                            </div>
                        </section>
                    )}
                </main>

                <footer className="mt-12 bg-[#f7f5ef] px-4 py-8 text-center text-xs text-[#77786e]">
                    © {new Date().getFullYear()} Afya360 Cosmetics & Supplements
                </footer>
            </div>
        </>
    );
}