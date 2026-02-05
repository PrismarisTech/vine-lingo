
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const termId = searchParams.get('term');

    if (!termId) {
      return new Response('Missing term ID', { status: 400 });
    }

    // Fetch term from Supabase
    const { data: term, error } = await supabase
      .from('terms')
      .select('*')
      .eq('id', termId)
      .single();

    if (error || !term) {
      return new Response('Term not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              borderRadius: '32px',
              padding: '60px',
              width: '1000px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
            }}
          >
            {/* Header / Logo Area */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: '#09BE82',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginRight: '20px',
                }}
              >
                V
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                  Vine Lingo
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  The Unofficial Vine Dictionary
                </div>
              </div>
            </div>

            {/* Term Name */}
            <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px', display: 'flex' }}>
              {term.term}
            </div>

            {/* Category Badge */}
            <div style={{ display: 'flex', marginBottom: '40px' }}>
              <div
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '8px 20px',
                  borderRadius: '100px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: '1px solid #e2e8f0',
                }}
              >
                {term.category}
              </div>
            </div>

            {/* Definition */}
            <div style={{ fontSize: '32px', color: '#334155', lineHeight: '1.5', marginBottom: '40px' }}>
              {term.definition}
            </div>

            {/* Example (if exists) */}
            {term.example && (
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #cbd5e1', paddingLeft: '24px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Example
                </div>
                <div style={{ fontSize: '24px', fontStyle: 'italic', color: '#64748b' }}>
                  "{term.example}"
                </div>
              </div>
            )}
            
            {/* Branding Footer */}
            <div style={{ position: 'absolute', bottom: '60px', right: '60px', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '18px' }}>
              vine-lingo.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
