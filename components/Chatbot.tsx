import React, { useState, useEffect, useRef } from 'react';
import { PRICING_DATA, galleryImages } from '../constants';
import { PricingOption } from '../types';

interface CalculationDetails {
    items: {
        option: PricingOption;
        quantity: number;
    }[];
    total: number;
}
interface ChatMessage {
    role: 'model' | 'user';
    text: string;
    pricing?: PricingOption[];
    gallery?: typeof galleryImages;
    calculation?: CalculationDetails;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);

const initialMessages: ChatMessage[] = [{ role: 'model', text: 'Olá! Sou o assistente virtual da AquaClean. Como posso ajudar?' }];

const ChatPricingCard: React.FC<{ option: PricingOption }> = ({ option }) => (
    <div className="flex items-center gap-4 p-3 bg-[#169d99]/20 rounded-lg mb-2 border border-[#169d99]/50">
        <div className="flex-shrink-0 text-[#b9cc01]">
            {React.cloneElement(option.icon as React.ReactElement<any>, { className: 'h-10 w-10' })}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-white">{option.vehicleType}</h4>
            <p className="text-2xl font-black text-white">
                <span className="text-lg text-[#b9cc01] align-top">R$</span>
                {option.price.toFixed(2).replace('.', ',')}
            </p>
        </div>
    </div>
);

const ChatGalleryImage: React.FC<{ src: string, alt: string }> = ({ src, alt }) => (
    <div className="aspect-square overflow-hidden rounded-md">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
);

