// Server-side search on Sefaria - no CORS issues
export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return Response.json({ sources: [] });
    }

    const body = {
      size: 6,
      query: {
        function_score: {
          field_value_factor: { field: 'pagesheetrank', missing: 0.04 },
          query: {
            bool: {
              must: {
                match_phrase: {
                  naive_lemmatizer: { query: query, slop: 30 },
                },
              },
              filter: {
                bool: {
                  must: [
                    { term: { lang: 'he' } },
                    {
                      bool: {
                        should: [
                          { regexp: { path: 'Kabbalah.*' } },
                          { regexp: { path: 'Chasidut.*' } },
                          { regexp: { path: 'Philosophy.*' } },
                          { regexp: { path: 'Jewish Thought.*' } },
                          { regexp: { path: 'Musar.*' } },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const response = await fetch('https://www.sefaria.org/api/search/text/_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return Response.json({ sources: [] });
    }

    const data = await response.json();
    const sources = (data.hits?.hits || [])
      .map((hit) => ({
        ref: hit._source.ref || '',
        heRef: hit._source.heRef || '',
        text: (hit._source.naive_lemmatizer || hit._source.exact || '').slice(0, 800),
        categories: hit._source.categories || [],
        url: `https://www.sefaria.org/${encodeURIComponent((hit._source.ref || '').replace(/ /g, '_'))}?lang=he`,
      }))
      .filter((s) => s.text.length > 30);

    return Response.json({ sources });
  } catch (error) {
    console.error('Sefaria search error:', error);
    return Response.json({ sources: [], error: error.message });
  }
}
