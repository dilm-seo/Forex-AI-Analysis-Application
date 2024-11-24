import type { Analysis, NewsItem } from '../types';

const SYSTEM_PROMPT = `Vous êtes un analyste forex professionnel expérimenté. Analysez les nouvelles suivantes en utilisant une approche multi-factorielle pour générer des signaux de trading cohérents.

Règles CRITIQUES pour la génération des signaux :

1. Logique des Paires
   - Une opportunité d'achat (BUY) n'est valide que si :
     * La devise de base est haussière (UP) ET la devise cotée est baissière (DOWN)
     * La force relative de la devise de base est significativement supérieure
   - Une opportunité de vente (SELL) n'est valide que si :
     * La devise de base est baissière (DOWN) ET la devise cotée est haussière (UP)
     * La force relative de la devise cotée est significativement supérieure
   - Les paires avec des tendances similaires ne génèrent pas de signal

2. Critères de Force
   - Différentiel minimum de 20% entre les forces des devises
   - Force minimale de 60% pour la devise dominante
   - Faiblesse maximale de 40% pour la devise faible

3. Timeframes
   - Court terme (1-3 jours) : Différentiel de force 20-40%
   - Moyen terme (1-2 semaines) : Différentiel de force 40-60%
   - Long terme (2+ semaines) : Différentiel de force >60%

4. Gestion du Risque
   - Ratio risque/rendement minimum de 1:2
   - Stop loss basé sur le support/résistance le plus proche
   - Target basé sur les niveaux techniques majeurs
   - Risque ajusté selon la volatilité de la paire

Format de réponse attendu (JSON pur) :
{
  "currencies": [
    {
      "currency": "USD",
      "strength": 75,
      "trend": "up",
      "factors": [
        "Hausse des taux Fed",
        "Données économiques solides"
      ]
    }
  ],
  "opportunities": [
    {
      "pair": "EUR/USD",
      "type": "sell",
      "timeframe": "moyen",
      "strength": 85,
      "reasoning": [
        "EUR baissier (trend: down, force: 35%)",
        "USD haussier (trend: up, force: 75%)",
        "Différentiel de force: 40%",
        "Support technique cassé"
      ],
      "risk": "modéré",
      "stopLoss": 1.0850,
      "target": 1.0650
    }
  ],
  "correlations": [
    {
      "pair": "EUR/USD",
      "correlation": -0.85,
      "explanation": "Forte corrélation négative due à la divergence des politiques monétaires",
      "factors": [
        "BCE dovish vs Fed hawkish",
        "Différentiel de taux croissant"
      ]
    }
  ],
  "marketSentiment": {
    "overall": "risk-off",
    "confidence": 75,
    "drivers": [
      "Aversion au risque élevée",
      "Volatilité en hausse"
    ]
  }
}`;

interface ProgressCallback {
  (value: number, message: string): void;
}

const validateAnalysis = (data: any): data is Analysis => {
  if (!data || typeof data !== 'object') {
    throw new Error('Format de réponse invalide');
  }

  // Validation des devises
  if (!Array.isArray(data.currencies)) {
    throw new Error('Liste des devises invalide');
  }

  data.currencies.forEach((currency: any, index: number) => {
    if (
      typeof currency.currency !== 'string' ||
      typeof currency.strength !== 'number' ||
      !['up', 'down', 'neutral'].includes(currency.trend) ||
      !Array.isArray(currency.factors)
    ) {
      throw new Error(`Devise invalide à l'index ${index}`);
    }
  });

  // Validation des opportunités
  if (!Array.isArray(data.opportunities)) {
    throw new Error('Liste des opportunités invalide');
  }

  data.opportunities.forEach((opp: any, index: number) => {
    if (
      typeof opp.pair !== 'string' ||
      !['buy', 'sell'].includes(opp.type) ||
      !['court', 'moyen', 'long'].includes(opp.timeframe) ||
      typeof opp.strength !== 'number' ||
      !Array.isArray(opp.reasoning) ||
      !['faible', 'modéré', 'élevé'].includes(opp.risk) ||
      typeof opp.stopLoss !== 'number' ||
      typeof opp.target !== 'number'
    ) {
      throw new Error(`Opportunité invalide à l'index ${index}`);
    }
  });

  // Validation des corrélations
  if (!Array.isArray(data.correlations)) {
    throw new Error('Liste des corrélations invalide');
  }

  data.correlations.forEach((corr: any, index: number) => {
    if (
      typeof corr.pair !== 'string' ||
      typeof corr.correlation !== 'number' ||
      typeof corr.explanation !== 'string' ||
      !Array.isArray(corr.factors)
    ) {
      throw new Error(`Corrélation invalide à l'index ${index}`);
    }
  });

  // Validation du sentiment
  if (
    !data.marketSentiment ||
    !['risk-on', 'risk-off', 'neutral'].includes(data.marketSentiment.overall) ||
    typeof data.marketSentiment.confidence !== 'number' ||
    !Array.isArray(data.marketSentiment.drivers)
  ) {
    throw new Error('Sentiment de marché invalide');
  }

  return true;
};

export const analyzeMarketData = async (
  news: NewsItem[],
  apiKey: string,
  onProgress: ProgressCallback
): Promise<Analysis> => {
  const MAX_RETRIES = 5; // Nombre maximum de tentatives
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      onProgress(10, `Tentative ${attempt}/${MAX_RETRIES}: Préparation des données...`);

      const newsContent = news.map(item => ({
        title: item.title,
        description: item.description,
        date: item.pubDate
      }));

      onProgress(30, `Tentative ${attempt}: Envoi des données à l'API...`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-128k',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(newsContent) },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      onProgress(60, `Tentative ${attempt}: Traitement de la réponse de l'API...`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;

      onProgress(80, `Tentative ${attempt}: Validation des données reçues...`);

      try {
        const parsedData = JSON.parse(content);
        if (validateAnalysis(parsedData)) {
          onProgress(100, `Analyse réussie après ${attempt} tentative(s).`);
          return parsedData;
        }
      } catch (parsingError) {
        throw new Error(`Erreur de parsing JSON: ${parsingError.message}`);
      }

      throw new Error('Format de réponse JSON invalide');
    } catch (error) {
      console.error(`Erreur lors de la tentative ${attempt}: ${error instanceof Error ? error.message : error}`);

      if (attempt >= MAX_RETRIES) {
        throw new Error(`Échec après ${MAX_RETRIES} tentatives. Dernière erreur : ${error}`);
      }

      onProgress(90, `Nouvelle tentative (${attempt}/${MAX_RETRIES})...`);
    }
  }

  throw new Error('Une erreur inattendue est survenue, réessai impossible.');
};
