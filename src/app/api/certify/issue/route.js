import { NextResponse } from 'next/server';
import { signVerifiableCredential } from '@/lib/crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validation minimale
    if (!body.npi || !body.nom || !body.prenom) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Génération et signature de l'attestation Inji (W3C VC)
    const { jwt, vcPayload } = await signVerifiableCredential({
      npi: body.npi,
      nom: body.nom,
      prenom: body.prenom,
      genre: body.genre,
      photoUri: body.photoUri || null
    });

    return NextResponse.json({
      success: true,
      message: "Attestation générée et signée avec succès.",
      credentialToken: jwt,
      rawPayload: vcPayload
    });

  } catch (error) {
    console.error("Issuance Error:", error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la signature.' }, { status: 500 });
  }
}
