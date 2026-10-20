<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'session_id' => ['nullable', 'string'],
        ]);

        $message = $request->input('message');
        $sessionId = $request->input('session_id', uniqid());

        Log::info('AI Chatbot message', [
            'session_id' => $sessionId,
            'message' => $message,
        ]);

        $response = $this->generateResponse($message, $sessionId);

        return response()->json([
            'session_id' => $sessionId,
            'response' => $response,
            'timestamp' => now()->toISOString(),
        ]);
    }

    private function generateResponse(string $message, string $sessionId): string
    {
        $lower = strtolower($message);

        // Greeting
        if (preg_match('/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/', $lower)) {
            return "Hello! Welcome to Afya360 🌿 I'm your AI beauty and wellness assistant. How can I help you today? You can ask me about products, skincare routines, delivery, or get personalized recommendations.";
        }

        // Product recommendations based on condition/need
        if (preg_match('/\b(recommend|suggest|looking for|need|for|help with|treat|care for)\b/', $lower)) {
            return $this->getProductRecommendations($message);
        }

        // Product search
        if (preg_match('/\b(find|search|show|browse|products|catalogue|catalog)\b/', $lower)) {
            return "I can help you find products! Visit our <a href='/products' class='text-[#244c3b] underline'>product catalogue</a> to browse all 100+ items across skincare, cosmetics, hair & body, and supplements. Or tell me what you're looking for and I'll recommend the best options!";
        }

        // Delivery questions
        if (preg_match('/\b(deliver|shipping|ship|arrive|how long|days|tracking)\b/', $lower)) {
            return "🚚 **Delivery Information:**\n• Processing: 1-2 business days\n• Nairobi delivery: 2-5 business days\n• Countrywide delivery: 3-7 business days\n• Delivery fees are calculated at checkout based on your location\n• Tracking updates are sent via WhatsApp\n\nWould you like to check delivery to a specific area?";
        }

        // Returns questions
        if (preg_match('/\b(return|refund|exchange|money back)\b/', $lower)) {
            return "🔄 **Returns Policy:**\n• Return window: 7 days from delivery\n• Items must be unused with seal intact\n• Must be in original packaging\n• Refunds processed within 5-7 business days after we receive your return\n• Non-returnable: personal care items (hygiene), clearance items, gift cards unless damaged\n\nTo start a return, WhatsApp us at 0724151522 with your order number.";
        }

        // Payment questions
        if (preg_match('/\b(payment|pay|visa|whatsapp|mpesa|cash|checkout)\b/', $lower)) {
            return "💳 **Payment Options:**\n• **Visa Card** - Secure, provider-hosted payment page\n• **WhatsApp** - Confirm delivery and pay via WhatsApp to 0724151522\n\nAll payments are processed securely. Your card details are never stored by Afya360.";
        }

        // Contact questions
        if (preg_match('/\b(contact|support|help|phone|call|email|whatsapp|reach)\b/', $lower)) {
            return "📞 **Contact Afya360:**\n• WhatsApp: 0724151522 (fastest response)\n• Email: support@afya360.co.ke\n• Hours: Mon-Sat, 8:00 AM - 6:00 PM (EAT)\n• Location: Nairobi, Kenya\n\nHow can I assist you today?";
        }

        // About questions
        if (preg_match('/\b(about|who|afya360|store|company|business)\b/', $lower)) {
            return "🌿 **About Afya360:**\nWe're Kenya's trusted online beauty and wellness destination. Named after the Swahili word 'afya' (health), we curate 100+ products across skincare, cosmetics, hair & body, and supplements. Your beauty. Your wellness. Your way.";
        }

        // Category-specific
        if (preg_match('/\b(skincare|skin|face|moisturiser|serum|cleanser|sunscreen)\b/', $lower)) {
            return "🧴 **Skincare Category:** We offer cleansers, moisturisers, serums, sunscreen, and face care products. Looking for something specific like acne treatment, anti-ageing, or sensitive skin care? Tell me your skin concern and I'll recommend products.";
        }

        if (preg_match('/\b(hair|shampoo|conditioner|scalp|hair loss|hair growth)\b/', $lower)) {
            return "💇‍♀️ **Hair Care Category:** We have shampoos, conditioners, treatments, and hair masks. Dealing with hair loss, dry scalp, or looking for hair growth products? Let me know your hair type and concern.";
        }

        if (preg_match('/\b(supplement|vitamin|wellness|nutrition|immune|energy)\b/', $lower)) {
            return "💊 **Supplements Category:** Vitamins, minerals, protein, and wellness supplements for everyday health. Looking for immune support, energy, or specific nutrients? Share your health goal and I'll suggest options.";
        }

        if (preg_match('/\b(cosmetic|makeup|make-up|lipstick|beauty|lifestyle)\b/', $lower)) {
            return "💄 **Cosmetics Category:** Beauty and lifestyle products including lip care, makeup essentials, and more. Want a natural look or something bold? Tell me your style preference.";
        }

        // Price/cost questions
        if (preg_match('/\b(price|cost|cheap|affordable|expensive|budget|KES|shilling|ksh)\b/', $lower)) {
            return "💰 **Pricing:** Our products range from affordable everyday essentials to premium skincare. Prices are in Kenyan Shillings (KES) and include applicable taxes. Visit our <a href='/products' class='text-[#244c3b] underline'>product catalogue</a> to see current prices. Looking for something within a specific budget?";
        }

        // Stock/availability
        if (preg_match('/\b(stock|available|in stock|out of stock|availability)\b/', $lower)) {
            return "📦 **Stock Status:** All products in our catalogue show current stock status. Items marked 'In Stock' are ready to ship. 'Limited stock' means only a few remain. 'Out of Stock' items are unavailable. Want to check a specific product?";
        }

        // Order status
        if (preg_match('/\b(order|status|track|my order|where is)\b/', $lower)) {
            return "📋 **Order Tracking:** Once your order is placed, you'll receive WhatsApp updates with tracking information. You can also WhatsApp us at 0724151522 with your order number for status updates. Do you have an order number I can help you with?";
        }

        // Default helpful response
        return "I'm here to help! 🌿 You can ask me about:\n• Product recommendations for your skin, hair, or wellness needs\n• Delivery times and shipping areas\n• Returns and refunds policy\n• Payment options (Visa & WhatsApp)\n• Product categories and pricing\n• Order status and tracking\n\nWhat would you like to know? Or visit our <a href='/products' class='text-[#244c3b] underline'>full product catalogue</a>.";
    }

    private function getProductRecommendations(string $message): string
    {
        $lower = strtolower($message);

        // Try to get actual products from database
        try {
            $products = Product::query()
                ->where('is_active', true)
                ->where('catalog_visibility', 'visible')
                ->limit(6)
                ->get();

            if ($products->isNotEmpty()) {
                $recommendations = $products->map(function ($product) {
                    return "• **{$product->name}** - KSh " . number_format((float) $product->price, 2) . "\n  {$product->category->name} • {$product->stock_status}";
                })->implode("\n\n");

                return "🎯 **Here are some great products for you:**\n\n{$recommendations}\n\nVisit our <a href='/products' class='text-[#244c3b] underline'>product catalogue</a> to see all 100+ products. Tell me more about your specific needs (skin type, hair concern, health goal) and I'll give you more targeted recommendations!";
            }
        } catch (\Exception $e) {
            Log::warning('Could not fetch products for chatbot: ' . $e->getMessage());
        }

        return "🎯 **Personalized Recommendations:**\n\nTo give you the best product suggestions, tell me:\n1. What are you looking to treat or improve? (acne, dry skin, hair loss, energy, immunity, etc.)\n2. Your skin type (oily, dry, combination, sensitive)\n3. Your budget range\n4. Any preferences (natural, organic, fragrance-free)\n\nOnce you share these details, I'll recommend specific products from our catalogue of 100+ items!";
    }
}
