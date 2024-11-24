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

      onProgress(30, `Tentative ${attempt}: Analyse en cours...`);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
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

      onProgress(60, `Tentative ${attempt}: Traitement des résultats...`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;

      onProgress(80, `Tentative ${attempt}: Validation des données...`);

      try {
        const parsedData = JSON.parse(content);
        if (validateAnalysis(parsedData)) {
          onProgress(100, `Analyse réussie après ${attempt} tentative(s)`);
          return parsedData;
        }
      } catch (parsingError) {
        throw new Error(`Erreur de parsing JSON: ${parsingError.message}`);
      }

      throw new Error('Format de réponse JSON invalide');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inattendue';
      console.error(`Erreur lors de la tentative ${attempt}: ${errorMessage}`);

      if (attempt >= MAX_RETRIES) {
        throw new Error(
          `Échec de l'analyse après ${MAX_RETRIES} tentatives: ${errorMessage}`
        );
      } else {
        onProgress(90, `Nouvelle tentative en cours (${attempt}/${MAX_RETRIES})...`);
      }
    }
  }

  throw new Error('Une erreur inattendue est survenue, réessai impossible');
};
