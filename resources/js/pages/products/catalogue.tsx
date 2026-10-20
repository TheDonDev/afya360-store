import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ArrowRight,
    Leaf,
    Menu,
    Search,
    Sparkles,
    ShoppingBag,
    Truck,
    UserRound,
    X,
} from 'lucide-react';
import { useCart } from '@/components/storefront/cart-provider';
import AiChatbot from '@/components/ai-chatbot/AiChatbot';

type Category = 'All' | 'Skincare' | 'Cosmetics' | 'Hair & Body' | 'Supplements';

type Product = {
    id: number;
    slug: string;
    name: string;
    brand: string;
    category: string;
    source_category: string | null;
    price: number;
    image: string | null;
    label?: string;
    stock_quantity: number | null;
    stock_status: string | null;
};

type CatalogueProps = {
    products: Product[];
    auth: {
        user: { name: string; email: string } | null;
    };
};

const categories: Category[] = [
    'All',
    'Skincare',
    'Cosmetics',
    'Hair & Body',
    'Supplements',
];

const getCategoryLabel = (item: Category) => {
    if (item === 'Supplements') {
        return 'Vitamins & Supplements';
    }
    if (item === 'Cosmetics') {
        return 'Cosmetics, Beauty & Lifestyle';
    }
    return item;
};

const formatPrice = (price: number) => `KSh ${price.toLocaleString('en-KE')}`;

