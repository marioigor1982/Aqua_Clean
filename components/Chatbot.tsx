import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from '@google/genai';
import { PRICING_DATA, galleryImages } from '../constants';
import { PricingOption } from '../types';

interface ChatMessage {
    role: 'model' | 'user';
    text: string;
    pricing?: PricingOption[];
    gallery?: typeof galleryImages;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual da AquaClean Car Wash. Sua principal função é responder às perguntas dos clientes com base nas informações fornecidas. Seja sempre amigável, prestativo e conciso.

**INFORMAÇÕES DISPONÍVEIS:**

1.  **Contato:**
    *   **Telefone:** (11) 99999-9999
    *   **E-mail:** contato@aquaclean.com
    *   **Endereço:** Rua Fictícia, 123, Bairro Imaginário, Cidade Exemplo - SP

2.  **WhatsApp:**
    *   O link para o WhatsApp é: https://wa.me/5511999999999
    *   Quando um cliente perguntar sobre o WhatsApp, responda com uma mensagem amigável e **SEMPRE** inclua o link. Exemplo: "Claro! Para falar conosco no WhatsApp, basta clicar neste link: https://wa.me/5511999999999"

3.  **Serviços e Preços (Categorias):**
    *   **Carros de Passeio:** R$ 50,00 (Limpeza completa para carros como sedans, hatches, etc. Ex: Fiat Uno, Honda Civic, Toyota Corolla).
    *   **Caminhonetes (SUVs):** R$ 100,00 (Cuidado especial para SUVs. Ex: Honda HR-V, Jeep Renegade, Hyundai Creta).
    *   **Pick-Ups:** R$ 150,00 (Tratamento robusto para pick-ups, incluindo caçamba. Ex: Toyota Hilux, Ford Ranger, Chevrolet S10).
    *   **Veículos Pesados:** R$ 250,00 (Lavagem de alta pressão para caminhões. Ex: Scania R540, Volvo FH).

4.  **Horário de funcionamento:**
    *   Segunda a Sexta: 08:30 às 18:30
    *   Sábado: 09:00 às 14:00
    *   Domingo e feriados: Fechado

**Ferramentas Disponíveis (Funções):**

*   **showPricing({vehicleType: 'TIPO_DO_VEICULO'})**: Use esta função para mostrar preços.
    *   Se o cliente perguntar sobre um tipo específico de veículo (ex: "quanto para lavar um Honda HR-V?" ou "preço para caminhonete"), você DEVE identificar a categoria correta ('Caminhonetes' neste caso) e chamar a função com o parâmetro \`vehicleType\`. Ex: \`showPricing({vehicleType: 'Caminhonetes'})\`. A resposta em texto DEVE mencionar o preço e a categoria.
    *   Se o cliente fizer uma pergunta genérica sobre preços (ex: "quais os preços?" ou "serviços"), chame a função SEM o parâmetro \`vehicleType\` para mostrar todos os serviços. Ex: \`showPricing()\`.
    *   Sempre adicione um texto introdutório antes de chamar a função. Por exemplo: "O valor para Caminhonetes é R$ 100,00. Aqui estão os detalhes:"

*   **showGallery()**: Use esta função SEMPRE que o cliente pedir para ver 'fotos', 'imagens', 'trabalhos anteriores', 'galeria' ou 'exemplos'. Você PODE e DEVE adicionar um texto introdutório antes de chamar a função. Por exemplo: "Com certeza! Veja alguns exemplos do nosso trabalho:"

**REGRAS DE FUNCIONAMENTO:**

*   **Identificação de Veículo:** Sua principal tarefa é mapear modelos de veículos para as categorias de serviço corretas.
*   **Serviços Especiais (Orçamento):** Se o cliente perguntar sobre lavagem de tratores, empilhadeiras ou retroescavadeiras, você DEVE responder EXATAMENTE com a seguinte mensagem: "Prezado(a), ainda não oferecemos esse serviço, mas caso queira fazer um orçamento à parte e entrar em detalhes, favor nos chame via WhatsApp (https://wa.me/5511999999999), por e-mail (contato@aquaclean.com) ou ligue para (11) 99999-9999." Não utilize nenhuma função para esta resposta.
*   **Serviço em Domicílio:** Se o cliente perguntar se vocês fazem lavagem em domicílio ou no local (ex: "vocês vêm até aqui?", "lavam no meu endereço?"), responda EXATAMENTE com a seguinte mensagem: "Prezado(a) cliente, para lavagem de veículo até o local, favor mande a solicitação via WhatsApp (https://wa.me/5511999999999) e envie a localização, endereço, nº, bairro e município. A cotação é feita de acordo com a localização, considerando o deslocamento e o horário da lavagem. Será uma honra agendar um dia e horário em sua comodidade, pois enviaremos 02 profissionais até o local para executar o serviço. Estamos aqui para melhor lhe atender com profissionalismo, transparência e qualidade." Não utilize nenhuma função para esta resposta.
*   **Responda APENAS com as informações que você tem.** Se não souber a resposta, peça educadamente para o cliente entrar em contato por telefone ou WhatsApp.
*   Não invente informações.
`;

const initialMessages: ChatMessage[] = [{ role: 'model', text: 'Olá! Sou o assistente virtual da AquaClean. Como posso ajudar?' }];

const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'showPricing',
        description: 'Mostra os serviços e preços de lavagem. Pode filtrar por um tipo de veículo específico.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                vehicleType: {
                    type: Type.STRING,
                    description: 'O tipo de veículo para mostrar o preço. Se omitido, todos os preços serão mostrados.',
                    enum: ['Carros de Passeio', 'Caminhonetes', 'Pick-Ups', 'Veículos Pesados']
                }
            }
        }
    },
    {
        name: 'showGallery',
        description: 'Mostra a galeria de fotos com exemplos de antes e depois dos serviços de lavagem.',
    }
];

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


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: [{ functionDeclarations }],
                },
            });
        } else {
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
        if (!trimmedInput || isLoading || !chatRef.current) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: trimmedInput }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            
            const aiResponseMessage: ChatMessage = { role: 'model', text: response.text };

            if (response.functionCalls) {
                for (const fc of response.functionCalls) {
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
                }
            }
            
            setMessages([...newMessages, aiResponseMessage]);

        } catch (error) {
            console.error("Error communicating with Gemini API:", error);
            setMessages([...newMessages, { role: 'model', text: 'Desculpe, estou com problemas para me conectar. Tente novamente mais tarde ou entre em contato pelo nosso WhatsApp.' }]);
        } finally {
            setIsLoading(false);
        }
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
                                {msg.text && <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />}
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
