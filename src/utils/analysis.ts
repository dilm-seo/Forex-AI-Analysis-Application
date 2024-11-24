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

Pour chaque opportunité, fournissez une analyse détaillée basée sur les données économiques réelles et actuelles. Utilisez les nouvelles données pour justifier les tendances et les signaux générés.

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
}

Validation des Signaux :

1. Vérifiez que chaque opportunité respecte :
   - La cohérence des tendances (haussière vs baissière)
   - Le différentiel de force minimum
   - La validité des niveaux techniques
   - La logique du timeframe

2. Assurez-vous que :
   - Les corrélations sont basées sur des facteurs fondamentaux
   - Le sentiment reflète l'ensemble des conditions
   - Les facteurs cités sont vérifiables et actuels

3. Évitez :
   - Les signaux contradictoires
   - Les paires avec faible liquidité
   - Les niveaux non significatifs
   - Les analyses non fondées

Retournez UNIQUEMENT l'objet JSON, sans formatage markdown ni blocs de code.`;

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

    // Validation de la cohérence des signaux
    const [baseCurrency, quoteCurrency] = opp.pair.split('/');
    const baseInfo = data.currencies.find(c => c.currency === baseCurrency);
    const quoteInfo = data.currencies.find(c => c.currency === quoteCurrency);

    if (!baseInfo || !quoteInfo) {
      throw new Error(`Devises non trouvées pour la paire ${opp.pair}`);
    }

    const isValidBuy = opp.type === 'buy' && 
      baseInfo.trend === 'up' && 
      quoteInfo.trend === 'down' && 
      (baseInfo.strength - quoteInfo.strength >= 20);

    const isValidSell = opp.type === 'sell' && 
      baseInfo.trend === 'down' && 
      quoteInfo.trend === 'up' && 
      (quoteInfo.strength - baseInfo.strength >= 20);

    if (!isValidBuy && !isValidSell) {
      throw new Error(`Signal invalide pour la paire ${opp.pair}: tendances incohérentes`);
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
  try {
    onProgress(10, 'Préparation des données...');

    const newsContent = news.map(item => ({
      title: item.title,
      description: item.description,
      date: item.pubDate
    }));

    onProgress(30, 'Analyse en cours...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: JSON.stringify(newsContent)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    onProgress(60, 'Traitement des résultats...');

    if (!response.ok) {
      throw new Error('Erreur lors de la requête vers OpenAI');
    }

    const result = await response.json();
    let content = result.choices[0].message.content.trim();

    onProgress(80, 'Validation des données...');

    try {
      const parsedData = JSON.parse(content);
      if (validateAnalysis(parsedData)) {
        onProgress(100, 'Analyse terminée');
        return parsedData;
      }
    } catch (error) {
      throw new Error('Impossible de parser la réponse JSON');
    }

    throw new Error('Format de réponse invalide');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de l'analyse du marché: ${error.message}`);
    }
    throw new Error('Une erreur inattendue est survenue');
  }
};
