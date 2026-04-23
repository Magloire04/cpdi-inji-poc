import { NextResponse } from 'next/server';
import { verifyCredential } from '@/lib/crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.jwt) {
      return NextResponse.json({ valid: false, error: 'Jeton manquant (JWT).' }, { status: 400 });
    }

    // Le module Verify utilise la clé publique du CDPI (mockée ici via getOrGenerateKeys en local)
    // pour valider cryptographiquement l'intégrité du jeton.
    const verificationResult = await verifyCredential(body.jwt);

    if (verificationResult.valid) {
      return NextResponse.json({
        valid: true,
        message: 'Signature cryptographique vérifiée. Document authentique.',
        decodedPayload: verificationResult.payload.vc,
        header: verificationResult.header
      });
    } else {
      return NextResponse.json({
        valid: false,
        error: `Échec de vérification : ${verificationResult.error}`
      }, { status: 401 });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ valid: false, error: 'Erreur interne lors de la vérification.' }, { status: 500 });
  }
}
