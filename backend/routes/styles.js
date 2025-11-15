import express from 'express';

const router = express.Router();

// Banco de dados de estilos de referência
const styleDatabase = {
  cabelo: {
    oval: [
      {
        name: "Corte Clássico",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Corte versátil que funciona perfeitamente com formato oval"
      },
      {
        name: "Undercut Moderno",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Estilo moderno que destaca as proporções do rosto oval"
      },
      {
        name: "Pompadour",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Corte elegante que complementa o formato oval"
      }
    ],
    quadrado: [
      {
        name: "Corte Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Suaviza as linhas do rosto quadrado"
      },
      {
        name: "Fade Lateral",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Adiciona movimento e suavidade ao rosto quadrado"
      },
      {
        name: "Corte Desfiado",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Cria volume no topo, equilibrando o formato quadrado"
      }
    ],
    redondo: [
      {
        name: "Corte Alto",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Alonga visualmente o rosto redondo"
      },
      {
        name: "Fade com Topo Alto",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Cria altura e estrutura para o rosto redondo"
      },
      {
        name: "Side Part",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Adiciona definição e alongamento ao rosto redondo"
      }
    ],
    diamante: [
      {
        name: "Corte Balanceado",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Equilibra as proporções do rosto diamante"
      },
      {
        name: "Texturizado Médio",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Suaviza as linhas do formato diamante"
      },
      {
        name: "Corte Clássico",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Estilo versátil para formato diamante"
      }
    ],
    triangular: [
      {
        name: "Volume Superior",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Adiciona volume no topo para equilibrar o rosto triangular"
      },
      {
        name: "Corte Médio",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Balanceia as proporções do rosto triangular"
      },
      {
        name: "Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Cria harmonia no formato triangular"
      }
    ],
    retangular: [
      {
        name: "Corte Curto Lateral",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Encurta visualmente o rosto retangular"
      },
      {
        name: "Fade Baixo",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Adiciona largura ao rosto retangular"
      },
      {
        name: "Corte Médio Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Suaviza o comprimento do rosto retangular"
      }
    ]
  },
  barba: {
    oval: [
      {
        name: "Barba Completa",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Barba completa que complementa o formato oval"
      },
      {
        name: "Barba Média",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Estilo equilibrado para rosto oval"
      },
      {
        name: "Barba Rala",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Barba discreta que mantém as proporções do oval"
      }
    ],
    quadrado: [
      {
        name: "Barba Arredondada",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Suaviza as linhas do rosto quadrado"
      },
      {
        name: "Barba Curta",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Mantém a definição sem exagerar"
      },
      {
        name: "Barba Texturizada",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Adiciona suavidade ao formato quadrado"
      }
    ],
    redondo: [
      {
        name: "Barba Alongada",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Alonga visualmente o rosto redondo"
      },
      {
        name: "Barba em V",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Cria definição e alongamento"
      },
      {
        name: "Barba Média",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Equilibra as proporções do rosto redondo"
      }
    ],
    diamante: [
      {
        name: "Barba Completa",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Balanceia o formato diamante"
      },
      {
        name: "Barba Média",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Suaviza as linhas do formato diamante"
      },
      {
        name: "Barba Rala",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Mantém harmonia no formato diamante"
      }
    ],
    triangular: [
      {
        name: "Barba Completa",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Adiciona volume na parte inferior"
      },
      {
        name: "Barba Média",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Equilibra o formato triangular"
      },
      {
        name: "Barba Texturizada",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Cria harmonia no formato triangular"
      }
    ],
    retangular: [
      {
        name: "Barba Curta",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Encurta visualmente o rosto retangular"
      },
      {
        name: "Barba Arredondada",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Adiciona largura ao rosto retangular"
      },
      {
        name: "Barba Média",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Suaviza o comprimento do rosto retangular"
      }
    ]
  },
  ambos: {
    oval: [
      {
        name: "Combo Clássico",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Corte clássico + barba completa para rosto oval"
      },
      {
        name: "Combo Moderno",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Undercut + barba média para formato oval"
      },
      {
        name: "Combo Elegante",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Pompadour + barba rala para rosto oval"
      }
    ],
    quadrado: [
      {
        name: "Combo Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Corte texturizado + barba arredondada"
      },
      {
        name: "Combo Fade",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Fade lateral + barba curta"
      },
      {
        name: "Combo Desfiado",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Corte desfiado + barba texturizada"
      }
    ],
    redondo: [
      {
        name: "Combo Alto",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Corte alto + barba alongada"
      },
      {
        name: "Combo Fade Alto",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Fade com topo alto + barba em V"
      },
      {
        name: "Combo Side Part",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Side part + barba média"
      }
    ],
    diamante: [
      {
        name: "Combo Balanceado",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description: "Corte balanceado + barba completa"
      },
      {
        name: "Combo Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
        description: "Texturizado médio + barba média"
      },
      {
        name: "Combo Clássico",
        imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        description: "Corte clássico + barba rala"
      }
    ],
    triangular: [
      {
        name: "Combo Volume",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
        description: "Volume superior + barba completa"
      },
      {
        name: "Combo Médio",
        imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        description: "Corte médio + barba média"
      },
      {
        name: "Combo Texturizado",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        description: "Texturizado + barba texturizada"
      }
    ],
    retangular: [
      {
        name: "Combo Curto",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        description: "Corte curto lateral + barba curta"
      },
      {
        name: "Combo Fade Baixo",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        description: "Fade baixo + barba arredondada"
      },
      {
        name: "Combo Médio",
        imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
        description: "Corte médio texturizado + barba média"
      }
    ]
  }
};

// Rota para obter estilos baseados no formato do rosto
router.get('/:faceShape/:styleType', (req, res) => {
  try {
    const { faceShape, styleType } = req.params;
    
    if (!styleDatabase[styleType] || !styleDatabase[styleType][faceShape]) {
      return res.status(404).json({ error: 'Estilos não encontrados para este formato de rosto' });
    }

    const styles = styleDatabase[styleType][faceShape];
    res.json({ success: true, styles });
  } catch (error) {
    console.error('Erro ao buscar estilos:', error);
    res.status(500).json({ error: 'Erro ao buscar estilos' });
  }
});

export default router;

