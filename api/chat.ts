import { GoogleGenAI, FunctionDeclaration, Type, Content } from '@google/genai';

// Configuração para a Vercel Edge Function
export const config = {
  runtime: 'edge',
};

// Tipos para a requisição
interface ChatRequest {
    history: { role: 'user' | 'model', text: string }[];
    message: string;
}

// A instrução do sistema e as declarações de função são movidas para o servidor
const SYSTEM_INSTRUCTION = `
Você é o assistente virtual da AquaClean Car Wash. Sua principal função é responder às perguntas dos clientes com base nas informações fornecidas. Seja sempre amigável, prestativo e conciso.

**INFORMAÇÕES DISPONÍVEIS:**

1.  **Contato:**
    *   **Telefone:** (62) 99161-9560
    *   **E-mail:** contato@aquaclean.com
    *   **Endereço:** Rua Fiel Carlos de Jesus, 1928 - Jardim Maravilha, São Paulo/SP

2.  **WhatsApp:**
    *   O link para o WhatsApp é: https://wa.me/5562991619560
    *   Quando um cliente perguntar sobre o WhatsApp, responda com uma mensagem amigável e **SEMPRE** inclua o link. Exemplo: "Claro! Para falar conosco no WhatsApp, basta clicar neste link: https://wa.me/5562991619560"

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

*   **showGallery()**: Use esta função SEMPRE que o cliente pedir para ver 'fotos', 'imagens', 'trabalhos anteriores', 'galeria' ou 'exemplos'. Você PODE e DEVE adicionar um texto introdutorio antes de chamar a função. Por exemplo: "Com certeza! Veja alguns exemplos do nosso trabalho:"

**REGRAS DE FUNCIONAMENTO:**

*   **Identificação de Veículo:** Sua principal tarefa é mapear modelos de veículos para as categorias de serviço corretas.
*   **Serviços Especiais (Orçamento):** Se o cliente perguntar sobre lavagem de tratores, empilhadeiras ou retroescavadeiras, você DEVE responder EXATAMENTE com a seguinte mensagem: "Prezado(a), ainda não oferecemos esse serviço, mas caso queira fazer um orçamento à parte e entrar em detalhes, favor nos chame via WhatsApp (https://wa.me/5562991619560), por e-mail (contato@aquaclean.com) ou ligue para (62) 99161-9560." Não utilize nenhuma função para esta resposta.
*   **Serviço em Domicílio:** Se o cliente perguntar se vocês fazem lavagem em domicílio ou no local (ex: "vocês vêm até aqui?", "lavam no meu endereço?"), responda EXATAMENTE com a seguinte mensagem: "Prezado(a) cliente, para lavagem de veículo até o local, favor mande a solicitação via WhatsApp (https://wa.me/5562991619560) e envie a localização, endereço, nº, bairro e município. A cotação é feita de acordo com a localização, considerando o deslocamento e o horário da lavagem. Será uma honra agendar um dia e horário em sua comodidade, pois enviaremos 02 profissionais até o local para executar o serviço. Estamos aqui para melhor lhe atender com profissionalismo, transparência e qualidade." Não utilize nenhuma função para esta resposta.
*   **Responda APENAS com as informações que você tem.** Se não souber a resposta, peça educadamente para o cliente entrar em contato por telefone ou WhatsApp.
*   Não invente informações.
`;

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

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { history, message } = (await req.json()) as ChatRequest;
    
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error('API_KEY environment variable not found on server.');
      return new Response(JSON.stringify({ error: 'Erro de configuração no servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedHistory: Content[] = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations }],
        },
        history: formattedHistory,
    });

    const result = await chat.sendMessage({ message });

    // Simplifica a resposta antes de enviá-la ao frontend
    const simplifiedResponse = {
        text: result.text,
        functionCalls: result.functionCalls,
    };

    return new Response(JSON.stringify(simplifiedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return new Response(JSON.stringify({ error: `A chamada para a API falhou: ${errorMessage}` }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
    });
  }
}