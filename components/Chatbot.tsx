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
    promptForScheduling?: boolean;
    whatsAppLink?: string;
    paymentInfo?: boolean;
    promptForEndChat?: boolean;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
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

const ChatGalleryImage: React.FC<{ src: string, alt: string, onClick: () => void }> = ({ src, alt, onClick }) => (
    <div className="aspect-square overflow-hidden rounded-md cursor-pointer group" onClick={onClick}>
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
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

const ChatPaymentInfoCard: React.FC = () => (
    <div className="p-3 bg-[#169d99]/20 rounded-lg mt-3 border border-[#169d99]/50 space-y-3">
        <div>
            <p className="text-white font-semibold">Aceitamos cartões de débito e crédito de todas as bandeiras:</p>
            <img src="https://i.postimg.cc/y88bJQjd/e15d406ed2e0898720bc435a5257550f.jpg" alt="Bandeiras de cartão aceitas" className="mt-2 rounded-md w-full" />
        </div>
        <div>
            <p className="text-white font-semibold">Aceitamos PIX:</p>
            <img src="https://i.postimg.cc/PJdMgJVR/pix-bc-logo-0.png" alt="Logo PIX" className="mt-2 rounded-md bg-white p-2 w-24" />
        </div>
        <div className="pt-2 border-t border-[#169d99]/50">
            <p className="text-xs text-white/80"><span className="font-bold">Obs.:</span> Não geramos boleto bancário e não aceitamos cheque.</p>
        </div>
    </div>
);


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState<'idle' | 'awaiting_name' | 'awaiting_end_confirmation'>('idle');
    const [lastCalculation, setLastCalculation] = useState<CalculationDetails | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
                setConversationState('idle');
                setLastCalculation(null);
                setSelectedImage(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleConfirmScheduling = () => {
        setMessages(prev => prev.map((msg, index) => {
            if (index === prev.length - 1) {
                return { ...msg, promptForScheduling: false };
            }
            return msg;
        }));

        const nextMessage: ChatMessage = {
            role: 'model',
            text: 'Ótimo! Para continuarmos, qual o seu nome?'
        };
        setMessages(prev => [...prev, nextMessage]);
        setConversationState('awaiting_name');
    };

    const handleDenyScheduling = () => {
        setMessages(prev => prev.map((msg, index) => {
            if (index === prev.length - 1) {
                return { ...msg, promptForScheduling: false };
            }
            return msg;
        }));

        const nextMessage: ChatMessage = {
            role: 'model',
            text: 'Ok então, precisando de mais informações estarei por aqui para ajudar! Caso tenha mais alguma dúvida, você pode nos chamar no WhatsApp: https://wa.me/5562991619560 ou ligar para (62) 99161-9560.\n\nDeseja encerrar o atendimento?',
            promptForEndChat: true,
        };
        setMessages(prev => [...prev, nextMessage]);
        setConversationState('awaiting_end_confirmation');
        setLastCalculation(null);
    };

    const handleConfirmEndChat = () => {
        setIsOpen(false);
    };

    const handleDenyEndChat = () => {
        setMessages(prev => prev.map((msg, index) => {
            if (index === prev.length - 1) {
                return { ...msg, promptForEndChat: false };
            }
            return msg;
        }));

        const nextMessage: ChatMessage = {
            role: 'model',
            text: 'Ok, sem problemas. Como mais posso ajudar?'
        };
        setMessages(prev => [...prev, nextMessage]);
        setConversationState('idle');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        if (conversationState === 'awaiting_name') {
            setIsLoading(true);
            const clientName = trimmedInput;
            
            setTimeout(() => {
                if (lastCalculation) {
                    const itemsText = lastCalculation.items.map(item => `${item.quantity}x ${item.option.vehicleType}`).join(' e ');
                    const totalText = `R$ ${lastCalculation.total.toFixed(2).replace('.', ',')}`;
                    
                    const whatsAppMessage = `Olá, meu nome é ${clientName}. Gostaria de agendar a lavagem para: ${itemsText}. O orçamento total foi de ${totalText}. Vocês têm disponibilidade?`;
                    const whatsAppUrl = `https://wa.me/5562991619560?text=${encodeURIComponent(whatsAppMessage)}`;

                    const confirmationMessage: ChatMessage = {
                        role: 'model',
                        text: `Obrigado, ${clientName}! Sua solicitação de agendamento está pronta. Clique no botão abaixo para enviá-la pelo WhatsApp e finalizar.`,
                        whatsAppLink: whatsAppUrl
                    };
                    setMessages(prev => [...prev, confirmationMessage]);
                }
                setConversationState('idle');
                setLastCalculation(null);
                setIsLoading(false);
            }, 1000); // Simulate thinking
            return;
        }

        setIsLoading(true);

        try {
            const history = messages.slice(1, -1).map(msg => ({
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
                        const pricingOptions = vehicleType ? PRICING_DATA.filter(p => p.vehicleType === vehicleType) : PRICING_DATA;
                        aiResponseMessage.pricing = pricingOptions;

                        if (vehicleType && pricingOptions.length > 0) {
                            const option = pricingOptions[0];
                            const calculationDetails: CalculationDetails = {
                                items: [{ option, quantity: 1 }],
                                total: option.price
                            };
                            aiResponseMessage.promptForScheduling = true;
                            setLastCalculation(calculationDetails);
                        }
                    }
                    if (fc.name === 'showGallery') {
                        aiResponseMessage.gallery = galleryImages;
                    }
                    if (fc.name === 'calculatePrice') {
                        const args = fc.args as { passengerCars?: number; suvs?: number; pickups?: number; heavyVehicles?: number };
                        const calculationDetails: CalculationDetails = { items: [], total: 0 };
                        const priceMap = PRICING_DATA.reduce((acc, p) => ({ ...acc, [p.vehicleType]: p }), {} as { [key: string]: PricingOption });
                        const vehicleTypes = { passengerCars: 'Carros de Passeio', suvs: 'Caminhonetes', pickups: 'Pick-Ups', heavyVehicles: 'Veículos Pesados' } as const;

                        for (const [key, vehicleType] of Object.entries(vehicleTypes)) {
                            const quantity = args[key as keyof typeof args];
                            if (quantity && quantity > 0) {
                                const option = priceMap[vehicleType];
                                calculationDetails.items.push({ option, quantity });
                                calculationDetails.total += option.price * quantity;
                            }
                        }
                        
                        aiResponseMessage.calculation = calculationDetails;
                        aiResponseMessage.promptForScheduling = true;
                        setLastCalculation(calculationDetails);
                    }
                    if (fc.name === 'showPaymentMethods') {
                        aiResponseMessage.paymentInfo = true;
                    }
                }
            }
            
            setMessages(prevMessages => [...prevMessages, aiResponseMessage]);

        } catch (error) {
            console.error("Erro ao se comunicar com a API do chat:", error);
            const errorMessage = error instanceof Error ? error.message : 'Não foi possível conectar ao assistente.';
            setMessages(prevMessages => [...prevMessages, { role: 'model', text: `Desculpe, ocorreu um erro. Tente novamente.` }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatMessageText = (text: string) => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        let linkedText = text.replace(urlPattern, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#00eaff] hover:underline">${url}</a>`);
        linkedText = linkedText.replace(emailPattern, email => `<a href="mailto:${email}" class="text-[#00eaff] hover:underline">${email}</a>`);
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
                <img src="https://i.postimg.cc/j5bjQmg7/IA-ROBO.png" alt="Ícone do assistente de IA" className="w-20 h-20 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <div className={`fixed bottom-8 right-4 md:right-8 z-50 w-[calc(100vw-2rem)] md:w-full max-w-sm h-[70vh] max-h-[600px] bg-[#0a0a5c] rounded-2xl shadow-2xl border-2 border-[#169d99] flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 border-b border-[#169d99]/50 bg-[#070743]/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/j5bjQmg7/IA-ROBO.png" alt="Logo do assistente IA" className="w-10 h-10" />
                        <h3 className="font-bold text-lg text-white">Assistente AquaClean</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} aria-label="Fechar chat" className="text-white hover:text-[#fae894]"><CloseIcon /></button>
                </header>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => {
                        if (msg.role === 'user') {
                            return (
                                <div key={index} className="flex justify-end">
                                    <div className="max-w-[85%] rounded-lg px-4 py-2 shadow bg-[#169d99] text-white rounded-br-none">
                                        {msg.text && <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />}
                                    </div>
                                </div>
                            );
                        }
                        // AI Model's message
                        return (
                             <div key={index} className="flex items-end gap-2 justify-start">
                                <img src="https://i.postimg.cc/hQ0F6V6N/AQUACLEAN-LOGO.png" alt="AquaClean Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
                                <div className="max-w-[85%] rounded-lg px-4 py-2 shadow bg-[#070743] text-[#fae894] rounded-bl-none">
                                    {msg.text && <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />}
                                    {msg.pricing && <div className="mt-3">{msg.pricing.map(p => <ChatPricingCard key={p.vehicleType} option={p} />)}</div>}
                                    {msg.gallery && (
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {msg.gallery.map((img, i) => (
                                                <ChatGalleryImage 
                                                    key={i} 
                                                    src={img.src} 
                                                    alt={img.alt} 
                                                    onClick={() => setSelectedImage(img.src)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {msg.calculation && <ChatCalculationCard calculation={msg.calculation} />}
                                    {msg.paymentInfo && <ChatPaymentInfoCard />}
                                    {msg.promptForScheduling && (
                                        <div className="mt-3 pt-3 border-t border-[#169d99]/50">
                                            <p className="text-sm text-white/90 mb-2">Deseja prosseguir com o agendamento?</p>
                                            <div className="flex gap-2">
                                                <button onClick={handleConfirmScheduling} className="text-sm bg-[#b9cc01] text-[#070743] font-bold py-1 px-4 rounded-full hover:bg-opacity-80 transition-all">Sim</button>
                                                <button onClick={handleDenyScheduling} className="text-sm bg-[#fae894]/50 text-white font-bold py-1 px-4 rounded-full hover:bg-opacity-80 transition-all">Não</button>
                                            </div>
                                        </div>
                                    )}
                                     {msg.promptForEndChat && (
                                        <div className="mt-3 pt-3 border-t border-[#169d99]/50">
                                            <div className="flex gap-2">
                                                <button onClick={handleConfirmEndChat} className="text-sm bg-[#b9cc01] text-[#070743] font-bold py-1 px-4 rounded-full hover:bg-opacity-80 transition-all">Sim</button>
                                                <button onClick={handleDenyEndChat} className="text-sm bg-[#fae894]/50 text-white font-bold py-1 px-4 rounded-full hover:bg-opacity-80 transition-all">Não</button>
                                            </div>
                                        </div>
                                    )}
                                    {msg.whatsAppLink && (
                                        <div className="mt-3">
                                            <a href={msg.whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-all w-full">
                                                <WhatsAppIcon />
                                                Confirmar Agendamento
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <img src="https://i.postimg.cc/hQ0F6V6N/AQUACLEAN-LOGO.png" alt="AquaClean Logo" className="w-8 h-8 rounded-full flex-shrink-0" />
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
                            placeholder={
                                conversationState === 'awaiting_name' ? 'Digite seu nome...' :
                                conversationState === 'awaiting_end_confirmation' ? 'Responda acima...' :
                                'Digite sua dúvida...'
                            }
                            aria-label="Caixa de mensagem"
                            className="w-full bg-transparent text-white placeholder-[#fae894]/50 px-4 py-2 focus:outline-none"
                            disabled={isLoading || conversationState === 'awaiting_end_confirmation'}
                        />
                        <button type="submit" aria-label="Enviar mensagem" className="p-3 text-white disabled:text-gray-500 hover:text-[#b9cc01] transition-colors" disabled={isLoading}>
                            <SendIcon />
                        </button>
                    </div>
                </form>
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Imagem ampliada" className="rounded-lg object-contain max-w-full max-h-[90vh]" />
                        <button 
                            onClick={() => setSelectedImage(null)} 
                            className="absolute -top-3 -right-3 bg-white text-black rounded-full h-8 w-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            aria-label="Fechar imagem"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;