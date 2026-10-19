<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('checkout/index');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_phone' => [
                'required',
                'string',
                'regex:/^(?:\\+?254|0)[17][0-9]{8}$/',
            ],
            'customer_email' => ['nullable', 'email', 'max:254'],
            'delivery_address' => ['required', 'string', 'max:2000'],
            'delivery_area' => ['required', 'string', 'max:120'],
            'delivery_notes' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:whatsapp,visa'],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.id' => ['required', 'integer', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:1000'],
        ]);

        $order = DB::transaction(function () use ($validated): Order {
            $requestedItems = collect($validated['items'])
                ->keyBy(fn (array $item): int => (int) $item['id']);

            /** @var Collection<int, Product> $products */
            $products = Product::query()
                ->whereIn('id', $requestedItems->keys())
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            if ($products->count() !== $requestedItems->count()) {
                throw ValidationException::withMessages([
                    'items' => 'A product in your bag is no longer available. Please review your bag.',
                ]);
            }

            $subtotal = 0;

            foreach ($requestedItems as $id => $item) {
                $product = $products->get($id);
                $quantity = (int) $item['quantity'];
                $reservedQuantity = OrderItem::query()
                    ->where('product_id', $id)
                    ->whereHas('order', fn ($query) => $query
                        ->where('status', 'pending')
                        ->where('reservation_expires_at', '>', now()))
                    ->sum('quantity');
                $availableQuantity = max(
                    0,
                    (int) ($product?->stock_quantity ?? 0) - $reservedQuantity,
                );
                $available = $product
                    && $product->is_active
                    && $product->catalog_visibility === 'visible'
                    && in_array($product->stock_status, ['in_stock', 'limited'], true)
                    && $product->stock_quantity !== null
                    && $availableQuantity > 0;
                $maximum = $product?->sold_individually
                    ? 1
                    : $availableQuantity;

                if (! $available || $quantity > $maximum) {
                    throw ValidationException::withMessages([
                        'items' => $product
                            ? "{$product->name} no longer has the requested quantity available. Please update your bag."
                            : 'A product in your bag is no longer available. Please review your bag.',
                    ]);
                }

                $subtotal += (int) round((float) $product->price * 100) * $quantity;
            }

            $order = Order::query()->create([
                'reference' => (string) Str::uuid(),
                'order_number' => 'AFY-'.now()->format('ymd').'-'.Str::upper(Str::random(6)),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'] ?? null,
                'delivery_address' => $validated['delivery_address'],
                'delivery_area' => $validated['delivery_area'],
                'delivery_notes' => $validated['delivery_notes'] ?? null,
                'subtotal' => number_format($subtotal / 100, 2, '.', ''),
                'delivery_fee' => null,
                'total' => null,
                'reservation_expires_at' => now()->addHours(2),
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
                'payment_status' => 'unpaid',
            ]);

            foreach ($requestedItems as $id => $item) {
                $product = $products->get($id);
                $quantity = (int) $item['quantity'];

                $unitPrice = (int) round((float) $product->price * 100);

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'unit_price' => number_format($unitPrice / 100, 2, '.', ''),
                    'quantity' => $quantity,
                    'line_total' => number_format($unitPrice * $quantity / 100, 2, '.', ''),
                ]);
            }

            return $order;
        }, attempts: 3);

        return to_route('checkout.confirmation', $order->reference);
    }

    public function visaPayment(Order $order): Response
    {
        if ($order->payment_method !== 'visa') {
            return to_route('checkout.confirmation', $order->reference);
        }

        $config = config('services.visa_gateway');
        $gatewayConfigured = !empty($config['org_id'] && $config['key_id'] && $config['shared_secret']);

        return Inertia::render('checkout/visa-payment', [
            'order' => [
                'reference' => $order->reference,
                'order_number' => $order->order_number,
                'subtotal' => (float) $order->subtotal,
                'payment_method' => $order->payment_method,
            ],
            'gateway_configured' => $gatewayConfigured,
            'gateway_config' => [
                'environment' => $config['environment'],
                'org_id' => $config['org_id'],
                'key_id' => $config['key_id'],
            ],
        ]);
    }

    public function confirmation(Order $order): Response
    {
        $order->load('items:id,order_id,product_name,sku,unit_price,quantity,line_total');
        $reservationExpired = ! $order->reservation_expires_at
            || $order->reservation_expires_at->isPast();

        $messageLines = [
            "Hello Afya360, I placed order {$order->order_number}.",
            '',
            'Customer: '.$order->customer_name,
            'Contact: '.$order->customer_phone,
            'Delivery area: '.$order->delivery_area,
            'Delivery address: '.$order->delivery_address,
        ];

        if ($order->delivery_notes) {
            $messageLines[] = 'Delivery notes: '.$order->delivery_notes;
        }

        $messageLines = array_merge($messageLines, [
            '',
            'Order summary:',
        ]);

        foreach ($order->items as $item) {
            $messageLines[] = "{$item->quantity} x {$item->product_name} - KSh ".number_format((float) $item->line_total, 2);
        }

        $messageLines[] = '';
        $messageLines[] = 'Order subtotal: KSh '.number_format((float) $order->subtotal, 2);
        if ($reservationExpired) {
            $messageLines[] = 'This order reservation has expired. Please confirm current stock before arranging payment.';
        } else {
            $messageLines[] = 'Items are reserved until '.$order->reservation_expires_at?->format('M j, H:i').'.';
            $messageLines[] = 'Please confirm delivery charges and send payment instructions.';
        }

        $phone = preg_replace('/[^0-9]/', '', (string) config('services.whatsapp.order_number'));
        $phone = str_starts_with($phone, '0')
            ? '254'.substr($phone, 1)
            : $phone;
        $whatsappQuery = http_build_query([
            'text' => implode("\n", $messageLines),
        ], '', '&', PHP_QUERY_RFC1738);
        $whatsappUrl = 'https://wa.me/'.$phone.'?'.$whatsappQuery;

        return Inertia::render('checkout/confirmation', [
            'order' => [
                'reference' => $order->reference,
                'order_number' => $order->order_number,
                'subtotal' => (float) $order->subtotal,
                'payment_method' => $order->payment_method,
                'items' => $order->items->map(fn ($item): array => [
                    'name' => $item->product_name,
                    'sku' => $item->sku,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'line_total' => (float) $item->line_total,
                ])->all(),
                'reservation_expires_at' => $order->reservation_expires_at?->toIso8601String(),
                'reservation_expired' => $reservationExpired,
            ],
            'whatsapp_url' => $whatsappUrl,
        ]);
    }

    public function visaWebhook(Request $request)
    {
        $payload = $request->all();
        Log::info('Visa webhook received', $payload);

        $config = config('services.visa_gateway');
        $signature = $request->header('x-visa-signature');
        $sharedSecret = $config['shared_secret'];

        if ($sharedSecret && $signature) {
            $expected = hash_hmac('sha256', json_encode($payload), $sharedSecret);
            if (! hash_equals($expected, $signature)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        $reference = $payload['reference'] ?? $payload['order_reference'] ?? null;
        $status = $payload['status'] ?? $payload['payment_status'] ?? null;

        if (!$reference || !$status) {
            return response()->json(['error' => 'Missing reference or status'], 400);
        }

        $order = Order::where('reference', $reference)->first();

        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        if (in_array($status, ['paid', 'completed', 'success'])) {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'total' => $payload['amount'] ?? $order->subtotal,
            ]);
        } elseif (in_array($status, ['failed', 'cancelled', 'declined'])) {
            $order->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
