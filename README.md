# Todo App

Aplicación Angular para gestión de tareas con **diseño emerald**, **i18n ES/EN**, múltiples proyectos, modo oscuro y persistencia local.

Iniciada en enero 2024 como proyecto de aprendizaje de Angular. Refactorizada en junio 2026 con **OpenCode**, **SDD** (Spec-Driven Development) y **Engram** para adoptar un diseño profesional inspirado en una tienda online.

## ✨ Características

- **Diseño emerald** — Paleta verde profesional con Space Mono (títulos) + DM Sans (cuerpo), tipografía bien resuelta
- **i18n ES/EN** — Toggle de idioma en tiempo real con TranslatePipe
- **Múltiples proyectos** — Sidebar con proyectos, crealos y organizalos
- **Campo de descripción** — Cada tarea puede llevar una descripción detallada
- **Persistencia local** — Todo se guarda automáticamente en el navegador
- **Alerta de tareas estancadas** — Detecta tareas sin actualizar que necesitan atención
- **Filtros** — Visualiza todas, pendientes o completadas
- **Estadísticas** — Progreso por proyecto (completadas/totales)
- **Export / Import** — Respalda tus datos como JSON para llevarlos a otro navegador
- **Modo oscuro** — Alterna entre tema claro y oscuro con paleta emerald
- **Diseño responsive** — Funciona en desktop, tablet y móvil

## 🎨 Sistema de Diseño

| Elemento        | Detalle                         |
| --------------- | ------------------------------- |
| Colores         | `#4A7C59` / `#A7C4A0` / `#2E7D4F` |
| Títulos         | Space Mono (monospace, mayúsculas) |
| Cuerpo          | DM Sans                         |
| Bordes          | 3px solid #000 (estilo emerald) |
| Sombras         | 4px 4px 0px #000 (botones)      |
| Modo oscuro     | Fondo `#1a1a2e`, tarjetas `#1e2a4a` |

## 🛠️ Tecnologías

- **Angular 17** — Standalone components, Signals, Reactive Forms, esbuild
- **Tailwind CSS** — Utility-first, dark mode vía `class`
- **TypeScript** — Tipado estático
- **OpenCode + SDD + Engram** — Flujo de desarrollo asistido con memoria persistente

## 🚀 Instalación

```bash
git clone https://github.com/PouDDuoP/todo-app.git
cd todo-app
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

## 📦 Build

```bash
ng build
```

Los archivos de producción se generan en `dist/todo-app/`.

## 📱 Uso

1. **Crea un proyecto** desde el panel lateral
2. **Agrega tareas** con descripciones detalladas usando el campo de texto
3. **Alterna idioma** con el toggle ES/EN en el encabezado
4. **Filtra** por estado (todas / pendientes / completadas)
5. **Edita o elimina** tareas con los iconos SVG (lápiz / papelera)
6. **Marca como completada** con el botón circular
7. **Exporta / Importa** tu progreso desde el panel lateral

## 📜 Evolución

| Año   | Hito                               |
| ----- | ---------------------------------- |
| 2024  | Proyecto inicial con Angular 17    |
| 2025  | Primeros ajustes y pulido          |
| 2026  | Refactor completo con OpenCode + SDD + Engram: diseño emerald, i18n, dark mode, descripciones |

## 👤 Autor

**Kevin Alvarado** — [@PouDDuoP](https://github.com/PouDDuoP)
