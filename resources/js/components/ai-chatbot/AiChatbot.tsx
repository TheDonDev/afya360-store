"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, X, Sparkles, Bot, Heart, Truck, ShieldCheck } from 'lucide-react';

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

interface AiChatbotProps {
    className?: string;
}

export default function AiChatbot({ className }: AiChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: "Hello! I'm your Afya360 AI assistant 🌿 How can I help you today? Ask me about products, skincare routines, delivery, or get personalized recommendations!",
            sender: 'bot',
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatPrice = useCallback((price: number) => `KSh ${price.toLocaleString('en-KE')}`, []);

    const sendMessage = useCallback(
        async (e?: React.FormEvent | Event) => {
            if (e) {
                e.preventDefault();
            }
            if (!input.trim() || isLoading) return;

            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                text: input,
                sender: 'user',
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await fetch('/api/ai-chatbot/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '',
                    },
                    body: JSON.stringify({
                        message: input,
                        session_id: sessionId,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString() + '1',
                            text:
                                data.response ||
                                'I apologize, I could not process your request. Please try again.',
                            sender: 'bot',
                            timestamp: data.timestamp || new Date().toISOString(),
                        },
                    ]);
                } else {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString() + '1',
                            text: "I'm having trouble connecting. Please try again or WhatsApp us at 0724151522.",
                            sender: 'bot',
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                }
            } catch (error) {
                console.error('Chatbot error:', error);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString() + '1',
                        text: "I'm having trouble connecting. Please try again or WhatsApp us at 0724151522.",
                        sender: 'bot',
                        timestamp: new Date().toISOString(),
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [input, isLoading, sessionId]
    );

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const quickQuestions = [
        'Skincare recommendations',
        'Hair care products',
        'Supplements for wellness',
        'Delivery information',
        'Returns policy',
        'Payment options',
    ];

    return (
        <div className={`${className} fixed bottom-6 right-6 z-50`}>
            {/* Floating toggle button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#244c3b] p-3 text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                    aria-label="Open AI assistant"
                >
                    <Bot size={24} strokeWidth={2} />
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c28d61] px-0">
                        <span className="text-[8px] font-bold text-white">AI</span>
                    </span>
                </button>
            )}

            {/* Chat widget */}
            {isOpen && (
                <div className="flex w-[420px] h-[560px] flex-col rounded-2xl bg-[#fffdf9] shadow-2xl border border-[#e3e0d8] overflow-hidden">
                    {/* Header */}
                    <div className="flex h-14 items-center justify-between bg-[#244c3b] px-5 text-white">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#c28d61]/20 flex items-center justify-center text-[#c28d61]">
                                <Bot size={18} strokeWidth={2} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold leading-none">Afya360 AI</h3>
                                <p className="text-xs text-[#c28d61]/80">Beauty & Wellness Assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1.5 hover:bg-white/20 transition"
                            aria-label="Close chat"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f5f4ee]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[85%] ${
                                    msg.sender === 'user'
                                        ? 'ml-auto text-right'
                                        : 'mr-auto text-left'
                                }`}
                            >
                                <div
                                    className={`inline-block rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                                        msg.sender === 'user'
                                            ? 'bg-[#244c3b] text-white'
                                            : 'bg-white text-[#242923] border border-[#e3e0d8]'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <p className="text-[10px] text-[#77786e] mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="ml-auto max-w-[85%]">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-white border border-[#e3e0d8] flex items-center justify-center text-[#244c3b]">
                                        <Bot size={16} strokeWidth={2} className="animate-spin" />
                                    </div>
                                    <div className="inline-block rounded-lg bg-white px-4 py-3 text-sm leading-relaxed border border-[#e3e0d8]">
                                        <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-[#e3e0d8] mr-1"></span>
                                        <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-[#e3e0d8] mr-1"></span>
                                        <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-[#e3e0d8]"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick questions */}
                    {!isLoading && (
                        <div className="p-4 bg-white border-t border-[#e3e0d8]">
                            <p className="text-[10px] font-medium text-[#9a7959] mb-3">Quick questions</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => {
                                            setInput(q);
                                            sendMessage();
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e3e0d8] bg-[#fffdf9] text-[10px] text-[#56594f] transition hover:bg-[#f7f5ef] hover:border-[#244c3b]"
                                    >
                                        <Sparkles size={12} strokeWidth={1.5} className="text-[#244c3b]" />
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 bg-white border-t border-[#e3e0d8]">
                        <div className="flex items-end gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 rounded-lg border border-[#dedbd2] bg-[#fffdf9] px-4 py-3 text-sm outline-none focus:border-[#244c3b] placeholder:text-[#9a9b92] disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="rounded-lg bg-[#244c3b] px-4 py-3 text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#183a2b]"
                            >
                                <Send size={18} strokeWidth={2} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
