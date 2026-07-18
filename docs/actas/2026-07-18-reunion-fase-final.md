# 📋 Acta de reunión — EduLogic

**Fecha:** Sábado 18 de julio de 2026, 9:00 am
**Canal:** Discord
**Asistentes:** Dylan Suárez (Scrum Master), Harold Aristizabal (Product Owner), Axel Ruiz, Samuel Roncancio, Mateo Hernández

---

## Contexto

El MVP está completo: backend y frontend funcionan de punta a punta con los tres roles (estudiante, profesor, admin), no hay PRs abiertos y el proyecto se levanta con un solo comando (`npm run dev`, issue #108). Con esta reunión inicia la fase final del proyecto: pruebas, despliegue, documentación y sustentación.

## Decisiones tomadas

1. **Rediseño visual del frontend: APROBADO.** Se hará un refresco de la interfaz (HTML y clases de Tailwind) **sin modificar la lógica de JavaScript ni la API**. Se coordinará con la issue #34 (responsive) para evitar conflictos entre ramas.

2. **Plan de demo para la sustentación:**
   - **Plan A:** aplicación desplegada (backend en Render, frontend en Vercel).
   - **Plan B:** ejecución local con el comando único. El archivo `backend/.env` (secretos de conexión) se llevará en una **memoria USB** el día de la sustentación, ya que por seguridad no está en el repositorio.

3. **Reparto del bloque final:**

| Issue | Tarea | Responsable |
|---|---|---|
| #37 | Ejecutar pruebas funcionales y registrar errores | Mateo |
| #82 | Rotar credenciales semilla (antes del despliegue) | Mateo |
| #34 | Revisión y ajustes responsive | Samuel + Axel |
| #38 | Despliegue del backend en Render | Dylan + Harold |
| #39 | Despliegue del frontend en Vercel | Axel |
| #40 | README definitivo | Harold |
| #41 | Documento técnico final | Dylan + Mateo |
| #42 | Pitch comercial (inglés) | Equipo — lidera Samuel |
| #43 | Pitch técnico (español) | Dylan |

4. **Prueba multiplataforma:** el **lunes 20 de julio** se probará el arranque con comando único (`npm install` → `npm run setup` → `npm run dev`) en Mac y Linux.

## Acuerdos operativos

- Orden de ejecución: primero #34 y #37 → luego #82 → despliegue #38 y #39. Documentación y pitches avanzan en paralelo.
- Todo bug encontrado se reporta a Mateo para el registro de errores (#37); no se corrige por cuenta propia, para que quede la evidencia de pruebas que exige la entrega.
- Al cerrar la #34 se publicará el **release v0.3.0** (dev → main), que cerrará en cascada las issues de frontend ya integradas.
- Cada miembro mantiene actualizadas sus tarjetas en el tablero del proyecto.

**Próxima reunión:** lunes 20 de julio de 2026.
