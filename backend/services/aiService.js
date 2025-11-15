import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Mapeamento de formatos de rosto
const faceShapeMapping = {
  'oval': 'oval',
  'square': 'quadrado',
  'round': 'redondo',
  'diamond': 'diamante',
  'triangle': 'triangular',
  'oblong': 'retangular',
  'rectangular': 'retangular'
};

// Banco de dados de estilos (mesmo do routes/styles.js)
const styleDatabase = {
  cabelo: {
    oval: [
      { name: "Corte Clássico", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Corte versátil que funciona perfeitamente com formato oval" },
      { name: "Undercut Moderno", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Estilo moderno que destaca as proporções do rosto oval" },
      { name: "Pompadour", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Corte elegante que complementa o formato oval" }
    ],
    quadrado: [
      { name: "Corte Texturizado", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Suaviza as linhas do rosto quadrado" },
      { name: "Fade Lateral", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Adiciona movimento e suavidade ao rosto quadrado" },
      { name: "Corte Desfiado", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Cria volume no topo, equilibrando o formato quadrado" }
    ],
    redondo: [
      { name: "Corte Alto", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Alonga visualmente o rosto redondo" },
      { name: "Fade com Topo Alto", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Cria altura e estrutura para o rosto redondo" },
      { name: "Side Part", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Adiciona definição e alongamento ao rosto redondo" }
    ],
    diamante: [
      { name: "Corte Balanceado", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Equilibra as proporções do rosto diamante" },
      { name: "Texturizado Médio", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Suaviza as linhas do formato diamante" },
      { name: "Corte Clássico", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Estilo versátil para formato diamante" }
    ],
    triangular: [
      { name: "Volume Superior", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Adiciona volume no topo para equilibrar o rosto triangular" },
      { name: "Corte Médio", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Balanceia as proporções do rosto triangular" },
      { name: "Texturizado", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Cria harmonia no formato triangular" }
    ],
    retangular: [
      { name: "Corte Curto Lateral", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Encurta visualmente o rosto retangular" },
      { name: "Fade Baixo", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Adiciona largura ao rosto retangular" },
      { name: "Corte Médio Texturizado", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Suaviza o comprimento do rosto retangular" }
    ]
  },
  barba: {
    oval: [
      { name: "Barba Completa", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Barba completa que complementa o formato oval" },
      { name: "Barba Média", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Estilo equilibrado para rosto oval" },
      { name: "Barba Rala", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Barba discreta que mantém as proporções do oval" }
    ],
    quadrado: [
      { name: "Barba Arredondada", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Suaviza as linhas do rosto quadrado" },
      { name: "Barba Curta", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Mantém a definição sem exagerar" },
      { name: "Barba Texturizada", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Adiciona suavidade ao formato quadrado" }
    ],
    redondo: [
      { name: "Barba Alongada", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Alonga visualmente o rosto redondo" },
      { name: "Barba em V", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Cria definição e alongamento" },
      { name: "Barba Média", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Equilibra as proporções do rosto redondo" }
    ],
    diamante: [
      { name: "Barba Completa", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Balanceia o formato diamante" },
      { name: "Barba Média", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Suaviza as linhas do formato diamante" },
      { name: "Barba Rala", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Mantém harmonia no formato diamante" }
    ],
    triangular: [
      { name: "Barba Completa", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Adiciona volume na parte inferior" },
      { name: "Barba Média", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Equilibra o formato triangular" },
      { name: "Barba Texturizada", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Cria harmonia no formato triangular" }
    ],
    retangular: [
      { name: "Barba Curta", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Encurta visualmente o rosto retangular" },
      { name: "Barba Arredondada", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Adiciona largura ao rosto retangular" },
      { name: "Barba Média", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Suaviza o comprimento do rosto retangular" }
    ]
  },
  ambos: {
    oval: [
      { name: "Combo Clássico", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Corte clássico + barba completa para rosto oval" },
      { name: "Combo Moderno", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Undercut + barba média para formato oval" },
      { name: "Combo Elegante", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Pompadour + barba rala para rosto oval" }
    ],
    quadrado: [
      { name: "Combo Texturizado", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Corte texturizado + barba arredondada" },
      { name: "Combo Fade", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Fade lateral + barba curta" },
      { name: "Combo Desfiado", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Corte desfiado + barba texturizada" }
    ],
    redondo: [
      { name: "Combo Alto", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Corte alto + barba alongada" },
      { name: "Combo Fade Alto", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Fade com topo alto + barba em V" },
      { name: "Combo Side Part", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Side part + barba média" }
    ],
    diamante: [
      { name: "Combo Balanceado", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", description: "Corte balanceado + barba completa" },
      { name: "Combo Texturizado", imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400", description: "Texturizado médio + barba média" },
      { name: "Combo Clássico", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400", description: "Corte clássico + barba rala" }
    ],
    triangular: [
      { name: "Combo Volume", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400", description: "Volume superior + barba completa" },
      { name: "Combo Médio", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400", description: "Corte médio + barba média" },
      { name: "Combo Texturizado", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", description: "Texturizado + barba texturizada" }
    ],
    retangular: [
      { name: "Combo Curto", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400", description: "Corte curto lateral + barba curta" },
      { name: "Combo Fade Baixo", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", description: "Fade baixo + barba arredondada" },
      { name: "Combo Médio", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400", description: "Corte médio texturizado + barba média" }
    ]
  }
};

export async function analyzeFaceAndRecommend(imagePath, styleType) {
  try {
    // Ler a imagem
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analisar formato do rosto usando OpenAI Vision
    const prompt = `Analise esta foto de rosto e identifique o formato do rosto. 
    Responda APENAS com uma das seguintes opções: oval, square, round, diamond, triangle, oblong, rectangular.
    Não inclua explicações, apenas o formato do rosto.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    });

    const detectedShape = response.choices[0].message.content.trim().toLowerCase();
    const faceShape = faceShapeMapping[detectedShape] || 'oval'; // Default para oval se não reconhecer

    // Obter recomendações baseadas no formato do rosto
    const styles = styleDatabase[styleType]?.[faceShape] || styleDatabase[styleType]?.oval || [];

    // Adicionar razão detalhada para cada estilo
    const stylesWithReason = styles.map((style, index) => ({
      ...style,
      reason: `${style.description}. Este estilo é especialmente recomendado para formato de rosto ${faceShape} porque ${getDetailedReason(faceShape, styleType, index)}`
    }));

    return {
      faceShape,
      styles: stylesWithReason
    };

  } catch (error) {
    console.error('Erro na análise de IA:', error);
    
    // Fallback: retornar recomendações padrão
    const defaultShape = 'oval';
    const styles = styleDatabase[styleType]?.[defaultShape] || [];
    
    return {
      faceShape: defaultShape,
      styles: styles.map((style, index) => ({
        ...style,
        reason: `${style.description}. Este estilo é especialmente recomendado para formato de rosto ${defaultShape}.`
      }))
    };
  }
}

function getDetailedReason(faceShape, styleType, index) {
  const reasons = {
    oval: {
      cabelo: [
        "realça as proporções equilibradas do rosto oval",
        "mantém a harmonia natural das linhas faciais",
        "complementa perfeitamente o formato simétrico"
      ],
      barba: [
        "mantém o equilíbrio natural do rosto oval",
        "adiciona definição sem alterar as proporções",
        "complementa a simetria do formato oval"
      ],
      ambos: [
        "cria um visual equilibrado e harmonioso",
        "destaca as proporções perfeitas do rosto oval",
        "mantém a simetria natural do formato"
      ]
    },
    quadrado: {
      cabelo: [
        "suaviza as linhas angulares do rosto quadrado",
        "adiciona movimento e reduz a rigidez",
        "cria volume que equilibra a estrutura quadrada"
      ],
      barba: [
        "arredonda as linhas duras do rosto quadrado",
        "adiciona suavidade às proporções",
        "equilibra a estrutura angular"
      ],
      ambos: [
        "suaviza completamente as linhas angulares",
        "cria harmonia entre cabelo e barba",
        "transforma a rigidez em elegância"
      ]
    },
    redondo: [
      "alonga visualmente o rosto redondo",
      "cria altura que compensa a largura",
      "adiciona definição e estrutura"
    ],
    diamante: [
      "equilibra as proporções do rosto diamante",
      "suaviza as linhas pontiagudas",
      "cria harmonia nas proporções"
    ],
    triangular: [
      "adiciona volume onde é necessário",
      "equilibra a base mais larga",
      "cria proporções mais harmoniosas"
    ],
    retangular: [
      "encurta visualmente o comprimento",
      "adiciona largura às laterais",
      "cria proporções mais equilibradas"
    ]
  };

  // Para formatos de rosto que não têm subcategorias por tipo
  if (faceShape === 'redondo' || faceShape === 'diamante' || faceShape === 'triangular' || faceShape === 'retangular') {
    const shapeReasons = reasons[faceShape];
    if (Array.isArray(shapeReasons)) {
      return shapeReasons[index] || "complementa o formato do rosto";
    }
  }

  // Para formatos com subcategorias (oval, quadrado)
  return reasons[faceShape]?.[styleType]?.[index] || "complementa o formato do rosto";
}

