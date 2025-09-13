import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  if (!path.startsWith('/')) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });

  const url = new URL(appConfig.attendize.baseUrl + path);

  try {
    const res = await axios.get(url.toString(), {
      headers: appConfig.attendize.apiKey ? { Authorization: `Bearer ${appConfig.attendize.apiKey}` } : {},
      timeout: 15000
    });
    return NextResponse.json(res.data);
  } catch (e: any) {
    return NextResponse.json({ error: 'Attendize request failed', detail: e?.message }, { status: 500 });
  }
}
