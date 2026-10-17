
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'afya360.cart.v1';

export type CartProductInput = {
    id: number;
    slug: string;
    name: string;
    brand?: string;
    category?: string | { name: string; slug?: string };
    price: number;
    image?: string | null;
    images?: string[];
};

type Availability = {
    id: number;
    slug: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    image: string | null;
    stock_quantity: number | null;
    stock_status: string | null;
    sold_individually: boolean;
    purchasable: boolean;
    max_quantity: number;
    message: string | null;
};

export type CartItem = {
    id: number;
    slug: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    image: string | null;
    stock_quantity: number | null;
    stock_status: string | null;
    quantity: number;
    available: boolean;
    maxQuantity: number;
    availabilityMessage: string | null;
};

type CartContextValue = {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    isOpen: boolean;
    notice: string | null;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: CartProductInput) => Promise<void>;
    changeQuantity: (id: number, change: number) => Promise<void>;
    removeItem: (id: number) => void;
    clearNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const formatPrice = (price: number) =>
    `KSh ${price.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

async function fetchAvailability(id: number): Promise<Availability> {
    const response = await fetch(`/cart/availability/${id}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ?? 'Could not verify this product’s availability.',
        );
    }

    return data as Availability;
}

function applyAvailability(
    item: CartItem,
    stock: Availability,
): CartItem {
    return {
        ...item,
        slug: stock.slug,
        name: stock.name,
        brand: stock.brand,
        category: stock.category,
        price: stock.price,
        image: stock.image,
        stock_quantity: stock.stock_quantity,
        stock_status: stock.stock_status,
        available: stock.purchasable,
        maxQuantity: stock.max_quantity,
        availabilityMessage: stock.message,
        quantity: stock.purchasable
            ? Math.min(
                  item.quantity,
                  stock.max_quantity,
              )
            : item.quantity,
    };
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [busyIds, setBusyIds] = useState<number[]>([]);

    useEffect(() => {
        let active = true;

        async function restoreCart() {
            let restored: CartItem[] = [];

            try {
                const raw = window.localStorage.getItem(STORAGE_KEY);
                const parsed: unknown = raw ? JSON.parse(raw) : [];

                if (Array.isArray(parsed)) {
                    restored = parsed.filter(
                        (item): item is CartItem =>
                            typeof item?.id === 'number' &&
                            typeof item?.quantity === 'number' &&
                            item.quantity > 0 &&
                            typeof item?.name === 'string',
                    ).map((item) => ({
                        ...item,
                        available: false,
                        maxQuantity: 0,
                        availabilityMessage: 'Checking current stock…',
                    }));
                }
            } catch {
                restored = [];
            }

            if (!active) return;

            setItems(restored);
            setHydrated(true);

            const checked = await Promise.all(
                restored.map(async (item) => {
                    try {
                        const stock = await fetchAvailability(item.id);
                        return applyAvailability(item, stock);
                    } catch (error) {
                        return {
                            ...item,
                            available: false,
                            maxQuantity: 0,
                            availabilityMessage:
                                error instanceof Error
                                    ? error.message
                                    : 'Stock could not be verified.',
                        };
                    }
                }),
            );

            if (active) setItems(checked);
        }

        void restoreCart();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(items),
            );
        } catch {
            setNotice('Your browser could not save the cart on this device.');
        }
    }, [items, hydrated]);

    async function addItem(product: CartProductInput) {
        setIsOpen(true);
        setNotice(null);
        setBusyIds((current) =>
            current.includes(product.id)
                ? current
                : [...current, product.id],
        );

        try {
            const stock = await fetchAvailability(product.id);

            if (!stock.purchasable || stock.max_quantity < 1) {
                setNotice(
                    stock.message ?? 'This product is not currently available.',
                );
                return;
            }

            const existing = items.find((item) => item.id === product.id);
            const requestedQuantity = (existing?.quantity ?? 0) + 1;
            const quantity = Math.min(
                requestedQuantity,
                stock.max_quantity,
            );

            setItems((current) => {
                const found = current.find((item) => item.id === product.id);

                const base: CartItem = found ?? {
                    id: stock.id,
                    slug: stock.slug,
                    name: stock.name,
                    brand: stock.brand,
                    category: stock.category,
                    price: stock.price,
                    image: stock.image,
                    stock_quantity: stock.stock_quantity,
                    stock_status: stock.stock_status,
                    quantity: 0,
                    available: true,
                    maxQuantity: stock.max_quantity,
                    availabilityMessage: null,
                };

                const refreshed = applyAvailability(base, stock);

                return found
                    ? current.map((item) =>
                          item.id === product.id
                              ? { ...refreshed, quantity }
                              : item,
                      )
                    : [...current, { ...refreshed, quantity: 1 }];
            });

            if (requestedQuantity > stock.max_quantity) {
                setNotice(
                    `Only ${stock.max_quantity} unit(s) are currently available.`,
                );
            }
        } catch (error) {
            setNotice(
                error instanceof Error
                    ? error.message
                    : 'Could not verify stock. Please try again.',
            );
        } finally {
            setBusyIds((current) =>
                current.filter((id) => id !== product.id),
            );
        }
    }

    async function changeQuantity(id: number, change: number) {
        const currentItem = items.find((item) => item.id === id);
        if (!currentItem) return;

        if (change < 0) {
            const nextQuantity = currentItem.quantity + change;

            if (nextQuantity <= 0) {
                removeItem(id);
            } else {
                setItems((current) =>
                    current.map((item) =>
                        item.id === id
                            ? { ...item, quantity: nextQuantity }
                            : item,
                    ),
                );
            }

            return;
        }

        if (busyIds.includes(id)) return;

        setNotice(null);
        setBusyIds((current) => [...current, id]);

        try {
            const stock = await fetchAvailability(id);

            if (!stock.purchasable || stock.max_quantity < 1) {
                setItems((current) =>
                    current.map((item) =>
                        item.id === id
                            ? applyAvailability(item, stock)
                            : item,
                    ),
                );
                setNotice(
                    stock.message ?? 'This product is not currently available.',
                );
                return;
            }

            const requestedQuantity = currentItem.quantity + change;
            const quantity = Math.min(
                requestedQuantity,
                stock.max_quantity,
            );

            setItems((current) =>
                current.map((item) =>
                    item.id === id
                        ? { ...applyAvailability(item, stock), quantity }
                        : item,
                ),
            );

            if (requestedQuantity > stock.max_quantity) {
                setNotice(
                    `Stock limit reached. Maximum available: ${stock.max_quantity}.`,
                );
            }
        } catch (error) {
            setItems((current) =>
                current.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              available: false,
                              maxQuantity: 0,
                              availabilityMessage:
                                  'Stock could not be verified. Try again.',
                          }
                        : item,
                ),
            );

            setNotice(
                error instanceof Error
                    ? error.message
                    : 'Could not verify stock. Please try again.',
            );
        } finally {
            setBusyIds((current) => current.filter((itemId) => itemId !== id));
        }
    }

    function removeItem(id: number) {
        setItems((current) => current.filter((item) => item.id !== id));
    }

    const value = useMemo<CartContextValue>(
        () => ({
            items,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: items
                .filter((item) => item.available)
                .reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                ),
            isOpen,
            notice,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            addItem,
            changeQuantity,
            removeItem,
            clearNotice: () => setNotice(null),
        }),
        [items, isOpen, notice, busyIds],
    );

    return (
        <CartContext.Provider value={value}>
            {children}
            <CartDrawer busyIds={busyIds} />
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used inside CartProvider.');
    }

    return context;
}

