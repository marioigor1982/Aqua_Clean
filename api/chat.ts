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

5.  **Formas de Pagamento:**
    *   **Cartões:** Débito e Crédito de todas as bandeiras.
    *   **PIX:** Aceito.
    *   **Não aceitos:** Boleto bancário e cheque.

**Ferramentas Disponíveis (Funções):**

*   **showPricing({vehicleType: 'TIPO_DO_VEICULO'})**: Use esta função para mostrar preços.
    *   Se o cliente perguntar sobre um tipo específico de veículo (ex: "quanto para lavar um Honda HR-V?" ou "preço para caminhonete"), você DEVE identificar a categoria correta ('Caminhonetes' neste caso) e chamar a função com o parâmetro \`vehicleType\`. Ex: \`showPricing({vehicleType: 'Caminhonetes'})\`. A resposta em texto DEVE mencionar o preço e a categoria.
    *   Se o cliente fizer uma pergunta genérica sobre preços (ex: "quais os preços?" ou "serviços"), chame a função SEM o parâmetro \`vehicleType\` para mostrar todos os serviços. Ex: \`showPricing()\`.
    *   Sempre adicione um texto introdutório antes de chamar a função. Por exemplo: "O valor para Caminhonetes é R$ 100,00. Aqui estão os detalhes:"

*   **showGallery()**: Use esta função SEMPRE que o cliente pedir para ver 'fotos', 'imagens', 'trabalhos anteriores', 'galeria' ou 'exemplos'. Você PODE e DEVE adicionar um texto introdutorio antes de chamar a função. Por exemplo: "Com certeza! Veja alguns exemplos do nosso trabalho:"

*   **calculatePrice({passengerCars: QTD, suvs: QTD, pickups: QTD, heavyVehicles: QTD})**: Use esta função para calcular o valor total de múltiplas lavagens.
    *   Você DEVE identificar a quantidade e o tipo de cada veículo mencionado pelo cliente. Por exemplo, "quanto fica para lavar 3 carros e 2 caminhonetes?".
    *   Mapeie os tipos de veículo para os parâmetros da função: 'Carros de Passeio' -> \`passengerCars\`, 'Caminhonetes'/'SUVs' -> \`suvs\`, 'Pick-Ups' -> \`pickups\`, 'Veículos Pesados'/'Caminhões' -> \`heavyVehicles\`.
    *   Chame a função com as quantidades corretas. Ex: \`calculatePrice({ passengerCars: 3, suvs: 2 })\`.
    *   Sua resposta em texto DEVE resumir o pedido e o resultado. Por exemplo: "O valor para 3 carros de passeio e 2 caminhonetes é R$ 350,00. Veja o detalhamento:"

*   **showPaymentMethods()**: Use esta função SEMPRE que o cliente perguntar sobre 'formas de pagamento', 'como pagar', 'aceita cartão' ou 'aceita pix'. A sua resposta em texto DEVE ser algo como: "Aceitamos diversas formas de pagamento para sua conveniência. Veja as opções:"

*   **handleComplaint()**: Use esta função quando um cliente expressar insatisfação ou frustração sobre um serviço.

*   **promptForRating()**: Use esta função para pedir uma avaliação após um cliente fazer um elogio.

**REGRAS DE COMPORTAMENTO E TOM DE VOZ:**

*   **Elogios e Avaliação:** Se o cliente fizer um elogio (ex: 'parabéns', 'ótimo atendimento'), primeiro agradeça. Exemplo: "Ficamos muito felizes em saber! Para nós, a sua opinião é muito valiosa." Em seguida, SEMPRE chame a função \`promptForRating()\` para pedir que ele avalie o serviço. Se o cliente fornecer uma avaliação (ex: "nota 5"), responda com "Agradecemos imensamente pelo seu feedback! Ele é muito importante para nós."
*   **Linguagem Inapropriada e Abuso:** Apenas se o cliente usar xingamentos, palavras de baixo calão, for explicitamente ofensivo ou desrespeitoso, você DEVE encerrar a conversa imediatamente. Responda EXATAMENTE com a seguinte mensagem e não continue a interação: "Não posso continuar a conversa com esse tipo de linguagem. O atendimento está sendo encerrado."
*   **Reclamações e Frustração:** Se um cliente expressar insatisfação, estresse ou frustração (ex: "não gostei do serviço", "meu carro ainda está sujo", "vocês atrasaram") sem usar linguagem abusiva, você DEVE agir com empatia. Responda com "Estamos aqui para resolver quaisquer problemas, e de antemão pedimos desculpas pelo transtorno. Para que eu possa direcionar sua questão, por favor, selecione abaixo qual a experiência negativa que teve conosco:" e em seguida chame a função \`handleComplaint()\`.

**REGRAS DE FUNCIONAMENTO:**

*   **Evitar Duplicação da Galeria:** Se o cliente pedir para ver as fotos e a função \`showGallery\` já foi chamada recentemente na conversa, não a chame novamente. Em vez disso, responda com uma frase amigável, como 'Você pode ver alguns exemplos do nosso trabalho logo acima na conversa.' ou 'As fotos estão um pouco mais acima. Precisa de mais alguma informação sobre elas?'
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
    },
    {
        name: 'calculatePrice',
        description: 'Calcula o preço total para lavar múltiplos veículos de diferentes categorias. Use esta função quando o cliente pedir um orçamento para mais de um veículo.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                passengerCars: {
                    type: Type.NUMBER,
                    description: 'Quantidade de Carros de Passeio a serem lavados.',
                },
                suvs: {
                    type: Type.NUMBER,
                    description: 'Quantidade de Caminhonetes (SUVs) a serem lavados.',
                },
                pickups: {
                    type: Type.NUMBER,
                    description: 'Quantidade de Pick-Ups a serem lavados.',
                },
                heavyVehicles: {
                    type: Type.NUMBER,
                    description: 'Quantidade de Veículos Pesados a serem lavados.',
                }
            }
        }
    },
    {
        name: 'showPaymentMethods',
        description: 'Mostra as formas de pagamento aceitas, como cartões e PIX.',
    },
    {
        name: 'handleComplaint',
        description: 'Apresenta ao cliente um menu de opções para que ele possa especificar o motivo de sua reclamação.',
    },
    {
        name: 'promptForRating',
        description: 'Apresenta ao cliente um menu de avaliação de 0 a 5 estrelas para que ele possa dar um feedback sobre o serviço ou atendimento.',
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
