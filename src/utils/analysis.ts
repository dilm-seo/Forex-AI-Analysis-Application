import type { Analysis, NewsItem } from '../types';

const SYSTEM_PROMPT = `En tant qu'analyste forex professionnel, analysez les nouvelles fournies et générez une analyse fondamentale structurée. Répondez UNIQUEMENT avec un objet JSON valide, sans formatage ou texte supplémentaire.

Format de réponse attendu :
{
  "currencies": [
    {
      "currency": "USD",
      "strength": 75,
      "trend": "up",
      "factors": ["Hausse des taux Fed", "Croissance robuste"],
      "fundamentals": {
        "economicGrowth": 80,
        "inflation": 65,
        "interestRates": 85,
        "employment": 75,
        "tradeBalance": 60
      },
      "events": [
        {
          "impact": "high",
          "description": "Réunion Fed",
          "date": "2024-03-20"
        }
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
        "Divergence politique monétaire",
        "Différentiel de croissance favorable au USD"
      ],
      "risk": "modéré",
      "stopLoss": 1.0850,
      "target": 1.0650,
      "riskRewardRatio": 2.5,
      "fundamentalFactors": {
        "monetaryPolicy": "Divergence croissante Fed/BCE",
        "economicData": "USA plus robuste que Zone Euro",
        "politicalFactors": "Stabilité politique US",
        "marketSentiment": "Préférence pour le dollar"
      }
    }
  ],
  "correlations": [
    {
      "pair": "EUR/USD",
      "correlation": -0.85,
      "explanation": "Forte corrélation négative due à la divergence des politiques monétaires",
      "strength": "forte",
      "fundamentalDrivers": [
        "Différentiel de taux d'intérêt",
        "Croissance économique relative"
      ],
      "period": "1m"
    }
  ],
  "marketSentiment": {
    "overall": "risk-off",
    "confidence": 75,
    "drivers": [
      "Tensions géopolitiques",
      "Ralentissement chinois"
    ],
    "fundamentalFactors": {
      "economicHealth": 65,
      "monetaryPolicy": "hawkish",
      "geopoliticalRisk": 70,
      "marketLiquidity": 80,
      "globalGrowth": 60
    },
    "keyEvents": [
      {
        "event": "Publication PIB US",
        "impact": "high",
        "date": "2024-03-28"
      }
    ]
  }
}

IMPORTANT:
- Les tendances (trend) doivent être exactement "up", "down" ou "neutral"
- Les forces (strength) doivent être entre 0 et 100
- Les types d'opportunités doivent être "buy" ou "sell"
- Les timeframes doivent être "court", "moyen" ou "long"
- Les niveaux de risque doivent être "faible", "modéré" ou "élevé"
- Le sentiment global doit être "risk-on", "risk-off" ou "neutral"
- Les corrélations doivent être entre -1 et 1
- Les forces de corrélation doivent être "forte", "moyenne" ou "faible"
- Les périodes doivent être "1j", "1s" ou "1m"`;

interface ProgressCallback {
  (value: number, message: string): void;
}

const cleanJsonString = (str: string): string => {
  try {
    const jsonStart = str.indexOf('{');
    const jsonEnd = str.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Réponse invalide : aucun objet JSON trouvé');
    }
    return str.slice(jsonStart, jsonEnd);
  } catch (error) {
    throw new Error('Erreur lors du nettoyage de la réponse JSON');
  }
};

const validateCurrency = (currency: any): boolean => {
  if (!currency || typeof currency !== 'object') return false;

  const validTrends = ['up', 'down', 'neutral'];
  const validImpacts = ['high', 'medium', 'low'];

  return (
    typeof currency.currency === 'string' &&
    typeof currency.strength === 'number' &&
    currency.strength >= 0 &&
    currency.strength <= 100 &&
    validTrends.includes(currency.trend) &&
    Array.isArray(currency.factors) &&
    currency.factors.every((f: any) => typeof f === 'string') &&
    typeof currency.fundamentals === 'object' &&
    Array.isArray(currency.events) &&
    currency.events.every((e: any) =>
      validImpacts.includes(e.impact) &&
      typeof e.description === 'string' &&
      typeof e.date === 'string'
    )
  );
};

