import * as jose from 'jose';
import fs from 'fs';
import path from 'path';

const KEYS_FILE = path.join(process.cwd(), 'keys.json');

/**
 * Initializes or loads the CDPI Asymmetric Key Pair (ES256 - ECDSA P-256)
 * We use ES256 as it's highly secure and standard for Verifiable Credentials.
 */
export async function getOrGenerateKeys() {
  if (fs.existsSync(KEYS_FILE)) {
    const keysRaw = fs.readFileSync(KEYS_FILE, 'utf-8');
    const keys = JSON.parse(keysRaw);
    const privateKey = await jose.importJWK(keys.privateJwk, 'ES256');
    const publicKey = await jose.importJWK(keys.publicJwk, 'ES256');
    return { privateKey, publicKey, publicJwk: keys.publicJwk };
  }

  // Generate new ECDSA key pair
  const { publicKey, privateKey } = await jose.generateKeyPair('ES256', { extractable: true });
  
  const publicJwk = await jose.exportJWK(publicKey);
  const privateJwk = await jose.exportJWK(privateKey);
  
  // Need to add kid (Key ID) for standard OIDC / VC verification
  publicJwk.kid = 'cdpi-key-1';
  privateJwk.kid = 'cdpi-key-1';
  publicJwk.alg = 'ES256';

  const keysData = { publicJwk, privateJwk };
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keysData, null, 2));

  // Reload with proper typings
  const loadedPriv = await jose.importJWK(privateJwk, 'ES256');
  const loadedPub = await jose.importJWK(publicJwk, 'ES256');

  return { privateKey: loadedPriv, publicKey: loadedPub, publicJwk };
}

/**
 * Signs a W3C Verifiable Credential Payload and returns a JWT
 */
export async function signVerifiableCredential(subjectData) {
  const { privateKey } = await getOrGenerateKeys();
  
  // W3C Verifiable Credentials Data Model v1.1
  const vcPayload = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "type": ["VerifiableCredential", "IdentityCredential"],
    "issuer": "did:web:cdpi.gov",
    "issuanceDate": new Date().toISOString(),
    "credentialSubject": {
      "id": `did:cdpi:citizen:${subjectData.npi}`,
      ...subjectData
    }
  };

  const jwt = await new jose.SignJWT({ vc: vcPayload })
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT', kid: 'cdpi-key-1' })
    .setIssuedAt()
    .setIssuer('did:web:cdpi.gov')
    .setSubject(`did:cdpi:citizen:${subjectData.npi}`)
    .setExpirationTime('10y')
    .sign(privateKey);

  return { jwt, vcPayload };
}

/**
 * Verifies a Verifiable Credential JWT using the CDPI Public Key
 */
export async function verifyCredential(jwt) {
  const { publicKey } = await getOrGenerateKeys();
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, publicKey, {
      issuer: 'did:web:cdpi.gov'
    });
    return { valid: true, payload, header: protectedHeader };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
