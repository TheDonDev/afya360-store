
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Heart,
    Leaf,
    Menu,
    Minus,
    Plus,
    Search,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Trash2,
    Truck,
    UserRound,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Category =
    | 'All'
    | 'Skincare'
    | 'Cosmetics'
    | 'Hair & Body'
    | 'Supplements';

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

type WelcomeProps = {
    products: Product[];
};

type Department = {
    name: string;
    category: Category;
    subcategories: string[];
};

const categories: Category[] = [
    'All',
    'Skincare',
    'Cosmetics',
    'Hair & Body',
    'Supplements',
];

const departments: Department[] = [
    {
        name: 'Vitamins & Supplements',
        category: 'Supplements',
        subcategories: [
            'Multivitamins', 'Vitamin A', 'Vitamin B', 'Vitamin C',
            'Vitamin D', 'Vitamin E', 'Calcium', 'Iron', 'Magnesium',
            'Potassium', 'Selenium', 'Zinc', 'Amino Acids', 'Botanicals',
            'Omegas', 'Antioxidants', 'Probiotics', 'Enzymes', 'Fiber',
            'Collagen', 'Glucosamine', 'Melatonin', 'Mushrooms',
        ],
    },
    {
        name: 'Beauty & Lifestyle',
        category: 'Cosmetics',
        subcategories: [
            'Baby', 'Bath', 'Beauty Supplements', 'Body', 'Carrier Oils',
            'Deodorants', 'Essential Oils', 'Eyes', 'Face', 'Hands & Feet',
            'Lip Balms', 'Hair', 'Toothpaste & Mouthwash',
        ],
    },
    {
        name: 'Food & Drink',
        category: 'Supplements',
        subcategories: [
            'Cocoa', 'Juices', 'Manuka Honey', 'Oils', 'Sweeteners',
            'Superfoods', 'Vinegars', 'Sugar-Free Chewing Gum',
        ],
    },
    {
        name: 'Sports',
        category: 'Supplements',
        subcategories: [
            'Amino Acids', 'Creatine', 'Electrolytes', 'Pain Relief',
            'Proteins', 'Sports Nutrition',
        ],
    },
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

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE')}`;

export default function Welcome({ products }: WelcomeProps) {
    const [category, setCategory] = useState<Category>('All');
    const [subcategory, setSubcategory] = useState<string | null>(null);
    const [brand, setBrand] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<Record<number, number>>({});
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                category === 'All' || product.category === category;
            const subcategorySource = `${product.source_category ?? ''} ${product.name}`
                .toLowerCase();
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
        () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
        [products],
    );

    const cartItems = products.filter((product) => cart[product.id] > 0);

    const cartCount = Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0,
    );

    const cartTotal = cartItems.reduce(
        (total, product) => total + product.price * cart[product.id],
        0,
    );

    function addToCart(productId: number) {
        setCart((current) => ({
            ...current,
            [productId]: (current[productId] ?? 0) + 1,
        }));
    }

    function changeQuantity(productId: number, change: number) {
        setCart((current) => {
            const nextQuantity = (current[productId] ?? 0) + change;
            const updated = { ...current };

            if (nextQuantity <= 0) {
                delete updated[productId];
            } else {
                updated[productId] = nextQuantity;
            }

            return updated;
        });
    }

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
        document.getElementById('shop')?.scrollIntoView({
            behavior: 'smooth',
        });
    }

    return (
        <>
            <Head title="Afya360 | Beauty, Skincare & Wellness">
                <meta
                    name="description"
                    content="Discover skincare, cosmetics, body care and wellness essentials at Afya360. Explore our collections and find products for your everyday routine."
                />
                <meta name="theme-color" content="#244c3b" />
            </Head>

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
                            href="#home"
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
                            <a
                                href="#home"
                                className="transition hover:text-[#8d6749]"
                            >
                                HOME
                            </a>
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
                            <a
                                href="#about"
                                className="transition hover:text-[#8d6749]"
                            >
                                OUR STORY
                            </a>
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
                                href="/login"
                                aria-label="Customer account"
                                className="hidden rounded-full p-2.5 transition hover:bg-[#f2eee6] sm:inline-flex"
                            >
                                <UserRound size={19} strokeWidth={1.6} />
                            </Link>

                            <button
                                type="button"
                                aria-label={`Shopping bag, ${cartCount} items`}
                                onClick={() => setCartOpen(true)}
                                className="relative rounded-full p-2.5 transition hover:bg-[#f2eee6]"
                            >
                                <ShoppingBag
                                    size={20}
                                    strokeWidth={1.6}
                                />
                                {cartCount > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#244c3b] px-1 text-[9px] font-semibold text-white">
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
                            <a
                                href="#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-sm"
                            >
                                Our story
                            </a>
                        </nav>
                    )}
                </header>

                <main>
                    {/* Hero */}
                    <section
                        id="home"
                        className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-8 sm:pt-8 lg:px-12"
                    >
                        <div className="relative isolate flex min-h-[480px] overflow-hidden rounded-[4px] bg-[#eae5d9] sm:min-h-[530px] lg:min-h-[580px]">
                            <img
                                src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1800&q=90"
                                alt="Beauty and skincare products arranged in a natural setting"
                                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
                            />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f5f0e7]/95 via-[#f5f0e7]/75 to-[#f5f0e7]/10" />

                            <div className="flex max-w-2xl flex-col items-start justify-center px-6 py-14 sm:px-12 lg:px-20 lg:py-20">
                                <div className="mb-7 flex items-center gap-2 text-[10px] font-medium tracking-[0.24em] text-[#44634e] sm:text-xs">
                                    <Sparkles size={15} strokeWidth={1.5} />
                                    YOUR DAILY RITUAL, REIMAGINED
                                </div>

                                <h1 className="max-w-[600px] font-serif text-[45px] leading-[1.04] tracking-[-0.045em] text-[#244c3b] sm:text-6xl lg:text-[76px]">
                                    Feel good in the skin you're in.
                                </h1>

                                <p className="mt-6 max-w-[390px] text-sm leading-7 text-[#56594f] sm:text-base sm:leading-8">
                                    Thoughtfully chosen beauty and wellness
                                    essentials for your everyday self-care
                                    ritual.
                                </p>

                                <a
                                    href="#shop"
                                    className="group mt-8 inline-flex items-center gap-5 bg-[#244c3b] px-7 py-4 text-[10px] font-semibold tracking-[0.16em] text-white transition hover:bg-[#183a2b] sm:text-xs"
                                >
                                    DISCOVER THE COLLECTION
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </a>

                                <div className="mt-9 flex items-center gap-2 text-[10px] tracking-[0.1em] text-[#5d6257] sm:text-xs">
                                    <Leaf size={15} />
                                    YOUR BEAUTY. YOUR WELLNESS. YOUR WAY.
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 hidden max-w-[150px] border-l border-[#244c3b]/40 pl-4 text-[10px] leading-5 tracking-[0.12em] text-[#244c3b] sm:block lg:bottom-10 lg:right-10">
                                SMALL RITUALS.
                                <br />
                                EVERYDAY CONFIDENCE.
                            </div>
                        </div>
                    </section>

                    {/* Category shortcuts */}
                    <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
                        <div className="mb-8 text-center">
                            <p className="text-[10px] tracking-[0.23em] text-[#9a7959]">
                                FIND YOUR FAVOURITES
                            </p>
                            <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                Shop by category
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
                            {[
                                {
                                    name: 'Skincare' as Category,
                                    subtitle: 'Your skin, your ritual',
                                    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
                                },
                                {
                                    name: 'Cosmetics' as Category,
                                    subtitle: 'Beauty that feels like you',
                                    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80',
                                },
                                {
                                    name: 'Hair & Body' as Category,
                                    subtitle: 'Care from head to toe',
                                    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80',
                                },
                                {
                                    name: 'Supplements' as Category,
                                    subtitle: 'Everyday wellness',
                                    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80',
                                },
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => chooseCategory(item.name)}
                                    className="group text-left"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f0ece5]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                                            <h3 className="font-serif text-xl sm:text-2xl">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 text-[10px] text-white/90 sm:text-xs">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between text-[10px] font-medium tracking-[0.1em] text-[#244c3b] sm:text-xs">
                                        EXPLORE
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Products */}
                    <section
                        id="shop"
                        className="scroll-mt-28 bg-[#f7f5ef] py-14 sm:py-20"
                    >
                        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <p className="text-[10px] tracking-[0.23em] text-[#9a7959]">
                                        THE AFYA360 EDIT
                                    </p>
                                    <h2 className="mt-3 font-serif text-3xl tracking-tight text-[#244c3b] sm:text-4xl">
                                        Everyday favourites
                                    </h2>
                                    <p className="mt-3 text-sm text-[#77786e]">
                                        Find something special for your
                                        routine.
                                    </p>
                                </div>

                                <div className="relative w-full md:max-w-[280px]">
                                    <Search
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#77786e]"
                                    />
                                    <input
                                        id="product-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search products..."
                                        className="w-full border border-[#dedbd2] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#9a9b92] focus:border-[#244c3b]"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                                {categories.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setCategory(item);
                                            setSubcategory(null);
                                        }}
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

                            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {(category === 'Skincare' || category === 'Hair & Body' || category === 'Supplements' || category === 'Cosmetics') && (
                                        <>
                                            {category === 'Skincare' && (
                                                <>
                                                    {['All skincare', 'Face Care', 'Cleansers', 'Moisturisers', 'Serums', 'Sunscreen', 'Body Care'].map((item) => {
                                                        const isAll = item === 'All skincare';
                                                        const isActive = isAll ? !subcategory : subcategory === item;

                                                        return (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() => setSubcategory(isAll ? null : item)}
                                                                className={`rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.05em] transition ${
                                                                    isActive
                                                                        ? 'border-[#244c3b] bg-[#244c3b] text-white'
                                                                        : 'border-[#dedbd2] bg-white text-[#5b6057] hover:border-[#244c3b] hover:text-[#244c3b]'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {category === 'Hair & Body' && (
                                                <>
                                                    {['All hair & body', 'Hair Care', 'Shampoo & Conditioner', 'Treatments & Masks', 'Body Care', 'Bath & Shower', 'Deodorants'].map((item) => {
                                                        const isAll = item === 'All hair & body';
                                                        const isActive = isAll ? !subcategory : subcategory === item;

                                                        return (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() => setSubcategory(isAll ? null : item)}
                                                                className={`rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.05em] transition ${
                                                                    isActive
                                                                        ? 'border-[#244c3b] bg-[#244c3b] text-white'
                                                                        : 'border-[#dedbd2] bg-white text-[#5b6057] hover:border-[#244c3b] hover:text-[#244c3b]'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {category === 'Supplements' && (
                                                <>
                                                    {['All supplement types', 'Vitamins & Supplements', 'Food & Drink', 'Sports'].map((item) => {
                                                        const isActive =
                                                            item === 'All supplement types'
                                                                ? !subcategory
                                                                : subcategory === item;

                                                        return (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSubcategory(
                                                                        item === 'All supplement types' ? null : item,
                                                                    );
                                                                }}
                                                                className={`rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.05em] transition ${
                                                                    isActive
                                                                        ? 'border-[#244c3b] bg-[#244c3b] text-white'
                                                                        : 'border-[#dedbd2] bg-white text-[#5b6057] hover:border-[#244c3b] hover:text-[#244c3b]'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}

                                            {category === 'Cosmetics' && (
                                                <>
                                                    {['Beauty & Lifestyle', 'Cosmetics'].map((item) => {
                                                        const isActive = subcategory === item || (!subcategory && item === 'Cosmetics');

                                                        return (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() => setSubcategory(item)}
                                                                className={`rounded-full border px-3 py-1.5 text-[10px] font-medium tracking-[0.05em] transition ${
                                                                    isActive
                                                                        ? 'border-[#244c3b] bg-[#244c3b] text-white'
                                                                        : 'border-[#dedbd2] bg-white text-[#5b6057] hover:border-[#244c3b] hover:text-[#244c3b]'
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                <label className="ml-auto flex items-center gap-2 rounded-full border border-[#dedbd2] bg-[#f7f5ef] px-3 py-2 text-xs text-[#5b6057]">
                                    <span className="font-semibold text-[#244c3b]">Brand</span>
                                    <select
                                        value={brand}
                                        onChange={(event) => setBrand(event.target.value)}
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

                            {(subcategory || brand !== 'All') && (
                                <div className="mt-4 flex items-center gap-3 text-xs text-[#77786e]">
                                    <span>
                                        {subcategory ? `Category: ${subcategory}` : ''}
                                        {subcategory && brand !== 'All' ? ' · ' : ''}
                                        {brand !== 'All' ? `Brand: ${brand}` : ''}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCategory('All');
                                            setSubcategory(null);
                                            setBrand('All');
                                        }}
                                        className="font-medium text-[#244c3b] underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                            )}

                            <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
                                {filteredProducts.map((product) => (
                                    <article
                                        key={product.id}
                                        className="group min-w-0"
                                    >
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
                                                <span className="absolute left-2 top-2 bg-[#fffdf9] px-2 py-1 text-[8px] font-semibold tracking-[0.12em] text-[#244c3b] sm:left-3 sm:top-3 sm:text-[9px]">
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
                                                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-white sm:right-3 sm:top-3"
                                            >
                                                <Heart
                                                    size={17}
                                                    strokeWidth={1.6}
                                                    className={
                                                        wishlist.includes(
                                                            product.id,
                                                        )
                                                            ? 'fill-[#244c3b] text-[#244c3b]'
                                                            : 'text-[#41463f]'
                                                    }
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addToCart(product.id)
                                                }
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
                                            <h3 className="mt-1 min-h-10 line-clamp-2 text-xs leading-5 sm:text-sm">
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
                                                    {formatPrice(
                                                        product.price,
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label={`Add ${product.name} to bag`}
                                                    onClick={() =>
                                                        addToCart(product.id)
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center border border-[#d8d8cc] text-[#244c3b] transition hover:bg-[#244c3b] hover:text-white sm:hidden"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="py-20 text-center">
                                    <Search
                                        size={28}
                                        className="mx-auto text-[#9a9b92]"
                                    />
                                    <h3 className="mt-4 font-serif text-2xl text-[#244c3b]">
                                        No products found
                                    </h3>
                                    <p className="mt-2 text-sm text-[#77786e]">
                                        Try another search or browse all
                                        products.
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

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => {
                                        setCategory('All');
                                        setSearch('');
                                    }}
                                    className="inline-flex items-center gap-3 border-b border-[#244c3b] pb-2 text-[10px] font-semibold tracking-[0.16em] text-[#244c3b] sm:text-xs"
                                >
                                    EXPLORE ALL PRODUCTS
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Brand story */}
                    <section
                        id="about"
                        className="mx-auto grid max-w-[1440px] md:grid-cols-2"
                    >
                        <div className="flex min-h-[330px] flex-col justify-center bg-[#244c3b] px-7 py-14 text-white sm:px-12 lg:px-20 lg:py-20">
                            <p className="text-[10px] tracking-[0.23em] text-[#d8b991]">
                                A LITTLE ABOUT US
                            </p>
                            <h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                                Self-care should feel like coming home.
                            </h2>
                            <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                                Afya360 brings beauty and wellness essentials
                                together in one thoughtful shopping
                                experience. Find products that fit your
                                routine, your needs and your everyday life.
                            </p>
                            <a
                                href="#shop"
                                className="mt-7 inline-flex w-fit items-center gap-3 border-b border-[#d8b991] pb-2 text-[10px] font-semibold tracking-[0.15em] text-[#f3dfc8]"
                            >
                                EXPLORE OUR COLLECTION
                                <ArrowRight size={15} />
                            </a>
                        </div>

                        <div className="relative min-h-[330px] overflow-hidden bg-[#e9e3d7]">
                            <img
                                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85"
                                alt="Beauty and body care products for an everyday self-care routine"
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </section>

                    {/* Trust benefits */}
                    <section className="border-b border-[#e9e6df] bg-white">
                        <div className="mx-auto grid max-w-[1440px] grid-cols-1 divide-y divide-[#e9e6df] px-4 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
                            <div className="flex items-center gap-4 px-3 py-7 sm:px-6 md:py-10">
                                <Truck
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-[#244c3b]"
                                />
                                <div>
                                    <h3 className="text-xs font-semibold text-[#244c3b]">
                                        Delivery information
                                    </h3>
                                    <p className="mt-1 text-[11px] leading-5 text-[#77786e]">
                                        Delivery options and charges shown
                                        before checkout.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 px-3 py-7 sm:px-6 md:py-10">
                                <ShieldCheck
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-[#244c3b]"
                                />
                                <div>
                                    <h3 className="text-xs font-semibold text-[#244c3b]">
                                        Shop with confidence
                                    </h3>
                                    <p className="mt-1 text-[11px] leading-5 text-[#77786e]">
                                        Clear product information and
                                        transparent policies.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 px-3 py-7 sm:px-6 md:py-10">
                                <Sparkles
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-[#244c3b]"
                                />
                                <div>
                                    <h3 className="text-xs font-semibold text-[#244c3b]">
                                        Personalised care
                                    </h3>
                                    <p className="mt-1 text-[11px] leading-5 text-[#77786e]">
                                        Get in touch for help choosing
                                        suitable products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-[#f7f5ef]">
                    <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
                        <div className="lg:col-span-2">
                            <a
                                href="#home"
                                className="font-serif text-4xl font-semibold tracking-[-0.06em] text-[#244c3b]"
                            >
                                afya360<span className="text-[#c28d61]">.</span>
                            </a>
                            <p className="mt-4 max-w-sm text-sm leading-7 text-[#77786e]">
                                Beauty, personal care and wellness essentials
                                for your everyday routine. Find your next
                                favourite at Afya360.
                            </p>
                            <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.15em] text-[#244c3b]">
                                <Leaf size={15} />
                                CARE FOR YOURSELF, EVERY DAY.
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold tracking-[0.13em] text-[#244c3b]">
                                SHOP
                            </h3>
                            <div className="mt-5 space-y-3 text-sm text-[#77786e]">
                                {categories.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => chooseCategory(item)}
                                        className="block transition hover:text-[#244c3b]"
                                    >
                                        {item === 'All'
                                            ? 'All products'
                                            : item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold tracking-[0.13em] text-[#244c3b]">
                                CUSTOMER CARE
                            </h3>
                            <div className="mt-5 space-y-3 text-sm text-[#77786e]">
                                <a
                                    href="#about"
                                    className="block hover:text-[#244c3b]"
                                >
                                    About Afya360
                                </a>
                                <a
                                    href="mailto:hello@afya360.example"
                                    className="block hover:text-[#244c3b]"
                                >
                                    Contact us
                                </a>
                                <span className="block">
                                    Delivery & returns
                                </span>
                                <span className="block">
                                    Privacy policy
                                </span>
                                <span className="block">Terms of service</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#e5e1d8] px-5 py-5 text-center text-[10px] tracking-[0.06em] text-[#898a80] sm:px-8 sm:text-left">
                        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-2 sm:flex-row">
                            <p>
                                © {new Date().getFullYear()} Afya360 Cosmetics
                                & Supplements. All rights reserved.
                            </p>
                            <p>MADE FOR YOUR EVERYDAY WELLNESS.</p>
                        </div>
                    </div>
                </footer>

                {/* Shopping cart drawer */}
                {cartOpen && (
                    <div className="fixed inset-0 z-50">
                        <button
                            type="button"
                            aria-label="Close shopping bag"
                            onClick={() => setCartOpen(false)}
                            className="absolute inset-0 bg-black/40"
                        />

                        <aside
                            role="dialog"
                            aria-modal="true"
                            aria-label="Shopping bag"
                            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#fffdf9] shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#e9e6df] px-5 py-5">
                                <div>
                                    <h2 className="font-serif text-2xl text-[#244c3b]">
                                        Your shopping bag
                                    </h2>
                                    <p className="mt-1 text-xs text-[#77786e]">
                                        {cartCount} item
                                        {cartCount === 1 ? '' : 's'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Close bag"
                                    onClick={() => setCartOpen(false)}
                                    className="rounded-full p-2 hover:bg-[#f2eee6]"
                                >
                                    <X size={21} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <ShoppingBag
                                            size={42}
                                            strokeWidth={1.2}
                                            className="text-[#9a9b92]"
                                        />
                                        <h3 className="mt-5 font-serif text-2xl text-[#244c3b]">
                                            Your bag is waiting
                                        </h3>
                                        <p className="mt-2 max-w-xs text-sm leading-6 text-[#77786e]">
                                            Explore our collection and add
                                            something lovely to your routine.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setCartOpen(false);
                                                document
                                                    .getElementById('shop')
                                                    ?.scrollIntoView({
                                                        behavior: 'smooth',
                                                    });
                                            }}
                                            className="mt-6 bg-[#244c3b] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white"
                                        >
                                            CONTINUE SHOPPING
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {cartItems.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex gap-4 border-b border-[#e9e6df] pb-5"
                                            >
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-24 w-20 bg-[#f0ece5] object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        role="img"
                                                        aria-label={`${product.name} image unavailable`}
                                                        className="h-24 w-20 bg-[#f0ece5]"
                                                    />
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[9px] tracking-[0.1em] text-[#898a80]">
                                                        {product.brand.toUpperCase()}
                                                    </p>
                                                    <h3 className="mt-1 text-sm font-medium text-[#244c3b]">
                                                        {product.name}
                                                    </h3>
                                                    <p className="mt-2 text-sm font-semibold">
                                                        {formatPrice(
                                                            product.price,
                                                        )}
                                                    </p>

                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center border border-[#dedbd2]">
                                                            <button
                                                                aria-label="Decrease quantity"
                                                                onClick={() =>
                                                                    changeQuantity(
                                                                        product.id,
                                                                        -1,
                                                                    )
                                                                }
                                                                className="p-2 hover:bg-[#f2eee6]"
                                                            >
                                                                <Minus
                                                                    size={13}
                                                                />
                                                            </button>
                                                            <span className="min-w-7 text-center text-xs">
                                                                {
                                                                    cart[
                                                                        product
                                                                            .id
                                                                    ]
                                                                }
                                                            </span>
                                                            <button
                                                                aria-label="Increase quantity"
                                                                onClick={() =>
                                                                    changeQuantity(
                                                                        product.id,
                                                                        1,
                                                                    )
                                                                }
                                                                className="p-2 hover:bg-[#f2eee6]"
                                                            >
                                                                <Plus
                                                                    size={13}
                                                                />
                                                            </button>
                                                        </div>

                                                        <button
                                                            aria-label="Remove item"
                                                            onClick={() =>
                                                                changeQuantity(
                                                                    product.id,
                                                                    -cart[
                                                                        product
                                                                            .id
                                                                    ],
                                                                )
                                                            }
                                                            className="p-2 text-[#898a80] hover:text-red-700"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cartItems.length > 0 && (
                                <div className="border-t border-[#e9e6df] p-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#77786e]">
                                            Subtotal
                                        </span>
                                        <span className="text-lg font-semibold text-[#244c3b]">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-[#77786e]">
                                        Delivery charges will be calculated
                                        at checkout.
                                    </p>
                                    <button
                                        type="button"
                                        disabled
                                        className="mt-5 flex w-full items-center justify-center gap-3 bg-[#244c3b] px-5 py-4 text-xs font-semibold tracking-[0.13em] text-white opacity-60"
                                        title="Checkout will be enabled when orders and payments are implemented."
                                    >
                                        CHECKOUT COMING SOON
                                        <ArrowRight size={16} />
                                    </button>
                                    <p className="mt-3 text-center text-[10px] text-[#898a80]">
                                        Online payments will be enabled after
                                        checkout integration.
                                    </p>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
}
