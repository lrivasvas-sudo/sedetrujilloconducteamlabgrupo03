# Nara

Nara es una aplicación web de bienestar emocional para estudiantes, docentes y personal administrativo de la Universidad César Vallejo (UCV), Perú.

Su objetivo es ofrecer orientación emocional, recursos de bienestar y acceso a atención psicológica, desde celulares, tabletas y computadoras.

> **Estado actual:** Etapa 1 — base del proyecto y primera pantalla. Todavía no hay inicio de sesión, base de datos ni asistente de IA. Ver [docs/ROADMAP.md](docs/ROADMAP.md) y [docs/REQUISITOS.md](docs/REQUISITOS.md).

## Tecnologías

- **Next.js 16** (framework de React): páginas, rutas y generación de la versión de producción.
- **TypeScript**: JavaScript con tipos, para detectar errores antes de ejecutar la app.
- **Tailwind CSS 4**: estilos mediante clases; la paleta pastel de Nara está en `src/app/globals.css`.
- **ESLint**: revisa el código en busca de errores comunes.

## Requisitos previos

- [Node.js](https://nodejs.org/) versión 20 o superior.
- npm (se instala junto con Node.js).

## Instalación

```bash
npm install
```

## Configuración de entorno

```bash
cp .env.example .env.local
```

Por ahora ninguna variable es obligatoria. El archivo `.env.example` solo lista nombres de variables que se usarán en etapas futuras. Nunca subas `.env.local` a GitHub.

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador. La página se actualiza sola al guardar cambios.

## Comprobaciones

```bash
npm run lint       # revisa el estilo y errores comunes del código
npm run typecheck  # revisa los tipos de TypeScript
```

Todavía no hay pruebas automatizadas; se añadirán en las etapas que lo requieran.

## Versión de producción

```bash
npm run build      # genera la versión optimizada en la carpeta .next
npm start          # sirve la versión de producción en http://localhost:3000
```

## Estructura de carpetas

```
src/
├── app/          páginas y rutas, estilos globales (globals.css)
├── components/   componentes visuales reutilizables
├── config/       textos y datos generales (site.ts)
├── lib/          utilidades compartidas
├── services/     lógica de negocio y acceso a datos (pendiente)
└── types/        tipos de datos compartidos
docs/             requisitos y hoja de ruta
```

## Despliegue

El despliegue en Vercel se realizará en una etapa posterior.