const ChatCalculationCard: React.FC<{ calculation: CalculationDetails }> = ({ calculation }) => (
    <div className="p-3 bg-[#169d99]/20 rounded-lg mt-3 border border-[#169d99]/50">
        <h4 className="font-bold text-white mb-2">Resumo do Orçamento:</h4>
        {calculation.items.map(({ option, quantity }) => (
            <div key={option.vehicleType} className="flex justify-between items-center text-sm mb-1 text-white/90">
                <span>{quantity}x {option.vehicleType}</span>
                <span>R$ {(option.price * quantity).toFixed(2).replace('.', ',')}</span>
            </div>
        ))}
        <div className="mt-3 pt-2 border-t border-[#169d99]/50 flex justify-between items-center">
            <span className="font-bold text-white">Total:</span>
            <span className="text-2xl font-black text-white">
                <span className="text-lg text-[#b9cc01] align-top">R$</span>
                {calculation.total.toFixed(2).replace('.', ',')}
            </span>
        </div>
    </div>
);


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setMessages(initialMessages);
                setInputValue('');
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: trimmedInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const history = newMessages.slice(1, -1).map(msg => ({
                role: msg.role,
                text: msg.text,
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    message: trimmedInput,
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const geminiResponse = await response.json();

            const aiResponseMessage: ChatMessage = { role: 'model', text: geminiResponse.text || '' };

            if (geminiResponse.functionCalls && Array.isArray(geminiResponse.functionCalls)) {
                for (const fc of geminiResponse.functionCalls) {
                    if (fc.name === 'showPricing') {
                        const vehicleType = fc.args?.vehicleType as string | undefined;
                        if (vehicleType) {
                            aiResponseMessage.pricing = PRICING_DATA.filter(p => p.vehicleType === vehicleType);
                        } else {
                            aiResponseMessage.pricing = PRICING_DATA;
                        }
                    }
                    if (fc.name === 'showGallery') {
                        aiResponseMessage.gallery = galleryImages;
                    }
                    if (fc.name === 'calculatePrice') {
                        const args = fc.args as { passengerCars?: number; suvs?: number; pickups?: number; heavyVehicles?: number };
                        
                        const calculationDetails: CalculationDetails = {
                            items: [],
                            total: 0,
                        };

                        const priceMap: { [key: string]: PricingOption } = {
                            'Carros de Passeio': PRICING_DATA.find(p => p.vehicleType === 'Carros de Passeio')!,
                            'Caminhonetes': PRICING_DATA.find(p => p.vehicleType === 'Caminhonetes')!,
                            'Pick-Ups': PRICING_DATA.find(p => p.vehicleType === 'Pick-Ups')!,
                            'Veículos Pesados': PRICING_DATA.find(p => p.vehicleType === 'Veículos Pesados')!,
                        };

                        const vehicleTypes = {
                            passengerCars: 'Carros de Passeio',
                            suvs: 'Caminhonetes',
                            pickups: 'Pick-Ups',
                            heavyVehicles: 'Veículos Pesados',
                        } as const;

                        for (const [key, vehicleType] of Object.entries(vehicleTypes)) {
                            const quantity = args[key as keyof typeof args];
                            if (quantity && quantity > 0) {
                                const option = priceMap[vehicleType];
                                calculationDetails.items.push({ option, quantity });
                                calculationDetails.total += option.price * quantity;
                            }
                        }
                        
                        aiResponseMessage.calculation = calculationDetails;
                    }
                }
            }
            
            setMessages(prevMessages => [...prevMessages, aiResponseMessage]);

        } catch (error) {
            console.error("Erro ao se comunicar com a API do chat:", error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Não foi possível conectar ao assistente. Por favor, tente novamente mais tarde.';
            
            setMessages(prevMessages => [...prevMessages, { 
                role: 'model', 
                text: `Desculpe, ocorreu um erro. Tente novamente.\n\nDetalhes técnicos: ${errorMessage}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatMessageText = (text: string) => {
        const linkify = (inputText: string) => {
            const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;

            let linkedText = inputText.replace(urlPattern, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#00eaff] hover:underline">${url}</a>`;
            });
            
            linkedText = linkedText.replace(emailPattern, (email) => {
                if (linkedText.includes(`href="mailto:${email}"`)) return email;
                return `<a href="mailto:${email}" class="text-[#00eaff] hover:underline">${email}</a>`;
            });

            return linkedText;
        };
        
        const linkedText = linkify(text);
        return linkedText.replace(/\n/g, '<br />');
    };


    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir chat com assistente de IA"
                className={`group fixed bottom-28 right-8 z-50 flex items-center gap-3 transition-all duration-300 transform ${isOpen ? 'scale-0' : 'scale-100'}`}
            >
                 <span className="bg-[#169d99] text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-right">
                    Fale com a nossa IA
                </span>
                <img 
                    src="https://i.postimg.cc/j5bjQmg7/IA-ROBO.png" 
                    alt="Ícone do assistente de IA" 
                    className="w-20 h-20 transition-transform duration-300 group-hover:scale-110" 
                />
            </button>

            <div className={`fixed bottom-8 right-4 md:right-8 z-50 w-[calc(100vw-2rem)] md:w-full max-w-sm h-[70vh] max-h-[600px] bg-[#0a0a5c] rounded-2xl shadow-2xl border-2 border-[#169d99] flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-[#169d99]/50 bg-[#070743]/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/j5bjQmg7/IA-ROBO.png" alt="Logo do assistente IA" className="w-10 h-10" />
                        <h3 className="font-bold text-lg text-white">Assistente AquaClean</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Fechar chat" className="text-white hover:text-[#fae894]">
                        <CloseIcon />
                    </button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg px-4 py-2 shadow ${msg.role === 'user' ? 'bg-[#169d99] text-white rounded-br-none' : 'bg-[#070743] text-[#fae894] rounded-bl-none'}`}>
                                {msg.text && <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />}
                                {msg.pricing && (
                                    <div className="mt-3">
                                        {msg.pricing.map(p => <ChatPricingCard key={p.vehicleType} option={p} />)}
                                    </div>

                                )}
                                {msg.gallery && (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {msg.gallery.slice(0, 4).map((img, i) => <ChatGalleryImage key={i} src={img.src} alt={img.alt} />)}
                                    </div>
                                )}
                                {msg.calculation && (
                                    <ChatCalculationCard calculation={msg.calculation} />
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs rounded-lg px-4 py-2 bg-[#070743] text-[#fae894] rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-[#fae894] rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-[#fae894] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-[#fae894] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-[#169d99]/50">
                    <div className="flex items-center bg-[#070743] rounded-full border-2 border-transparent focus-within:border-[#b9cc01] transition-colors">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Digite sua dúvida..."
                            aria-label="Caixa de mensagem"
                            className="w-full bg-transparent text-white placeholder-[#fae894]/50 px-4 py-2 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button type="submit" aria-label="Enviar mensagem" className="p-3 text-white disabled:text-gray-500 hover:text-[#b9cc01] transition-colors" disabled={isLoading}>
                            <SendIcon />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Chatbot;