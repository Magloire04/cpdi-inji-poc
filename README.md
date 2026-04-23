# 🛡️ CDPI Inji Trust Framework (PoC)

Ce projet est un Proof of Concept (PoC) développé pour le **Comité Directeur du Projet d'Identification (CDPI)**. L'objectif est de démontrer de manière fonctionnelle, visuelle et cryptographique le fonctionnement de l'infrastructure d'identité numérique décentralisée basée sur la suite **MOSIP Inji**.

Au lieu de déployer les lourds microservices Java de MOSIP pour une simple démonstration, ce projet recrée exactement la même logique mathématique et les mêmes standards architecturaux dans une application Web légère de bout en bout (Next.js).

## 🧩 Les Trois Piliers de l'Architecture

Le projet simule le "Triangle de Confiance" (Trust Framework) des identités décentralisées :

1. **Inji Certify (L'Émetteur) :**
   *   Interface d'administration simulant l'État.
   *   Génère de véritables clés cryptographiques asymétriques (ES256).
   *   Encode les données du citoyen et sa photo (Base64) sous le standard strict **W3C Verifiable Credentials Data Model v1.1**.
   *   Signe ce document avec une Clé Privée pour produire un jeton JWT inaltérable, ensuite exposé aux citoyens d'une manière sécurisée.

2. **Inji Wallet (Le Détenteur) :**
   *   Interface orientée "Mobile-First" remplaçant l'application mobile native.
   *   Agit comme un "Holder" (Détenteur) en scannant/important le JWT (simulant ainsi l'OpenID4VCI).
   *   Permet au citoyen de stocker ses identités de manière totalement décentralisée et chiffrée hors-ligne (via IndexedDB / LocalStorage).

3. **Inji Verify (Le Vérificateur) :**
   *   Portail de vérification (tiers de confiance, police, banque...).
   *   Analyse le jeton JWT présenté par l'utilisateur.
   *   Vérifie mathématiquement la signature via la Clé Publique de l'Émetteur sans JAMAIS interroger la base de données gouvernementale. Toute falsification même à l'échelle d'un caractère invalide la preuve cryptographique.

## 🚀 Lancement Rapide (Local)

Le projet utilise **Next.js**. Assurez-vous d'avoir Node.js (v18+) installé.

```bash
# 1. Cloner ou télécharger le dépôt
cd cdpi-inji-poc

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Accédez à l'application via [http://localhost:3000](http://localhost:3000).

## 🛠 Données "Sous Le Capot" (Developer Mode)

Pour faciliter la compréhension des décideurs technologiques, l'application intègre un mode développeur visible dans chaque module. Ce mode révèle :
* Les "payloads" JSON bruts conformes W3C.
* Les JWT Signés.
* Les statuts de validation des algorithmes ECDSA.

## 🧰 Technologies Utilisées

* **Framework :** [Next.js](https://nextjs.org/) (App Router, API Routes).
* **Cryptographie :** [jose](https://github.com/panva/jose) (Génération JWT, JWS, Clés Elliptiques P-256).
* **Standards implémentés :** 
  * W3C Verifiable Credentials.
  * Logique de flux OpenID for Verifiable Credential Issuance (OIDC4VCI).
* **UI/UX :** CSS Natif Vanilla, Design System Premium (Glassmorphism), `lucide-react` (Icônes), `qrcode.react`.
* **Internationalisation :** Contexte i18n natif (EN / FR)

---
*Ceci est un Proof of Concept. Il ne contient pas les mécanismes d'authentification IAM lourds (Keycloak) de la production MOSIP réelle, mais prouve la viabilité de la logique métier.*
