import { NextResponse } from 'next/server';
import { getOrGenerateKeys } from '@/lib/crypto';

export async function GET() {
  try {
    const { publicJwk } = await getOrGenerateKeys();
    
    return NextResponse.json({
      keys: [publicJwk]
    });
  } catch (error) {
    console.error("Keys Error:", error);
    return NextResponse.json({ error: 'Impossible de récupérer la clé publique.' }, { status: 500 });
  }
}
