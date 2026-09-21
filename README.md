# Receptbanken
Receptbanken är en svensk receptplattform för att upptäcka, söka, spara och skapa recept. Projektet byggs med Vue 3 och TypeScript i frontend samt Node.js, Express och MongoDB Atlas i backend.

Den överenskomna arkitekturen, datamodellen, API-översikten, säkerhetsbesluten och utvecklingsplanen finns i [docs/ARKITEKTUR.md](docs/ARKITEKTUR.md).

## Lokal utveckling
Frontendens utvecklingsserver startas med:
npm install
npm run dev
Backendens Node/Express-struktur byggs i nästa fas. Miljövariabler ska ligga i en lokal `.env`-fil och aldrig committas.

## Dokumentation

All projektdokumentation skrivs på svenska. Kod, API-rutter, databasfält och mappnamn skrivs på engelska enligt projektets språkregel.
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Python API and MongoDB Atlas

Create a local environment file from the template and replace the placeholders with the connection details from MongoDB Atlas:

Receptbanken

Receptbanken är en svensk receptplattform för att upptäcka, söka, spara och skapa recept. Projektet byggs med Vue 3 och TypeScript i frontend samt Node.js, Express och MongoDB Atlas i backend.

Den överenskomna arkitekturen, datamodellen, API-översikten, säkerhetsbesluten och utvecklingsplanen finns i [docs/ARKITEKTUR.md](docs/ARKITEKTUR.md).

## Lokal utveckling

Frontendens utvecklingsserver startas med:

```powershell
npm install
npm run dev
```

Backendens API startas med:

```powershell
npm run backend:dev
```

API:t finns på `http://localhost:8000` och hälsokontrollen på `http://localhost:8000/api/health`.

Kopiera `.env.example` till `.env` och fyll i MongoDB Atlas-uppgifterna. Miljövariabler ska ligga i en lokal `.env`-fil och aldrig committas.

## Auth-endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Dokumentation

All projektdokumentation skrivs på svenska. Kod, API-rutter, databasfält och mappnamn skrivs på engelska enligt projektets språkregel.
