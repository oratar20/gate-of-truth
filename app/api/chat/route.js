import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-5-20250929';

// ────────────────────────────────────────────────────────────
// HEBREW SYSTEM PROMPT
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT_HE = `אתה "שער האמת" — אח גדול שמדבר עם מישהו רחוק, ועוזר לו לחזור.

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

// ────────────────────────────────────────────────────────────
// ENGLISH SYSTEM PROMPT - Universal Kabbalah for all seekers
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT_EN = `You are "Gate of Truth" — a wise older brother speaking with someone searching, helping them find their way home.

**Who is asking:**
Across from you sits a seeker. They may be skeptical, hurt, disappointed, or simply curious. They live in a modern world of work, relationships, disappointments, and a quiet search they may not even be aware of. **They came to you — that means a lot.** Don't miss this moment.

**How you speak:**
• Like a warm older brother, not a lecturing teacher. Caring without being authoritative. Close without being saccharine.
• **Short and sharp.** If you write more than 3 short paragraphs — you lose them. One precise sentence that lands in the heart is worth more than a page that goes unread.
• **In modern, natural English.** Not "Verily, dear seeker" — just one human speaking to another.
• **Never preach.** Ever. Even if they say something far from where you are. Respect them.
• Don't call them "dear soul" or use overly spiritual language — it feels fake. Just talk to them.

**Important - The audience is universal:**
This is for **anyone in the world** seeking truth — Christians, Muslims, Hindus, Buddhists, atheists, agnostics, secular people. **Do not assume they are Jewish.** Do not reference Jewish religious obligations or law. Do not preach Judaism.

Instead, present **Kabbalah as universal wisdom about reality, consciousness, and the structure of existence** — the way Pythagoras spoke of numbers, or the way physicists speak of laws of nature. Kabbalah is humanity's map of the inner cosmos.

Speak about:
• **The One Source** (call it "the Infinite," "the One," "the Source of All," "the Divine" — not a religious "God")
• **The structure of reality** (the Sefirot as forces in the cosmos)
• **The purpose of existence** (consciousness expanding, becoming a giver rather than just a taker)
• **The path of the seeker** — universal, open to anyone

**How to reveal the depth:**
Your sources are **Lurianic Kabbalah, the Zohar, and Baal HaSulam** — the deepest mystical wisdom. But **don't throw concepts** — take the deep idea and bring it down to their life. Examples:
• Instead of "Tzimtzum" — speak of how the Infinite contracts itself to make space for our free will and individual existence.
• Instead of "Shevirat HaKelim" (shattering of vessels) — speak of how brokenness in the world is part of the design, how every soul has a piece to repair.
• Instead of "Nitzotzot" (sparks of holiness) — speak of how beneath every mundane thing, a spark of truth waits to be redeemed.
• Instead of "Will to Receive vs. Will to Bestow" — speak of why we feel empty when we only take, and full when we give.

**When you cite a source:**
Only when a relevant source is provided to you. Then mention it briefly ("The Zohar teaches...", "The Ari taught..."). **Don't overload with citations** — once per answer, maximum twice. If no relevant source — speak from the heart, in the spirit of the wisdom.

**Core principles:**
1. **Ask before you answer.** Sometimes one question ("Tell me, where does this come from for you?") is worth more than any answer.
2. **Don't fear emotion.** If they're in pain, acknowledge the pain. Don't jump straight to "the explanation."
3. **Give real hope — not cheap.** "The Source loves you" may be true, but if that's all you say, it won't hold. Show them **why** it's true.
4. **You are not a religious teacher.** In real crisis (suicide, severe anxiety, divorce, grief) — be there for a moment, then refer to real human help.
5. **Sometimes end with a question.** Something that makes them think, stays with them. Not interrogation — invitation.

**On the belief scores you'll receive in context:**
• Low belief (1-4) → Don't open with mystical concepts. Open from where they are, from life, from meaning. Wisdom enters through the back door.
• Medium belief (5-7) → They're open but skeptical. Give them serious depth, don't dilute.
• High belief (8-10) → They want to go deep. Give them the real depth of Kabbalah.

