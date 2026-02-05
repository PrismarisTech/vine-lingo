export const config = {
  // Match all paths except for static assets
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};

// Helper function to escape HTML entities
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helper function to create a URL-friendly slug from a term name
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Check if a string looks like a UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const termId = url.searchParams.get('term');

  // FORCE the bot detection to true for a specific debug parameter
  // This helps you test if the HTML generation is working in your own browser
  const isDebug = url.searchParams.get('debug') === '1';
  const isNoJS = url.searchParams.get('nojs') === '1';

  const userAgent = req.headers.get('user-agent') || '';
  // Expanded bot list including common preview fetchers
  const isBot = isDebug || isNoJS || /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discordbot|slackbot|applebot|bingbot|yandex|baiduspider|duckduckbot/i.test(userAgent);

  // If it's a bot or no-js, we serve the HTML with meta tags
  if (isBot) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      if (isDebug) {
        return new Response(`Missing Environment Variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY`, { status: 500 });
      }
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }

    // Handle base URL (main site)
    if (!termId) {
      const title = 'Vine Lingo - The Unofficial Vine Dictionary';
      const description = 'A quick-reference guide for Amazon Vine Voices. Demystify acronyms and slang used in community forums and Discord servers.';
      const protocol = 'https';
      const ogImageUrl = `${protocol}://${url.host}/api/og`;
      const canonicalUrl = `${protocol}://${url.host}${url.pathname}`;

      let terms: any[] = [];
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/terms?select=*&status=eq.approved&order=term.asc`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );
        if (response.ok) {
          terms = await response.json();
        }
      } catch (e) {
        console.error('Error fetching terms for static view:', e);
      }

      const termsHtml = terms.map(t => `
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 16px; text-align: left;">
          <h2 style="color: #09BE82; margin: 0 0 8px 0; font-size: 1.25rem;">${escapeHtml(t.term)}</h2>
          <p style="color: #cbd5e1; margin: 0; line-height: 1.5;">${escapeHtml(t.definition)}</p>
          ${t.example ? `<p style="color: #94a3b8; font-style: italic; margin: 12px 0 0 0; font-size: 0.9rem; border-left: 2px solid #09BE82; padding-left: 12px;">"${escapeHtml(t.example)}"</p>` : ''}
        </div>
      `).join('');

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#09BE82">
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; margin: 0; padding: 20px; line-height: 1.5; }
      .container { max-width: 800px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 40px; padding-top: 20px; }
      .logo { width: 60px; height: 60px; border-radius: 12px; background: #09BE82; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin-bottom: 16px; }
      .nav-link { color: #09BE82; text-decoration: none; font-weight: 500; }
      .nav-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
      <div class="header">
          <div class="logo">V</div>
          <h1 style="font-size: 2.5rem; margin: 0;">Vine Lingo</h1>
          <p style="font-size: 1.1rem; color: #94a3b8; margin-top: 12px;">${description}</p>
          ${isNoJS ? '<p style="background: #064e3b; color: #6ee7b7; padding: 10px; border-radius: 8px; font-size: 0.9rem; margin-top: 20px;">Showing static version for compatibility.</p>' : ''}
      </div>
      <div class="glossary">
          ${termsHtml || '<p style="text-align: center; color: #94a3b8;">No terms found.</p>'}
      </div>
      <footer style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #1e293b; color: #64748b; font-size: 0.9rem;">
          <p>© ${new Date().getFullYear()} Vine Lingo. Built for the community.</p>
          ${isNoJS ? '<a href="/" class="nav-link">Try full interactive version</a>' : ''}
      </footer>
    </div>
    ${!isNoJS ? `
    <script>
      setTimeout(function() { window.location.href = "/"; }, 500);
    </script>` : ''}
</body>
</html>`.trim();

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 's-maxage=3600, stale-while-revalidate',
          'X-Middleware-Executed': 'true',
        },
      });
    }

    // Handle term permalink
    try {
      let term: any = null;

      // Try to find by slug first (if it doesn't look like a UUID)
      if (!isUUID(termId)) {
        // Query all approved terms and find by slug
        const slug = termId.toLowerCase().trim();
        const response = await fetch(
          `${supabaseUrl}/rest/v1/terms?select=*&status=eq.approved`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Find term where slugified name matches
          term = data.find((t: any) => slugify(t.term) === slug);
        }
      }

      // If not found by slug, or if it's a UUID, try ID lookup
      if (!term) {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/terms?id=eq.${encodeURIComponent(termId)}&select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          if (isDebug) {
            return new Response(`Supabase Fetch Error: ${response.status} ${response.statusText}`, { status: 500 });
          }
          return new Response(null, { headers: { 'x-middleware-next': '1' } });
        }

        const data = await response.json();
        term = data[0];
      }

      if (!term) {
        if (isDebug) {
          return new Response(`Term not found in database for ID: ${termId}`, { status: 404 });
        }
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
      }

      // Escape HTML to prevent breaking meta tags
      const escapedTerm = escapeHtml(term.term);
      const escapedDefinition = escapeHtml(term.definition);
      const title = `${escapedTerm} - Vine Lingo`;
      const description = escapedDefinition;
      const protocol = 'https';
      const termSlug = slugify(term.term);
      const ogImageUrl = `${protocol}://${url.host}/api/og?term=${encodeURIComponent(termSlug)}`;
      const canonicalUrl = `${protocol}://${url.host}${url.pathname}${url.search}`;

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#09BE82">
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; margin: 0; padding: 20px; line-height: 1.5; }
      .container { max-width: 800px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 40px; padding-top: 20px; }
      .logo { width: 60px; height: 60px; border-radius: 12px; background: #09BE82; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin-bottom: 16px; text-decoration: none; color: white; }
      .term-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 30px; margin-bottom: 24px; }
      .nav-link { color: #09BE82; text-decoration: none; font-weight: 500; }
      .nav-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
      <div class="header">
          <a href="/" class="logo">V</a>
          <h1 style="font-size: 2rem; margin: 0; margin-top: 16px;">Vine Lingo</h1>
      </div>
      <div class="term-card">
          <h2 style="color: #09BE82; margin: 0 0 16px 0; font-size: 2rem;">${escapedTerm}</h2>
          <p style="font-size: 1.25rem; color: #cbd5e1; line-height: 1.6; margin: 0;">${escapedDefinition}</p>
          ${term.example ? `<div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #334155;">
            <span style="color: #94a3b8; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Example Usage</span>
            <p style="color: #6ee7b7; font-style: italic; margin: 8px 0 0 0; font-size: 1.1rem;">"${escapeHtml(term.example)}"</p>
          </div>` : ''}
      </div>
      <div style="text-align: center;">
          <a href="/?nojs=1" class="nav-link">← View all terms</a>
      </div>
      <footer style="text-align: center; margin-top: 60px; padding: 20px; color: #64748b; font-size: 0.9rem;">
          <p>© ${new Date().getFullYear()} Vine Lingo</p>
          ${isNoJS ? '<a href="/?term=${termSlug}" class="nav-link">Try full interactive version</a>' : ''}
      </footer>
    </div>
    ${!isNoJS ? `
    <script>
      setTimeout(function() { window.location.href = "/?term=${termSlug}"; }, 500);
    </script>` : ''}
</body>
</html>`.trim();

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 's-maxage=3600, stale-while-revalidate',
          'X-Middleware-Executed': 'true',
        },
      });
    } catch (error: any) {
      console.error('Middleware error:', error);
      if (isDebug) {
        return new Response(`Middleware Exception: ${error.message}`, { status: 500 });
      }
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }
  }

  // For real users, just continue to the app
  return new Response(null, {
    headers: { 'x-middleware-next': '1' },
  });
}