function CartDrawer({ busyIds }: { busyIds: number[] }) {
    const {
        items,
        itemCount,
        subtotal,
        isOpen,
        notice,
        closeCart,
        changeQuantity,
        removeItem,
        clearNotice,
    } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <button
                type="button"
                aria-label="Close shopping bag"
                onClick={closeCart}
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
                            {itemCount} item{itemCount === 1 ? '' : 's'}
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close bag"
                        onClick={closeCart}
                        className="rounded-full p-2 hover:bg-[#f2eee6]"
                    >
                        <X size={21} />
                    </button>
                </div>

                {notice && (
                    <div
                        role="status"
                        className="mx-5 mt-4 flex items-start justify-between gap-3 border border-[#e8d7c7] bg-[#fbf2e9] p-3 text-xs leading-5 text-[#704b31]"
                    >
                        <span>{notice}</span>
                        <button
                            type="button"
                            aria-label="Dismiss message"
                            onClick={clearNotice}
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
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
                                Explore our collection and add something lovely
                                to your routine.
                            </p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="mt-6 bg-[#244c3b] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white"
                            >
                                CONTINUE SHOPPING
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 border-b border-[#e9e6df] pb-5"
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-24 w-20 bg-[#f0ece5] object-cover"
                                        />
                                    ) : (
                                        <div className="h-24 w-20 bg-[#f0ece5]" />
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] tracking-[0.1em] text-[#898a80]">
                                            {item.brand.toUpperCase()}
                                        </p>
                                        <Link
                                            href={`/products/${item.slug}`}
                                            onClick={closeCart}
                                            className="mt-1 block text-sm font-medium text-[#244c3b] hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-2 text-sm font-semibold">
                                            {formatPrice(item.price)}
                                        </p>

                                        {!item.available && (
                                            <p className="mt-2 text-xs leading-5 text-red-700">
                                                {item.availabilityMessage ??
                                                    'Availability needs to be confirmed.'}
                                            </p>
                                        )}

                                        {item.available && (
                                            <p className="mt-1 text-xs text-[#77786e]">
                                                {item.stock_quantity} verified
                                                unit(s) available
                                            </p>
                                        )}

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center border border-[#dedbd2]">
                                                <button
                                                    type="button"
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                    onClick={() =>
                                                        void changeQuantity(
                                                            item.id,
                                                            -1,
                                                        )
                                                    }
                                                    className="p-2 hover:bg-[#f2eee6]"
                                                >
                                                    <Minus size={13} />
                                                </button>
                                                <span className="min-w-7 text-center text-xs">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    aria-label={`Increase ${item.name} quantity`}
                                                    disabled={busyIds.includes(item.id)}
                                                    onClick={() =>
                                                        void changeQuantity(
                                                            item.id,
                                                            1,
                                                        )
                                                    }
                                                    className="p-2 hover:bg-[#f2eee6] disabled:opacity-40"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label={`Remove ${item.name}`}
                                                onClick={() => removeItem(item.id)}
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

                {items.length > 0 && (
                    <div className="border-t border-[#e9e6df] p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#77786e]">
                                Available items subtotal
                            </span>
                            <span className="text-lg font-semibold text-[#244c3b]">
                                {formatPrice(subtotal)}
                            </span>
                        </div>
                        {items.some((item) => !item.available) && (
                            <p className="mt-2 text-xs leading-5 text-red-700">
                                Remove or recheck unavailable products before
                                checkout. Unavailable items are excluded from
                                this subtotal.
                            </p>
                        )}
                        <p className="mt-2 text-xs leading-5 text-[#77786e]">
                            Delivery charges will be calculated at checkout.
                        </p>
                        <button
                            type="button"
                            disabled
                            className="mt-5 flex w-full items-center justify-center gap-3 bg-[#244c3b] px-5 py-4 text-xs font-semibold tracking-[0.13em] text-white opacity-60"
                            title="Checkout will be enabled after order and payment integration."
                        >
                            CHECKOUT COMING SOON
                            <ArrowRight size={16} />
                        </button>
                        <p className="mt-3 text-center text-[10px] text-[#898a80]">
                            Stock is checked when you add or increase a
                            product. It is not reserved until checkout is
                            implemented.
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}
