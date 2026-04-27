# Abundanza — Lead Magnet IA

## Qué es este proyecto

App HTML de una sola página (vanilla JS, sin frameworks) que funciona como lead magnet para **Abundanza**, marca de educación para el mundo de la danza.

El usuario llega, elige su perfil y recibe un diagnóstico personalizado generado por IA. Al final puede descargar el resultado como HTML.

---

## Estado actual

- [x] Skills creadas (`.claude/skills/`)
- [x] App HTML completa (`index.html`)
- [x] Edge function proxy en Netlify (`netlify/edge-functions/chat.js`)
- [x] Desplegado en `abundanzachat.netlify.app`
- [x] API key de Gemini cargada en Netlify como `GEMINI_API_KEY`
- [ ] **Pendiente:** confirmar que `gemini-1.5-flash-latest` funciona en el plan free (último cambio sin probar)

---

## Flujo de la app

```
Landing → Selección de perfil → Chat con IA → Resultado descargable
```

- **Pantalla 1:** Logo + tagline + botón (sin campo de API key — es transparente para el usuario)
- **Pantalla 2:** Dos tarjetas — "Soy dueño/a de academia" o "Soy profesor/a de danza"
- **Pantalla 3:** Chat conversacional. La IA hace preguntas de a una o dos. Al terminar entrega el diagnóstico.
- **Botón Guardar:** aparece cuando la IA incluye `✦ DIAGNÓSTICO COMPLETO` o `✦ TU PLAN DE CONTENIDO`. Descarga un HTML con branding Abundanza.

---

## Estructura de archivos

```
academia-abundanza/
├── index.html                          ← App principal (única página)
├── abundanza-logo.png                  ← Logo real, debe estar junto al HTML
├── netlify.toml                        ← Configuración de Netlify
├── netlify/
│   └── edge-functions/
│       └── chat.js                     ← Proxy serverless → Gemini API
└── .claude/
    └── skills/
        ├── abundanza-academia.md       ← Skill: dueños de academia (calculadora de rentabilidad)
        └── abundanza-profesor.md       ← Skill: profesores de danza (plan de contenido + guiones)
```

---

## Identidad visual Abundanza

- **Paleta:** negro `#080808`, negro suave `#111111`, plata `#C8C8C8`, plata alta `#E8E8E8`, blanco suave `#F0F0F0`, gris `#888888`
- **NO usar:** dorado, amarillo, púrpura, colores saturados
- **Tipografía:** Bebas Neue (títulos, all-caps, letter-spacing 0.13em) + Helvetica Neue (cuerpo, letter-spacing -0.012em)
- **Elemento de marca:** `✦` (estrella Unicode 4 puntas, color plata)
- **Textura mármol:** CSS con gradientes superpuestos sobre fondo negro

---

## API y backend

- **Modelo:** `gemini-2.0-flash` (Gemini API free tier)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Variable de entorno en Netlify:** `GEMINI_API_KEY`
- **Edge function:** `/api/chat` → proxy a Gemini, la key nunca se expone al cliente
- **Respuesta:** JSON `{ text: "..." }` (no streaming — respuesta aparece completa)

---

## Cómo deployar

1. Hacer cambios en los archivos locales
2. Arrastrar la carpeta `academia-abundanza` al área de deploy en Netlify → **Despliega**
3. Esperar que diga "Published deploy" y "1 edge function deployed"
4. Abrir `abundanzachat.netlify.app` y probar

**Variables de entorno en Netlify:**
`app.netlify.com/projects/abundanzachat/configuration/env`

---

## Skills — resumen

### `abundanza-academia.md`
Para directores/dueños de academia. Recopila: identidad, áreas activas (alumnos × precio × frecuencia), costos fijos y variables, meta de ingresos. Calcula rentabilidad actual, brecha y genera plan de 3-5 acciones. Puede sugerir Meta Ads si la brecha supera el 30%.

### `abundanza-profesor.md`
Para profesores de danza. Identifica perfil (A: viral instintivo / B: pedagogo brillante / C: híbrido) y nivel de conciencia 0-5. Entrega: 4 pilares de contenido, plan de rodaje 15 días (4 bloques), 2-3 guiones con estructura Víctor Heras (hook → tensión → valor → cierre), copies para Instagram.

---

## Tono de marca

- Cálido, directo, empoderador
- Nunca "deberías" → usar "podés", "imaginate", "cuando hagás esto"
- Sin tecnicismos: no ROI, KPIs, funnel → "lo que entra", "lo que gastás", "lo que te queda"
- Celebrar lo que ya tienen antes de hablar de lo que falta

---

## Usuarios

- **Macarena** — fundadora de Abundanza. No es técnica. Comunicación en español. Prefiere instrucciones paso a paso con capturas de pantalla cuando es posible.
- Correo asociado a Netlify y Gemini: `amelierocioarte@gmail.com`