const validateOpportunity = (opp: any): boolean => {
  if (!opp || typeof opp !== 'object') return false;

  const validTypes = ['buy', 'sell'];
  const validTimeframes = ['court', 'moyen', 'long'];
  const validRisks = ['faible', 'modéré', 'élevé'];

  return (
    typeof opp.pair === 'string' &&
    validTypes.includes(opp.type) &&
    validTimeframes.includes(opp.timeframe) &&
    typeof opp.strength === 'number' &&
    opp.strength >= 0 &&
    opp.strength <= 100 &&
    Array.isArray(opp.reasoning) &&
    validRisks.includes(opp.risk) &&
    typeof opp.stopLoss === 'number' &&
    typeof opp.target === 'number' &&
    typeof opp.riskRewardRatio === 'number' &&
    typeof opp.fundamentalFactors === 'object'
  );
};

const validateCorrelation = (correlation: any): boolean => {
  if (!correlation || typeof correlation !== 'object') return false;

  const validStrengths = ['forte', 'moyenne', 'faible'];
  const validPeriods = ['1j', '1s', '1m'];

  return (
    typeof correlation.pair === 'string' &&
    typeof correlation.correlation === 'number' &&
    correlation.correlation >= -1 &&
    correlation.correlation <= 1 &&
    typeof correlation.explanation === 'string' &&
    validStrengths.includes(correlation.strength) &&
    Array.isArray(correlation.fundamentalDrivers) &&
    validPeriods.includes(correlation.period)
  );
};

const validateMarketSentiment = (sentiment: any): boolean => {
  if (!sentiment || typeof sentiment !== 'object') return false;

  const validOverall = ['risk-on', 'risk-off', 'neutral'];
  const validPolicies = ['hawkish', 'dovish', 'neutral'];
  const validImpacts = ['high', 'medium', 'low'];

  return (
    validOverall.includes(sentiment.overall) &&
    typeof sentiment.confidence === 'number' &&
    sentiment.confidence >= 0 &&
    sentiment.confidence <= 100 &&
    Array.isArray(sentiment.drivers) &&
    typeof sentiment.fundamentalFactors === 'object' &&
    validPolicies.includes(sentiment.fundamentalFactors.monetaryPolicy) &&
    Array.isArray(sentiment.keyEvents) &&
    sentiment.keyEvents.every((e: any) =>
      typeof e.event === 'string' &&
      validImpacts.includes(e.impact) &&
      typeof e.date === 'string'
    )
  );
};

const validateAnalysis = (data: any): data is Analysis => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Données invalides');
    }

    if (!Array.isArray(data.currencies) || !data.currencies.every(validateCurrency)) {
      throw new Error('Validation des devises échouée');
    }

    if (!Array.isArray(data.opportunities) || !data.opportunities.every(validateOpportunity)) {
      throw new Error('Validation des opportunités échouée');
    }

    if (!Array.isArray(data.correlations) || !data.correlations.every(validateCorrelation)) {
      throw new Error('Validation des corrélations échouée');
    }

    if (!validateMarketSentiment(data.marketSentiment)) {
      throw new Error('Validation du sentiment échouée');
    }

    return true;
  } catch (error) {
    throw new Error(`Validation échouée: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
  }
};

export const analyzeMarketData = async (
  news: NewsItem[],
  apiKey: string,
  onProgress: ProgressCallback
): Promise<Analysis> => {
  try {
    onProgress(10, 'Préparation de l\'analyse...');

    const newsContent = news.map(item => ({
      title: item.title,
      description: item.description,
      date: item.pubDate
    }));

    onProgress(30, 'Analyse des nouvelles...');

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
        temperature: 0.3,
        max_tokens: 2500,
        response_format: { type: "json_object" }
      })
    });

    onProgress(60, 'Traitement de la réponse...');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erreur OpenAI: ${error.error?.message || 'Erreur inconnue'}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;

    onProgress(80, 'Validation de l\'analyse...');

    try {
      const cleanedContent = cleanJsonString(content);
      const parsedData = JSON.parse(cleanedContent);

      if (validateAnalysis(parsedData)) {
        onProgress(100, 'Analyse terminée');
        return {
          ...parsedData,
          timestamp: Date.now(),
          confidence: Math.round((parsedData.marketSentiment?.confidence || 0) * 0.8)
        };
      }

      throw new Error('Validation de l\'analyse échouée');
    } catch (error) {
      throw new Error(`Erreur de parsing: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
    }
  } catch (error) {
    throw new Error(`Erreur d'analyse: ${error instanceof Error ? error.message : 'erreur inconnue'}`);
  }
};