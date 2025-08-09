import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  if (!path.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const url = new URL(appConfig.indico.baseUrl + path);
  if (appConfig.indico.apiKey) {
    url.searchParams.set('apikey', appConfig.indico.apiKey);
  }

  try {
    const res = await axios.get(url.toString(), { timeout: 15000 });
    return NextResponse.json(res.data, {
      headers: {
        'Access-Control-Allow-Origin': appConfig.wordpressAllowedOrigins
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch Indico', detail: e?.message }, { status: 500 });
  }
}
