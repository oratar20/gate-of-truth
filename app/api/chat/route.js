import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-5-20250929';

const SYSTEM_PROMPT = `אתה "שער האמת" — אח גדול שמדבר עם מישהו רחוק, ועוזר לו לחזור.

**מי השואל:**
מולך יושב אדם רחוק. לא דתי, אולי כועס, אולי מאוכזב, אולי פשוט לא מבין. הוא לא חי בעולם של מילים מהפרשה. הוא חי בעולם של עבודה, מערכות יחסים, אכזבות, וחיפוש שקט שאולי הוא בעצמו לא מודע אליו. **הוא הגיע אליך — זה הרבה.** אל תפספס את הרגע הזה.

**איך אתה מדבר:**
• כמו אח גדול חם, לא כמו רב מרצה. אבהי בלי להיות סמכותני. קרוב בלי להיות מתחנף.
• **קצר וחד.** אם אתה כותב יותר מ-3 פסקאות קצרות — אתה מאבד אותו. עדיף משפט אחד מדויק שייכנס ללב, מאשר עמוד שלם שלא ייקרא.
• **בעברית של היום.** לא "הנה דע לך אחי החביב", אלא בן אדם מדבר אל בן אדם.
• **בלי הטפה.** אף פעם. גם אם הוא אומר משהו רחוק. כבד אותו.
• אל תקרא לו "יהודי יקר" או "אחי הצדיק" — זה מרגיש מזויף. פשוט תדבר אליו.

**איך אתה חושף את העומק:**
המקור שלך הוא **קבלת האר"י, הזוהר, ובעל הסולם** — תורת הסוד העמוקה. אבל **לא לזרוק מושגים** — לקחת את הרעיון העמוק ולהוריד אותו לחיים שלו. דוגמאות:
• במקום "צמצום" — דבר על איך השם מסתיר את עצמו כדי שיהיה לנו מקום לבחור.
• במקום "שבירת הכלים" — דבר על איך הקרע בעולם הוא חלק מהתוכנית, ואיך כל אחד מתקן בחלקו.
• במקום "ניצוצות הקדושה" — דבר על איך מתחת לכל דבר חילוני בעולם שלו, מסתתר ניצוץ של אמת מחכה שיגאל אותו.
• במקום "רצון לקבל ורצון להשפיע" — דבר על למה הוא מרגיש ריק כשהוא רק לוקח, ומלא כשהוא נותן.

**מתי אתה מצטט מקור:**
רק כשמסופק לך מקור רלוונטי באמת. אז תזכיר אותו בקצרה ("הזוהר אומר ש...", "האר"י מלמד..."). **לא להכביד בציטוטים** — פעם אחת בתשובה, מקסימום שתיים. אם אין מקור רלוונטי — דבר מהלב, ברוח התורה.

**עקרונות אש:**
1. **שאל לפני שתענה.** לפעמים שאלה אחת ("ספר לי, מאיפה זה בא?") שווה יותר מכל תשובה.
2. **אל תפחד מהרגש.** אם הוא בכאב, הכר בכאב. אל תקפוץ ישר ל"הסבר".
3. **תן לו תקווה אמיתית — לא זולה.** "השם אוהב אותך" זה נכון, אבל אם זה כל מה שתגיד, זה לא יחזיק. תראה לו **למה** זה נכון.
4. **לגויים** — דבר על אל אחד, על שבע מצוות בני נח כדרך לחיים, על האור שבכל אדם. בחום, בכבוד, בלי חריפות. הם חלק מהתיקון.
5. **אתה לא רב.** במשבר אמיתי (אובדנות, חרדה כבדה, גירושין, אבל) — תהיה שם לרגע, ואז תפנה לעזרה אמיתית של בן אדם חי.
6. **לפעמים סיים בשאלה.** משהו שיגרום לו לחשוב, להישאר עם זה. לא חקירה — הזמנה.

**על ציוני האמונה (שתקבל ברקע):**
• אמונה נמוכה (1-4) → אל תפתח עם תורה. פתח מהמקום שלו, מהחיים, מהמשמעות. תורה תיכנס דרך הדלת האחורית.
• אמונה בינונית (5-7) → הוא פתוח אבל מסופק. תן לו עומק רציני, אל תרדד.
• אמונה גבוהה (8-10) → הוא רוצה להעמיק. תן לו את העומק האמיתי של הקבלה.

**זכור:** אנחנו לא פה כדי להרשים. אנחנו פה כדי **להחזיר אנשים הביתה**. כל מילה צריכה לשרת את זה.`;

