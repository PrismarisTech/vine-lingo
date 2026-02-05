
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export default async function handler(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const termId = searchParams.get('term');

  if (!termId) {
    return fetch(`${origin}/index.html`);
  }

  try {
    // 1. Fetch term from Supabase
    const { data: term, error } = await supabase
      .from('terms')
      .select('*')
      .eq('id', termId)
      .single();

    if (error || !term) {
      return fetch(`${origin}/index.html`);
    }

    // 2. Fetch the base HTML
    const response = await fetch(`${origin}/index.html`);
    let html = await response.text();

    // 3. Prepare dynamic metadata
    const title = `${term.term} | Vine Lingo`;
    const description = term.definition;
    const ogImage = `${origin}/api/og?term=${termId}`;
    const pageUrl = `${origin}/?term=${termId}`;

    // 4. Inject metadata into HTML
    // We replace the generic tags with specific ones
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    
    // Replace description
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);
    
    // Replace OG tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${pageUrl}" />`);
    
    // Add/Replace og:image (important!)
    if (html.includes('property="og:image"')) {
      html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${ogImage}" />`);
    } else {
      html = html.replace('</head>', `<meta property="og:image" content="${ogImage}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n</head>`);
    }

    // Replace Twitter tags
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:url" content=".*?" \/>/, `<meta name="twitter:url" content="${pageUrl}" />`);
    
    if (html.includes('name="twitter:image"')) {
      html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${ogImage}" />`);
    } else {
      html = html.replace('</head>', `<meta name="twitter:image" content="${ogImage}" />\n</head>`);
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (e) {
    console.error('Error in share handler:', e);
    return fetch(`${origin}/index.html`);
  }
}
