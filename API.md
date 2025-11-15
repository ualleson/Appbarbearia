# 📡 Documentação da API

## Base URL
```
http://51.222.31.18/api
```

## Endpoints

### 1. Health Check
**GET** `/health`

Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok",
  "message": "API funcionando"
}
```

---

### 2. Upload e Análise Facial
**POST** `/upload`

Faz upload de uma foto e analisa o formato do rosto para recomendar estilos.

**Content-Type:** `multipart/form-data`

**Body:**
- `photo` (file): Imagem do rosto (JPG, JPEG ou PNG, máx. 10MB)
- `styleType` (string): Tipo de estilo desejado
  - `"cabelo"` - Apenas cabelo
  - `"barba"` - Apenas barba
  - `"ambos"` - Cabelo + Barba

**Response (200):**
```json
{
  "success": true,
  "originalImage": "/uploads/uuid-timestamp.jpg",
  "faceShape": "oval",
  "recommendations": [
    {
      "name": "Corte Clássico",
      "imageUrl": "https://images.unsplash.com/...",
      "description": "Corte versátil que funciona perfeitamente com formato oval",
      "reason": "Corte versátil que funciona perfeitamente com formato oval. Este estilo é especialmente recomendado para formato de rosto oval porque realça as proporções equilibradas do rosto oval"
    },
    {
      "name": "Undercut Moderno",
      "imageUrl": "https://images.unsplash.com/...",
      "description": "Estilo moderno que destaca as proporções do rosto oval",
      "reason": "..."
    },
    {
      "name": "Pompadour",
      "imageUrl": "https://images.unsplash.com/...",
      "description": "Corte elegante que complementa o formato oval",
      "reason": "..."
    }
  ]
}
```

**Erros:**
- `400` - Nenhuma imagem enviada
- `400` - Tipo de estilo inválido
- `500` - Erro ao processar imagem

---

### 3. Obter Estilos por Formato de Rosto
**GET** `/styles/:faceShape/:styleType`

Retorna estilos disponíveis para um formato de rosto específico.

**Parâmetros:**
- `faceShape` (string): Formato do rosto
  - `oval`, `quadrado`, `redondo`, `diamante`, `triangular`, `retangular`
- `styleType` (string): Tipo de estilo
  - `cabelo`, `barba`, `ambos`

**Exemplo:**
```
GET /api/styles/oval/cabelo
```

**Response (200):**
```json
{
  "success": true,
  "styles": [
    {
      "name": "Corte Clássico",
      "imageUrl": "https://images.unsplash.com/...",
      "description": "Corte versátil que funciona perfeitamente com formato oval"
    },
    ...
  ]
}
```

---

### 4. Listar Estilos Salvos
**GET** `/saved`

Retorna todos os estilos salvos pelo usuário.

**Response (200):**
```json
{
  "success": true,
  "styles": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "styleName": "Corte Clássico",
      "styleType": "cabelo",
      "imageUrl": "https://images.unsplash.com/...",
      "reason": "...",
      "faceShape": "oval",
      "originalImageUrl": "/uploads/...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    ...
  ]
}
```

---

### 5. Salvar Estilo Favorito
**POST** `/saved`

Salva um estilo como favorito.

**Body (JSON):**
```json
{
  "styleName": "Corte Clássico",
  "styleType": "cabelo",
  "imageUrl": "https://images.unsplash.com/...",
  "reason": "Este estilo é especialmente recomendado...",
  "faceShape": "oval",
  "originalImageUrl": "/uploads/uuid-timestamp.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "savedStyle": {
    "_id": "507f1f77bcf86cd799439011",
    "styleName": "Corte Clássico",
    ...
  }
}
```

**Erros:**
- `400` - Campos obrigatórios faltando

---

### 6. Deletar Estilo Salvo
**DELETE** `/saved/:id`

Remove um estilo salvo.

**Parâmetros:**
- `id` (string): ID do estilo salvo

**Response (200):**
```json
{
  "success": true,
  "message": "Estilo deletado com sucesso"
}
```

---

## Formatos de Rosto Suportados

- **Oval** ⚪ - Formato equilibrado e versátil
- **Quadrado** ⬜ - Linhas angulares e definidas
- **Redondo** ⭕ - Formato circular
- **Diamante** 💎 - Queixo pontiagudo, testa estreita
- **Triangular** 🔺 - Base mais larga que o topo
- **Retangular** ▭ - Formato alongado

---

## Códigos de Status HTTP

- `200` - Sucesso
- `400` - Requisição inválida
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## Limites

- Tamanho máximo de arquivo: **10MB**
- Formatos aceitos: **JPG, JPEG, PNG**
- Timeout de requisição: **30 segundos**

---

## Exemplo de Uso com cURL

```bash
# Upload e análise
curl -X POST http://51.222.31.18/api/upload \
  -F "photo=@foto.jpg" \
  -F "styleType=cabelo"

# Listar estilos salvos
curl http://51.222.31.18/api/saved

# Salvar estilo
curl -X POST http://51.222.31.18/api/saved \
  -H "Content-Type: application/json" \
  -d '{
    "styleName": "Corte Clássico",
    "styleType": "cabelo",
    "imageUrl": "https://...",
    "reason": "...",
    "faceShape": "oval",
    "originalImageUrl": "/uploads/..."
  }'
```