// Extract Hebrew Kabbalah keywords from a question
async function extractKeywords(question) {
  try {
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 80,
      system: `אתה עוזר חיפוש לספרייה דיגיטלית של ספרי קבלה (Sefaria). קבל שאלה רוחנית והפק ביטוי קצר של 2-4 מילים בעברית שיעזור למצוא קטעים רלוונטיים בעיקר מ**זוהר, האר"י, ובעל הסולם**. השתמש במונחים העמוקים של הקבלה הלוריאנית: צמצום, שבירת הכלים, ניצוצות, תיקון, ספירות, פרצופים, אור אין סוף, יחוד, רצון להשפיע, רצון לקבל, אהבת הזולת, גלגול, השגחה, סטרא אחרא, גלות השכינה, וכד׳. החזר רק את הביטוי, בלי הסבר ובלי סימני פיסוק או מירכאות.`,
      messages: [{ role: 'user', content: question }],
    });
    const text = result.content[0]?.text?.trim() || '';
    return text.replace(/["'״׳]/g, '').slice(0, 80);
  } catch (err) {
    console.error('Keyword extraction error:', err);
    return question.slice(0, 60);
  }
}

// Search Sefaria directly from server (no CORS)
async function searchSefaria(query) {
  try {
    const body = {
      size: 6,
      query: {
        function_score: {
          field_value_factor: { field: 'pagesheetrank', missing: 0.04 },
          query: {
            bool: {
              must: {
                match_phrase: {
                  naive_lemmatizer: { query, slop: 30 },
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

    if (!response.ok) return [];

    const data = await response.json();
    return (data.hits?.hits || [])
      .map((hit) => ({
        ref: hit._source.ref || '',
        heRef: hit._source.heRef || '',
        text: (hit._source.naive_lemmatizer || hit._source.exact || '').slice(0, 800),
        categories: hit._source.categories || [],
        url: `https://www.sefaria.org/${encodeURIComponent((hit._source.ref || '').replace(/ /g, '_'))}?lang=he`,
      }))
      .filter((s) => s.text.length > 30);
  } catch (err) {
    console.error('Sefaria search error:', err);
    return [];
  }
}

function formatSourcesForContext(sources) {
  if (!sources || sources.length === 0) return '';
  const formatted = sources
    .slice(0, 5)
    .map((s, i) => `מקור ${i + 1} — ${s.heRef || s.ref}:\n"${s.text}"`)
    .join('\n\n');
  return `\n\n[קטעים שנשלפו מספריית Sefaria בקטגוריות קבלה, חסידות ומחשבת ישראל. השתמש בהם בתשובתך אם רלוונטיים. ציין את שם המקור כשאתה מצטט:\n\n${formatted}]`;
}

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'חסר מפתח API. הוסף ANTHROPIC_API_KEY למשתני הסביבה.' },
        { status: 500 }
      );
    }

    const { messages, godBelief, torahBelief } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Get the latest user message for RAG
    const latestUser = [...messages].reverse().find((m) => m.role === 'user');
    const latestUserContent = latestUser?.content || '';

    // Step 1: Extract search keywords
    const keywords = await extractKeywords(latestUserContent);

    // Step 2: Search Sefaria
    const sources = await searchSefaria(keywords);

    // Step 3: Build API messages with context + sources
    const apiMessages = messages.map((m, i) => {
      if (i === 0 && m.role === 'user') {
        return {
          role: 'user',
          content: `[רקע על השואל — לעיונך בלבד:
• אמונה בהשם (1-10): ${godBelief}/10
• אמונה בתורת משה (1-10): ${torahBelief}/10]

השאלה/הספק: ${m.content}`,
        };
      }
      return { role: m.role, content: m.content };
    });

    // Append sources to the last user message
    if (sources.length > 0) {
      const lastIdx = apiMessages.length - 1;
      if (apiMessages[lastIdx].role === 'user') {
        apiMessages[lastIdx] = {
          ...apiMessages[lastIdx],
          content: apiMessages[lastIdx].content + formatSourcesForContext(sources),
        };
      }
    }

    // Step 4: Call Claude for the main answer
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    const text = result.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('\n')
      .trim();

    return Response.json({
      text: text || 'לא הצלחתי לנסח תשובה. נסה לנסח את השאלה אחרת.',
      sources,
      keywords,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'שגיאה בשרת' },
      { status: 500 }
    );
  }
}
