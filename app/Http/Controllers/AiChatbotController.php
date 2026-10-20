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

        $message = trim($request->input('message'));
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
        $words = array_unique(array_filter(explode(' ', preg_replace('/[^\w\s]/', ' ', $lower))));

        // --- GREETING ---
        if (preg_match('/\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/', $lower)) {
            return "Hello! I'm Aya, your Afya360 beauty and wellness assistant 🌿 How can I help you today? You can ask me about products, get personalized recommendations, or ask about delivery and returns.";
        }

        // --- HELP / CAPABILITIES ---
        if (preg_match('/\b(help|what can you do|capabilities|features|assist)\b/', $lower)) {
            return "I'm Aya, your Afya360 assistant 🌿 Here's how I can help:\n\n• Product recommendations for your skin, hair, or wellness needs\n• Find products by category (skincare, hair & body, supplements, cosmetics)\n• Delivery times and shipping areas\n• Returns and refunds policy\n• Payment options (Visa & WhatsApp)\n• Order status and tracking\n• Store information and contact details\n\nJust ask me anything in plain language!";
        }

        // --- PRODUCT RECOMMENDATIONS WITH REASONING ---
        if (preg_match('/\b(recommend|suggest|looking for|need|help with|treat|care for|good for|best for|suitable for)\b/', $lower)) {
            return $this->getReasonedRecommendations($message, $lower);
        }

        // --- PRODUCT SEARCH / BROWSE ---
        if (preg_match('/\b(find|search|show|browse|products|catalogue|catalog|see all)\b/', $lower)) {
            return "I can help you find products! Visit our product catalogue to browse all 100+ items across skincare, cosmetics, hair & body, and supplements. Or tell me what you're looking for and I'll recommend the best options.";
        }

        // --- DELIVERY ---
        if (preg_match('/\b(deliver|shipping|ship|arrive|how long|days|tracking)\b/', $lower)) {
            return "🚚 Delivery Information:\n\n• Processing: 1-2 business days\n• Nairobi delivery: 2-5 business days\n• Countrywide delivery: 3-7 business days\n• Delivery fees are calculated at checkout based on your location\n• Tracking updates are sent via WhatsApp\n\nWould you like to check delivery to a specific area?";
        }

        // --- RETURNS ---
        if (preg_match('/\b(return|refund|exchange|money back)\b/', $lower)) {
            return "🔄 Returns Policy:\n\n• Return window: 7 days from delivery\n• Items must be unused with seal intact\n• Must be in original packaging\n• Refunds processed within 5-7 business days after we receive your return\n• Non-returnable: personal care items (hygiene), clearance items, gift cards unless damaged\n\nTo start a return, WhatsApp us at 0724151522 with your order number.";
        }

        // --- PAYMENT ---
        if (preg_match('/\b(payment|pay|visa|whatsapp|mpesa|cash|checkout)\b/', $lower)) {
            return "💳 Payment Options:\n\n• Visa Card - Secure, provider-hosted payment page\n• WhatsApp - Confirm delivery and pay via WhatsApp to 0724151522\n\nAll payments are processed securely. Your card details are never stored by Afya360.";
        }

        // --- CONTACT ---
        if (preg_match('/\b(contact|support|help|phone|call|email|whatsapp|reach)\b/', $lower)) {
            return "📞 Contact Afya360:\n\n• WhatsApp: 0724151522 (fastest response)\n• Email: support@afya360.co.ke\n• Hours: Mon-Sat, 8:00 AM - 6:00 PM (EAT)\n• Location: Nairobi, Kenya\n\nHow can I assist you today?";
        }

        // --- ABOUT ---
        if (preg_match('/\b(about|who|afya360|store|company|business)\b/', $lower)) {
            return "🌿 About Afya360:\n\nWe're Kenya's trusted online beauty and wellness destination. Named after the Swahili word 'afya' (health), we curate 100+ products across skincare, cosmetics, hair & body, and supplements. Your beauty. Your wellness. Your way.";
        }

        // --- CATEGORY-SPECIFIC WITH REASONING ---
        if (preg_match('/\b(skincare|skin|face|moisturiser|moisturizer|serum|cleanser|sunscreen)\b/', $lower)) {
            return $this->getCategoryRecommendations('Skincare', $message, $lower);
        }

        if (preg_match('/\b(hair|shampoo|conditioner|scalp|hair loss|hair growth)\b/', $lower)) {
            return $this->getCategoryRecommendations('Hair & Body', $message, $lower);
        }

        if (preg_match('/\b(supplement|vitamin|wellness|nutrition|immune|energy)\b/', $lower)) {
            return $this->getCategoryRecommendations('Supplements', $message, $lower);
        }

        if (preg_match('/\b(cosmetic|makeup|make-up|lipstick|beauty|lifestyle)\b/', $lower)) {
            return $this->getCategoryRecommendations('Cosmetics', $message, $lower);
        }

        // --- PRICING ---
        if (preg_match('/\b(price|cost|cheap|affordable|expensive|budget|KES|shilling|ksh)\b/', $lower)) {
            return "💰 Pricing:\n\nOur products range from affordable everyday essentials to premium skincare. Prices are in Kenyan Shillings (KES) and include applicable taxes. Visit our product catalogue to see current prices. Looking for something within a specific budget?";
        }

        // --- STOCK ---
        if (preg_match('/\b(stock|available|in stock|out of stock|availability)\b/', $lower)) {
            return "📦 Stock Status:\n\nAll products in our catalogue show current stock status. Items marked 'In Stock' are ready to ship. 'Limited stock' means only a few remain. 'Out of Stock' items are unavailable. Want to check a specific product?";
        }

        // --- ORDER STATUS ---
        if (preg_match('/\b(order|status|track|my order|where is)\b/', $lower)) {
            return "📋 Order Tracking:\n\nOnce your order is placed, you'll receive WhatsApp updates with tracking information. You can also WhatsApp us at 0724151522 with your order number for status updates. Do you have an order number I can help you with?";
        }

        // --- DEFAULT: Reasoning-based fallback ---
        return $this->getReasonedFallback($message, $lower);
    }

    private function getReasonedRecommendations(string $message, string $lower): string
    {
        // Extract intent keywords from the message
        $intentKeywords = [];
        $keywordMap = [
            'acne' => ['acne', 'pimple', 'breakout', 'blemish'],
            'dry skin' => ['dry', 'dehydrated', 'flaky'],
            'oily skin' => ['oily', 'sebum', 'shine'],
            'sensitive skin' => ['sensitive', 'irritation', 'redness', 'gentle'],
            'anti-aging' => ['anti-aging', 'antiageing', 'wrinkle', 'fine line', 'mature'],
            'dark spots' => ['dark spot', 'hyperpigmentation', 'pigment', 'even tone'],
            'sun protection' => ['sunscreen', 'spf', 'sun protection', 'uv'],
            'hair loss' => ['hair loss', 'thinning', 'balding'],
            'dandruff' => ['dandruff', 'flaky scalp', 'itchy scalp'],
            'hair growth' => ['hair growth', 'thicker hair', 'hair strength'],
            'immunity' => ['immune', 'immunity', 'vitamin c', 'defense'],
            'energy' => ['energy', 'fatigue', 'tired', 'vitality'],
            'menopause' => ['menopause', 'hot flash', 'hormonal'],
            'pregnancy' => ['pregnancy', 'prenatal', 'maternity'],
            'baby' => ['baby', 'infant', 'newborn', 'kids', 'child'],
        ];

        foreach ($keywordMap as $category => $keywords) {
            foreach ($keywords as $kw) {
                if (str_contains($lower, $kw)) {
                    $intentKeywords[] = $category;
                    break;
                }
            }
        }

        $intentKeywords = array_unique($intentKeywords);

        // Fetch products from database
        try {
            $query = Product::query()
                ->where('is_active', true)
                ->where('catalog_visibility', 'visible');

            // If we detected a specific intent, try to match category
            if (!empty($intentKeywords)) {
                $firstIntent = strtolower($intentKeywords[0]);
                if (in_array($firstIntent, ['acne', 'dry skin', 'oily skin', 'sensitive skin', 'anti-aging', 'dark spots', 'sun protection'])) {
                    $query->where('category_id', function($q) {
                        $q->select('id')->from('categories')->where('name', 'Skincare');
                    });
                } elseif (in_array($firstIntent, ['hair loss', 'dandruff', 'hair growth'])) {
                    $query->where('category_id', function($q) {
                        $q->select('id')->from('categories')->where('name', 'Hair & Body');
                    });
                } elseif (in_array($firstIntent, ['immunity', 'energy', 'menopause', 'pregnancy', 'baby'])) {
                    $query->where('category_id', function($q) {
                        $q->select('id')->from('categories')->whereIn('name', ['Supplements', 'Hair & Body']);
                    });
                }
            }

            $products = $query->limit(6)->get();

            if ($products->isNotEmpty()) {
                $intentText = !empty($intentKeywords) ? "based on your interest in " . implode(', ', $intentKeywords) : "";
                $recommendations = $products->map(function ($product) {
                    return "• {$product->name} - KSh " . number_format((float) $product->price, 2) . "\n  {$product->category->name} • {$product->stock_status}";
                })->implode("\n\n");

                $reasoning = !empty($intentKeywords) 
                    ? "I've selected these products " . $intentText . " from our catalogue.\n\n"
                    : "Here are some popular products from our catalogue:\n\n";

                return $reasoning . $recommendations . "\n\nVisit our product catalogue to see all items. Tell me more about your specific needs (skin type, hair concern, health goal, budget) and I'll give you more targeted recommendations!";
            }
        } catch (\Exception $e) {
            Log::warning('Could not fetch products for chatbot: ' . $e->getMessage());
        }

        return "I'd love to help you find the right products! To give you personalized recommendations, could you tell me:\n\n1. What are you looking to treat or improve? (acne, dry skin, hair loss, energy, immunity, etc.)\n2. Your skin type (oily, dry, combination, sensitive)\n3. Any preferences (natural, organic, fragrance-free, for kids)\n4. Your budget range\n\nOnce you share these details, I'll recommend specific products from our catalogue of 100+ items!";
    }

    private function getCategoryRecommendations(string $category, string $message, string $lower): string
    {
        $subIntents = [];
        if (preg_match('/\b(cleanser|wash|face wash)\b/', $lower)) $subIntents[] = 'cleansers';
        if (preg_match('/\b(moisturiser|moisturizer|cream|lotion)\b/', $lower)) $subIntents[] = 'moisturisers';
        if (preg_match('/\b(serum)\b/', $lower)) $subIntents[] = 'serums';
        if (preg_match('/\b(sunscreen|spf)\b/', $lower)) $subIntents[] = 'sunscreen';
        if (preg_match('/\b(shampoo)\b/', $lower)) $subIntents[] = 'shampoo & conditioner';
        if (preg_match('/\b(conditioner)\b/', $lower)) $subIntents[] = 'shampoo & conditioner';
        if (preg_match('/\b(vitamin|supplement|capsule|tablet)\b/', $lower)) $subIntents[] = 'vitamins & supplements';

        $subText = !empty($subIntents) ? " Focusing on: " . implode(', ', $subIntents) . "." : "";

        return "📂 {$category} Category:\n\nWe offer a range of {$category} products.{$subText}\n\nTell me more about your specific concern and I'll recommend the best products for you. For example: 'gentle moisturizer for kids' or 'serum for dark spots'.";
    }

    private function getReasonedFallback(string $message, string $lower): string
    {
        // Try to extract any product-related keywords even in fallback
        $productWords = ['cream', 'lotion', 'soap', 'oil', 'powder', 'spray', 'gel', 'balm', 'mask', 'scrub', 'toner'];
        $foundProducts = [];
        foreach ($productWords as $word) {
            if (str_contains($lower, $word)) {
                $foundProducts[] = $word;
            }
        }

        if (!empty($foundProducts)) {
            return "I see you're asking about " . implode(', ', $foundProducts) . ". Could you tell me more about what you'd like to use it for? For example: 'gentle soap for kids' or 'face cream for dry skin'. This helps me give you better recommendations from our catalogue.";
        }

        return "I'm Aya, your Afya360 assistant 🌿 I'm here to help you with:\n\n• Product recommendations for your skin, hair, or wellness needs\n• Delivery times and shipping areas\n• Returns and refunds policy\n• Payment options (Visa & WhatsApp)\n• Product categories and pricing\n• Order status and tracking\n\nWhat would you like to know? You can also browse our product catalogue to see all 100+ items.";
    }
}
