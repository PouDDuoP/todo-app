# Todo App

Aplicación web para gestión de tareas con soporte de múltiples proyectos, persistencia local, exportación/importación de datos y modo oscuro.

## ✨ Características

- **Múltiples proyectos** — Crea y organiza tus tareas en listas separadas
- **Persistencia local** — Todo se guarda automáticamente en el navegador
- **Alerta de tareas estancadas** — Detecta tareas sin actualizar que necesitan atención
- **Filtros** — Visualiza todas, pendientes o completadas
- **Estadísticas** — Progreso por proyecto (completadas/totales)
- **Export / Import** — Respalda tus datos como JSON para llevarlos a otro navegador
- **Modo oscuro** — Alterna entre tema claro y oscuro
- **Diseño responsive** — Funciona en desktop, tablet y móvil

## 🛠️ Tecnologías

- **Angular 17** — Standalone components, Signals, Reactive Forms
- **Tailwind CSS** — Diseño moderno y utility-first
- **TypeScript** — Tipado estático

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
2. **Agrega tareas** usando el campo de texto principal
3. **Filtra** por estado (todas / pendientes / completadas)
4. **Edita** con doble clic sobre una tarea
5. **Marca como completada** con el botón circular
6. **Exporta** tu progreso desde el panel lateral

## 🔄 Export / Import

Usa los botones en la parte inferior del panel lateral:
- **Export** — Descarga un archivo JSON con todos tus proyectos y tareas
- **Import** — Carga un archivo JSON previamente exportado

## 👤 Autor

**Kevin Alvarado** — [@PouDDuoP](https://github.com/PouDDuoP)
