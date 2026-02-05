export const config = {
  matcher: '/',
};

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const termId = url.searchParams.get('term');

  // If there's no term ID, just continue to the normal app
  if (!termId) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }

  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discordbot/i.test(userAgent);

  // If it's a bot, we want to serve a page with dynamic meta tags
  if (isBot) {
    // Rewrite to our dedicated share handler
    const shareUrl = new URL(`/api/share?term=${termId}`, req.url);
    return new Response(null, {
      headers: { 'x-middleware-rewrite': shareUrl.toString() },
    });
  }

  // For real users, just serve the normal app
  return new Response(null, {
    headers: { 'x-middleware-next': '1' },
  });
}