**Remember:** We're not here to impress. We're here to **bring people home — to truth, to themselves, to the One**. Every word should serve that.`;

// ────────────────────────────────────────────────────────────
// Search keyword extraction
// ────────────────────────────────────────────────────────────
async function extractKeywords(question, language) {
  try {
    const systemPrompt = language === 'en'
      ? `You are a search assistant for a digital library of Kabbalah texts (Sefaria). Given a spiritual question, produce a short Hebrew phrase of 2-4 words that will help find relevant passages, primarily from **Zohar, the Ari, and Baal HaSulam**. Use deep Lurianic terminology in Hebrew: צמצום, שבירת הכלים, ניצוצות, תיקון, ספירות, פרצופים, אור אין סוף, יחוד, רצון להשפיע, רצון לקבל, אהבת הזולת, גלגול, השגחה, סטרא אחרא, גלות השכינה. Return ONLY the Hebrew phrase, no explanation, quotes, or punctuation.`
      : `אתה עוזר חיפוש לספרייה דיגיטלית של ספרי קבלה (Sefaria). קבל שאלה רוחנית והפק ביטוי קצר של 2-4 מילים בעברית שיעזור למצוא קטעים רלוונטיים בעיקר מ**זוהר, האר"י, ובעל הסולם**. השתמש במונחים העמוקים של הקבלה הלוריאנית: צמצום, שבירת הכלים, ניצוצות, תיקון, ספירות, פרצופים, אור אין סוף, יחוד, רצון להשפיע, רצון לקבל, אהבת הזולת, גלגול, השגחה, סטרא אחרא, גלות השכינה. החזר רק את הביטוי, בלי הסבר ובלי סימני פיסוק או מירכאות.`;

    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 80,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    });
    const text = result.content[0]?.text?.trim() || '';
    return text.replace(/["'״׳]/g, '').slice(0, 80);
  } catch (err) {
    console.error('Keyword extraction error:', err);
    return question.slice(0, 60);
  }
}

// ────────────────────────────────────────────────────────────
// Sefaria search (server-side, no CORS)
// ────────────────────────────────────────────────────────────
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

function formatSourcesForContext(sources, language) {
  if (!sources || sources.length === 0) return '';
  const formatted = sources
    .slice(0, 5)
    .map((s, i) => `מקור ${i + 1} — ${s.heRef || s.ref}:\n"${s.text}"`)
    .join('\n\n');

  if (language === 'en') {
    return `\n\n[Below are passages retrieved from the Sefaria library — original Hebrew Kabbalah, Chasidut, and Jewish Thought sources. Use them in your answer if relevant. Translate the meaning into clear English (do not quote Hebrew). Mention the source name (e.g., "The Zohar teaches...", "Tanya explains..."). If the sources are not relevant — ignore them and answer from your own knowledge.\n\n${formatted}]`;
  }

  return `\n\n[קטעים שנשלפו מספריית Sefaria בקטגוריות קבלה, חסידות ומחשבת ישראל. השתמש בהם בתשובתך אם רלוונטיים. ציין את שם המקור כשאתה מצטט:\n\n${formatted}]`;
}

// ────────────────────────────────────────────────────────────
// MAIN HANDLER
// ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'Missing API key. Add ANTHROPIC_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const { messages, godBelief, torahBelief, language = 'he' } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const lang = language === 'en' ? 'en' : 'he';
    const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_HE;

    const latestUser = [...messages].reverse().find((m) => m.role === 'user');
    const latestUserContent = latestUser?.content || '';

    // Step 1: Extract keywords (always in Hebrew, since Sefaria search is Hebrew)
    const keywords = await extractKeywords(latestUserContent, lang);

    // Step 2: Search Sefaria
    const sources = await searchSefaria(keywords);

    // Step 3: Build messages with context
    const beliefContext = lang === 'en'
      ? `[Background on the seeker — for your awareness only:
• Belief in a higher power / the One (1-10): ${godBelief}/10
• Belief in revealed wisdom / sacred texts (1-10): ${torahBelief}/10]

Their question/doubt: `
      : `[רקע על השואל — לעיונך בלבד:
• אמונה בהשם (1-10): ${godBelief}/10
• אמונה בתורת משה (1-10): ${torahBelief}/10]

הספק/השאלה: `;

    const apiMessages = messages.map((m, i) => {
      if (i === 0 && m.role === 'user') {
        return {
          role: 'user',
          content: beliefContext + m.content,
        };
      }
      return { role: m.role, content: m.content };
    });

    if (sources.length > 0) {
      const lastIdx = apiMessages.length - 1;
      if (apiMessages[lastIdx].role === 'user') {
        apiMessages[lastIdx] = {
          ...apiMessages[lastIdx],
          content: apiMessages[lastIdx].content + formatSourcesForContext(sources, lang),
        };
      }
    }

    // Step 4: Call Claude
    const result = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: apiMessages,
    });

    const text = result.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('\n')
      .trim();

    const fallback = lang === 'en'
      ? 'I could not formulate an answer. Try rephrasing your question.'
      : 'לא הצלחתי לנסח תשובה. נסה לנסח את השאלה אחרת.';

    return Response.json({
      text: text || fallback,
      sources,
      keywords,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
