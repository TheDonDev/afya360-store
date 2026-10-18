<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function availability(int $product): JsonResponse
    {
        $item = Product::query()
            ->with('category:id,name')
            ->find($product);

        if (
            ! $item ||
            ! $item->is_active ||
            $item->catalog_visibility !== 'visible'
        ) {
            return response()->json([
                'message' => 'This product is no longer available.',
            ], 404);
        }

        $reservedQuantity = OrderItem::query()
            ->where('product_id', $item->id)
            ->whereHas('order', fn ($query) => $query
                ->where('status', 'pending')
                ->where('reservation_expires_at', '>', now()))
            ->sum('quantity');
        $quantity = max(0, (int) ($item->stock_quantity ?? 0) - $reservedQuantity);
        $verifiedStatus = in_array(
            $item->stock_status,
            ['in_stock', 'limited'],
            true
        );

        // A status label alone is not enough: we require a
        // known, positive quantity before allowing a purchase.
        $purchasable = $verifiedStatus
            && $item->stock_quantity !== null
            && $quantity > 0;

        $maxQuantity = $purchasable
            ? ($item->sold_individually ? 1 : $quantity)
            : 0;

        return response()->json([
            'id' => $item->id,
            'slug' => $item->slug,
            'name' => $item->name,
            'brand' => $item->brand ?: ($item->category?->name ?? ''),
            'category' => $item->category?->name ?? '',
            'price' => (float) $item->price,
            'image' => $item->image_url,
            'stock_quantity' => $quantity,
            'stock_status' => $item->stock_status,
            'sold_individually' => $item->sold_individually,
            'purchasable' => $purchasable,
            'max_quantity' => $maxQuantity,
            'message' => $purchasable
                ? null
                : 'Stock availability is not confirmed, or the product is out of stock.',
        ]);
    }
}
