# Mi Sistema — Productividad (Offline)

Aplicación web personal (single-user) estilo Notion/Linear, **offline**, con persistencia en **localStorage** y modo **dark/light**.

## Requisitos (Windows)

- **Node.js LTS** (incluye `npm`) instalado.
  - Si `npm` no se reconoce en la terminal, instala Node.js y reinicia la terminal.

## Instalación

En PowerShell, dentro de esta carpeta:

```bash
npm install
```

## Ejecutar en local

```bash
npm run dev
```

Luego abre el navegador en `http://localhost:5173`.

## Build (opcional)

```bash
npm run build
npm run preview
```

## Datos y persistencia

- Se guarda **todo** en `localStorage` bajo la clave `pps:v1`.
- En el **primer arranque** se inicializa **seed data** (hábitos, proyectos, plan del día, tracking).
- La app funciona **sin backend** y sin autenticación.

## Exportación

- **History → Exportar a PDF**: usa `Imprimir` del navegador (print stylesheet incluido).
- **Exportar JSON**: descarga un backup con el estado completo.

