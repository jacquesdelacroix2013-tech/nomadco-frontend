# NOMAD/CO — App boutique (Vite + React)

## Lancer en local (pour vérifier avant déploiement)
```
npm install
npm run dev
```
Ouvre l'URL affichée (généralement http://localhost:5173).

## Avant de déployer
Dans `src/App.jsx`, remplace :
```js
const CHECKOUT_ENDPOINT = "https://YOUR-BACKEND-URL.onrender.com/create-checkout-session";
```
par l'URL réelle de ton backend Render une fois déployé (voir `LANCEMENT.md` à la racine
du projet pour la marche à suivre complète).

## Déployer sur Vercel (gratuit)
1. Pousse ce dossier sur un repo GitHub.
2. Sur vercel.com : New Project > importe le repo.
3. Vercel détecte Vite automatiquement (build command `npm run build`, output `dist`).
4. Déploie — tu obtiens une URL du type `nomadco.vercel.app`.

Le fichier `vercel.json` est déjà configuré pour que la page `/success`
(retour après paiement Stripe) fonctionne correctement.

## Build de test
```
npm run build
npm run preview
```
Si `npm run build` échoue, le message d'erreur de Vite indiquera la ligne exacte —
copie-le-moi et je corrige.