export default function Catalogue({ products }: CatalogueProps) {
    const { auth } = usePage<CatalogueProps>().props;
    const [category, setCategory] = useState<Category>('All');
    const [subcategory, setSubcategory] = useState<string | null>(null);
    const [brand, setBrand] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { itemCount: cartCount, openCart, addItem } = useCart();

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                category === 'All' || product.category === category;
            const subcategorySource =
                `${product.source_category ?? ''} ${product.name}`.toLowerCase();
            const matchesSubcategory =
                !subcategory ||
                subcategorySource.includes(subcategory.toLowerCase());
            const matchesBrand = brand === 'All' || product.brand === brand;

            const matchesSearch =
                !term ||
                `${product.name} ${product.brand} ${product.category} ${product.source_category ?? ''}`
                    .toLowerCase()
                    .includes(term);

            return (
                matchesCategory &&
                matchesSubcategory &&
                matchesBrand &&
                matchesSearch
            );
        });
    }, [brand, category, products, search, subcategory]);

    const brands = useMemo(
        () =>
            [
                ...new Set(
                    products.map((product) => product.brand).filter(Boolean),
                ),
            ].sort(),
        [products],
    );

    function toggleWishlist(productId: number) {
        setWishlist((current) =>
            current.includes(productId)
                ? current.filter((id) => id !== productId)
                : [...current, productId],
        );
    }

    function chooseCategory(nextCategory: Category) {
        setCategory(nextCategory);
        setSubcategory(null);
        setBrand('All');
        setMobileMenuOpen(false);
    }

    return (
        <>
            <Head title="All Products | Afya360" />
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
                            aria-label="Open navigation"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-full p-2 transition hover:bg-[#f2eee6] md:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X size={21} />
                            ) : (
                                <Menu size={21} />
                            )}
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

                        <nav className="hidden items-center gap-7 text-[11px] font-medium tracking-[0.1em] lg:flex">
                            <Link
                                href="/"
                                className="transition hover:text-[#8d6749]"
                            >
                                HOME
                            </Link>
                            <button
                                onClick={() => chooseCategory('Skincare')}
                                className="transition hover:text-[#8d6749]"
                            >
                                SKINCARE
                            </button>
                            <button
                                onClick={() => chooseCategory('Cosmetics')}
                                className="transition hover:text-[#8d6749]"
                            >
                                COSMETICS
                            </button>
                            <button
                                onClick={() => chooseCategory('Hair & Body')}
                                className="transition hover:text-[#8d6749]"
                            >
                                HAIR & BODY
                            </button>
                            <button
                                onClick={() => chooseCategory('Supplements')}
                                className="transition hover:text-[#8d6749]"
                            >
                                SUPPLEMENTS
                            </button>
                        </nav>

                        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                            <button
                                type="button"
                                aria-label="Search products"
                                onClick={() =>
                                    document
                                        .getElementById('product-search')
                                        ?.focus()
                                }
                                className="rounded-full p-2.5 transition hover:bg-[#f2eee6]"
                            >
                                <Search size={19} strokeWidth={1.6} />
                            </button>

                            <Link
                                href={
                                    auth.user ? '/settings/profile' : '/login'
                                }
                                aria-label={
                                    auth.user
                                        ? 'Profile settings'
                                        : 'Sign in to your account'
                                }
                                className="hidden rounded-full p-2.5 transition hover:bg-[#f2eee6] sm:inline-flex"
                            >
                                <UserRound size={19} strokeWidth={1.6} />
                            </Link>

                            <button
                                type="button"
                                aria-label={`Shopping bag, ${cartCount} items`}
                                onClick={openCart}
                                className="relative rounded-full p-2.5 transition hover:bg-[#f2eee6]"
                            >
                                <ShoppingBag size={20} strokeWidth={1.6} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#244c3b] px-1 text-[9px] font-semibold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <nav className="border-t border-[#e9e6df] bg-[#fffdf9] px-5 py-4 md:hidden">
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => chooseCategory(item)}
                                    className="block w-full border-b border-[#eeeae3] py-3 text-left text-sm"
                                >
                                    {item === 'All'
                                        ? 'Shop all products'
                                        : item}
                                </button>
                            ))}
                        </nav>
                    )}
                </header>

                <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                    <div className="mb-8 text-center">
                        <p className="text-[10px] tracking-[0.23em] text-[#9a7959]">
                            FIND YOUR FAVOURITES
                        </p>
                        <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                            Full Product Catalogue
                        </h2>
                        <p className="mt-3 text-sm text-[#77786e]">
                            Browse our complete range of beauty, skincare, body
                            care and wellness essentials.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => chooseCategory(item)}
                                    className={`shrink-0 border px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] transition sm:px-5 sm:text-xs ${
                                        category === item
                                            ? 'border-[#244c3b] bg-[#244c3b] text-white'
                                            : 'border-[#dedbd2] bg-transparent text-[#5b6057] hover:border-[#244c3b]'
                                    }`}
                                >
                                    {item === 'All'
                                        ? 'ALL PRODUCTS'
                                        : getCategoryLabel(item).toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <label className="ml-auto flex items-center gap-2 rounded-full border border-[#dedbd2] bg-[#f7f5ef] px-3 py-2 text-xs text-[#5b6057]">
                            <span className="font-semibold text-[#244c3b]">
                                Brand
                            </span>
                            <select
                                value={brand}
                                onChange={(event) =>
                                    setBrand(event.target.value)
                                }
                                className="bg-transparent text-xs text-[#5b6057] outline-none"
                            >
                                <option value="All">All brands</option>
                                {brands.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 relative w-full md:max-w-[280px]">
                        <Search
                            size={17}
                            className="absolute top-1/2 left-4 -translate-y-1/2 text-[#77786e]"
                        />
                        <input
                            id="product-search"
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search products..."
                            className="w-full border border-[#dedbd2] bg-white py-3 pr-4 pl-11 text-sm transition outline-none placeholder:text-[#9a9b92] focus:border-[#244c3b]"
                        />
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <article key={product.id} className="group min-w-0">
                                <div className="relative aspect-[4/4.7] overflow-hidden bg-[#eeebe4]">
                                    {product.image ? (
                                        <Link
                                            href={`/products/${product.slug}`}
                                            aria-label={`View ${product.name}`}
                                            className="block h-full w-full"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                                            />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/products/${product.slug}`}
                                            aria-label={`View ${product.name}`}
                                            className="block h-full w-full bg-[#e6e3da]"
                                        />
                                    )}

                                    {product.label && (
                                        <span className="absolute top-2 left-2 bg-[#fffdf9] px-2 py-1 text-[8px] font-semibold tracking-[0.12em] text-[#244c3b] sm:top-3 sm:left-3 sm:text-[9px]">
                                            {product.label}
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        aria-label={
                                            wishlist.includes(product.id)
                                                ? 'Remove from wishlist'
                                                : 'Add to wishlist'
                                        }
                                        onClick={() =>
                                            toggleWishlist(product.id)
                                        }
                                        className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-white sm:top-3 sm:right-3"
                                    >
                                        <Heart
                                            size={17}
                                            strokeWidth={1.6}
                                            className={
                                                wishlist.includes(product.id)
                                                    ? 'fill-[#244c3b] text-[#244c3b]'
                                                    : 'text-[#41463f]'
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => void addItem(product)}
                                        className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-[#244c3b] py-3 text-[10px] font-medium tracking-[0.12em] text-white transition-transform duration-300 group-hover:translate-y-0 max-sm:translate-y-0 sm:text-xs"
                                    >
                                        <Plus size={15} />
                                        ADD TO BAG
                                    </button>
                                </div>

                                <div className="pt-3 sm:pt-4">
                                    <p className="text-[9px] tracking-[0.12em] text-[#8b8c81] sm:text-[10px]">
                                        {product.brand.toUpperCase()}
                                    </p>
                                    <h3 className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 sm:text-sm">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="text-[#33382f] hover:text-[#244c3b]"
                                        >
                                            {product.name}
                                        </Link>
                                    </h3>

                                    <div className="mt-1.5 text-[10px] text-[#77786e]">
                                        {product.stock_status === 'limited'
                                            ? product.stock_quantity === null
                                                ? 'Limited stock'
                                                : `Only ${product.stock_quantity} left`
                                            : product.stock_status === 'in_stock'
                                              ? 'In stock'
                                              : 'Availability varies'}
                                    </div>

                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-[#244c3b] sm:text-base">
                                            {formatPrice(product.price)}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Add ${product.name} to bag`}
                                            onClick={() => void addItem(product)}
                                            className="inline-flex h-8 w-8 items-center justify-center border border-[#d8d8cc] text-[#244c3b] transition hover:bg-[#244c3b] hover:text-white sm:hidden"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center">
                                <Search size={28} className="mx-auto text-[#9a9b92]" />
                                <h3 className="mt-4 font-serif text-2xl text-[#244c3b]">
                                    No products found
                                </h3>
                                <p className="mt-2 text-sm text-[#77786e]">
                                    Try another search or browse all products.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        setCategory('All');
                                    }}
                                    className="mt-5 border border-[#244c3b] px-5 py-3 text-xs font-medium text-[#244c3b]"
                                >
                                    CLEAR FILTERS
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 border-b border-[#244c3b] pb-2 text-[10px] font-semibold tracking-[0.16em] text-[#244c3b] sm:text-xs"
                        >
                            RETURN TO HOME <ArrowRight size={15} />
                        </Link>
                    </div>
                </main>

                <footer className="mt-12 bg-[#f7f5ef] px-4 py-8 text-center text-xs text-[#77786e]">
                    © {new Date().getFullYear()} Afya360 Cosmetics & Supplements
                </footer>
            </div>
            <AiChatbot />
        </>
    );
}
