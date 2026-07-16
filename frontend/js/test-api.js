import { apiGet } from "./api.js";

export async function probarApi() {

    const app = document.getElementById("app");

    try {

        const datos = await apiGet("/health");
        const cursos = await apiGet("/cursos");

        app.innerHTML = `
            <h2>Prueba API</h2>
            <pre>${JSON.stringify(datos, null, 2)}</pre>
            <h2>Cursos</h2>
            <pre>${JSON.stringify(cursos, null, 2)}</pre>
        `;

    } catch (error) {

        app.innerHTML = `
            <h2>Error</h2>
            <p>${error.message}</p>
        `;

    }

}