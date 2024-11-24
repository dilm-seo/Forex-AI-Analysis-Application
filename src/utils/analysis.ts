import type { Analysis, NewsItem } from '../types';

const SYSTEM_PROMPT = `Vous êtes un assistant spécialisé dans l'analyse financière. Votre rôle est d'analyser les nouvelles suivantes pour générer des signaux de trading cohérents.

Règles :

1. Logique des Paires
   - Achat (BUY) : La devise de base doit être haussière et la devise cotée baissière.
   - Vente (SELL) : La devise de base doit être baissière et la devise cotée haussière.

2. Critères de Force
   - Différentiel minimum de 20% entre les forces.
   - Force minimale de 60% pour la devise dominante.

3. Timeframes
   - Court terme : Différentiel de force 20-40%
   - Moyen terme : Différentiel de force 40-60%
   - Long terme : Différentiel de force >60%

4. Gestion du Risque
   - Ratio risque/rendement minimum de 1:2
   - Stop loss sur le support/résistance le plus proche

Retournez STRICTEMENT un objet JSON valide avec les informations demandées, sans aucun texte supplémentaire, commentaire, ou explication. Utilisez le format JSON strictement valide et rien d'autre.`;

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

    const newsContent = news.slice(0, 5).map(item => ({
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
        max_tokens: 1500
      })
    });

    onProgress(60, 'Traitement des résultats...');

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Erreur lors de la requête vers OpenAI: ${response.status} - ${response.statusText} - ${errorDetail}`);
    }

    const result = await response.json();
    let content = result.choices[0].message.content.trim();

    // Si le contenu ne semble pas être un JSON valide, utiliser un second prompt pour le corriger
    `,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Corrigez le texte suivant pour qu\'il soit un JSON strictement valide :'
            },
            {
              role: 'user',
              content: content
            }
          ],
          temperature: 0.2,
          max_tokens: 1500
        })
      });

      if (!correctionResponse.ok) {
        const errorDetail = await correctionResponse.text();
        throw new Error(`Erreur lors de la requête de correction vers OpenAI: ${correctionResponse.status} - ${correctionResponse.statusText} - ${errorDetail}`);
      }

      const correctionResult = await correctionResponse.json();
      content = correctionResult.choices[0].message.content.trim();
    }

    onProgress(80, 'Validation des données...');

    try {
      let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (error) {
      throw new Error('La réponse de l\'API n\'est pas au format JSON valide. Assurez-vous que le modèle retourne uniquement du JSON sans aucun texte supplémentaire.');
    }
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
