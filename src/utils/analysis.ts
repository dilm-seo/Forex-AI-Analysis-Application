import type { NewsItem, Analysis } from '../types';

const SYSTEM_PROMPT = `Vous êtes un analyste forex professionnel. Analysez les nouvelles suivantes et fournissez une réponse JSON avec la structure suivante (pas de markdown, pas de blocs de code, uniquement du JSON pur) :

{
  "currencies": [
    {
      "currency": "USD",
      "strength": 75,
      "trend": "up",
      "factors": [
        "Données économiques solides",
        "Position hawkish de la Fed"
      ]
    }
  ],
  "opportunities": [
    {
      "pair": "EUR/USD",
      "type": "buy",
      "timeframe": "court",
      "strength": 85,
      "reasoning": [
        "Cassure technique au-dessus de la résistance",
        "Momentum économique positif"
      ],
      "risk": "modéré",
      "stopLoss": 1.0750,
      "target": 1.0850
    }
  ],
  "correlations": [
    {
      "pair": "EUR/USD",
      "correlation": 0.85,
      "explanation": "Forte corrélation négative due à...",
      "factors": [
        "Divergence des politiques BCE-Fed",
        "Impact du sentiment de risque"
      ]
    }
  ],
  "marketSentiment": {
    "overall": "risk-on",
    "confidence": 75,
    "drivers": [
      "Croissance mondiale forte",
      "Réduction des tensions géopolitiques"
    ]
  }
}

Instructions importantes:
1. Les valeurs de 'type' doivent être uniquement 'buy' ou 'sell'
2. Les valeurs de 'timeframe' doivent être 'court', 'moyen' ou 'long'
3. Les valeurs de 'risk' doivent être 'faible', 'modéré' ou 'élevé'
4. Les valeurs de 'strength' doivent être entre 0 et 100
5. Les valeurs de 'stopLoss' et 'target' doivent être des nombres avec 4 décimales maximum
6. Les valeurs de 'correlation' doivent être entre -1 et 1
7. Le sentiment global doit être 'risk-on', 'risk-off' ou 'neutral'

Retournez UNIQUEMENT l'objet JSON, sans formatage markdown ni blocs de code.`;

function validateNumber(value: number, min: number, max: number, fieldName: string): void {
  if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
    throw new Error(`La valeur ${fieldName} doit être un nombre entre ${min} et ${max}`);
  }
}

function validateAnalysisResponse(data: unknown): asserts data is Analysis {
  if (!data || typeof data !== 'object') {
    throw new Error('La réponse doit être un objet JSON valide');
  }

  const response = data as Partial<Analysis>;
  
  // Validate required arrays
  if (!Array.isArray(response.currencies)) {
    throw new Error('Les données de devises sont manquantes ou invalides');
  }
  if (!Array.isArray(response.opportunities)) {
    throw new Error('Les opportunités de trading sont manquantes ou invalides');
  }
  if (!Array.isArray(response.correlations)) {
    throw new Error('Les corrélations sont manquantes ou invalides');
  }
  if (!response.marketSentiment) {
    throw new Error('Le sentiment de marché est manquant ou invalide');
  }

  // Validate currencies
  response.currencies.forEach((currency, index) => {
    try {
      if (!currency.currency || typeof currency.currency !== 'string') {
        throw new Error('Code devise invalide');
      }
      validateNumber(currency.strength, 0, 100, 'force');
      if (!['up', 'down', 'neutral'].includes(currency.trend)) {
        throw new Error('Tendance invalide');
      }
      if (!Array.isArray(currency.factors) || currency.factors.length === 0) {
        throw new Error('Facteurs manquants');
      }
    } catch (error) {
      throw new Error(`Devise invalide à l'index ${index}: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    }
  });

  // Validate opportunities
  response.opportunities.forEach((opp, index) => {
    try {
      if (!opp.pair || typeof opp.pair !== 'string') {
        throw new Error('Paire de devises invalide');
      }
      if (!['buy', 'sell'].includes(opp.type)) {
        throw new Error(`Type invalide: ${opp.type}`);
      }
      if (!['court', 'moyen', 'long'].includes(opp.timeframe)) {
        throw new Error(`Timeframe invalide: ${opp.timeframe}`);
      }
      validateNumber(opp.strength, 0, 100, 'force du signal');
      if (!Array.isArray(opp.reasoning) || opp.reasoning.length === 0) {
        throw new Error('Raisonnement manquant');
      }
      if (!['faible', 'modéré', 'élevé'].includes(opp.risk)) {
        throw new Error(`Niveau de risque invalide: ${opp.risk}`);
      }
      if (typeof opp.stopLoss !== 'number' || isNaN(opp.stopLoss)) {
        throw new Error('Stop loss invalide');
      }
      if (typeof opp.target !== 'number' || isNaN(opp.target)) {
        throw new Error('Target invalide');
      }
    } catch (error) {
      throw new Error(`Opportunité invalide à l'index ${index}: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    }
  });

  // Validate correlations
  response.correlations.forEach((corr, index) => {
    try {
      if (!corr.pair || typeof corr.pair !== 'string') {
        throw new Error('Paire de devises invalide');
      }
      validateNumber(corr.correlation, -1, 1, 'corrélation');
      if (!corr.explanation || typeof corr.explanation !== 'string') {
        throw new Error('Explication manquante');
      }
      if (!Array.isArray(corr.factors) || corr.factors.length === 0) {
        throw new Error('Facteurs manquants');
      }
    } catch (error) {
      throw new Error(`Corrélation invalide à l'index ${index}: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    }
  });

  // Validate market sentiment
  try {
    if (!['risk-on', 'risk-off', 'neutral'].includes(response.marketSentiment.overall)) {
      throw new Error(`Sentiment global invalide: ${response.marketSentiment.overall}`);
    }
    validateNumber(response.marketSentiment.confidence, 0, 100, 'confiance');
    if (!Array.isArray(response.marketSentiment.drivers) || response.marketSentiment.drivers.length === 0) {
      throw new Error('Facteurs de sentiment manquants');
    }
  } catch (error) {
    throw new Error(`Sentiment de marché invalide: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
  }
}

function cleanJsonResponse(content: string): string {
  // Remove any potential markdown code block indicators
  content = content.replace(/```json\s*/g, '');
  content = content.replace(/```\s*$/g, '');
  
  // Remove any leading/trailing whitespace
  content = content.trim();
  
  // Ensure we have a valid JSON object
  if (!content.startsWith('{') || !content.endsWith('}')) {
    throw new Error('La réponse ne contient pas un objet JSON valide');
  }
  
  return content;
}

export async function analyzeMarketData(
  news: NewsItem[],
  apiKey: string,
  onProgress: (value: number, message: string) => void
): Promise<Analysis> {
  try {
    onProgress(10, 'Préparation des données...');

    const newsContent = news.map(item => ({
      title: item.title,
      content: item.description,
      date: item.pubDate
    }));

    onProgress(30, 'Analyse du marché en cours...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(newsContent) }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    onProgress(60, 'Traitement de la réponse...');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur lors de l\'analyse');
    }

    const data = await response.json();
    const cleanContent = cleanJsonResponse(data.choices[0].message.content);
    
    try {
      const result = JSON.parse(cleanContent);
      onProgress(80, 'Validation des données...');
      validateAnalysisResponse(result);
      onProgress(100, 'Analyse terminée');
      return result;
    } catch (parseError) {
      throw new Error('Impossible de parser la réponse JSON: ' + 
        (parseError instanceof Error ? parseError.message : 'Format invalide'));
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de l'analyse du marché: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue');
  }
}