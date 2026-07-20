# Frontend - EduLogic

Frontend de EduLogic desarrollado con HTML, Tailwind CSS y JavaScript Vanilla.

## Requisitos

- Node.js

## Instalación

```bash
npm install
```

## Compilar Tailwind CSS

> ⚠️ `css/estilos.css` es un **archivo generado** y NO se versiona en Git (decisión de equipo, issue #93).
> Si acabas de clonar el repo o ves la app sin estilos, te falta este paso.

Mientras desarrollas, deja corriendo en una terminal:

```bash
npm run dev
```

Recompila los estilos automáticamente cada vez que guardas un archivo — no vuelvas a editar `estilos.css` a mano: se sobrescribe en cada compilación.

Para generar la versión final minificada (la usa el despliegue):

```bash
npm install
```

## Ejecutar el proyecto

Abrir `index.html` con la extensión **Live Server** de Visual Studio Code.

También puede ejecutarse con:

```bash
python -m http.server 5500
```

Luego abrir:

```
http://localhost:5500
```