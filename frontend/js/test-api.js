import { apiGet } from "./api.js";

export async function probarApi() {

    const app = document.getElementById("app");

    try {

        const datos = await apiGet("/health");

        app.innerHTML = `
            <h2>Prueba API</h2>
            <pre>${JSON.stringify(datos, null, 2)}</pre>
        `;

    } catch (error) {

        app.innerHTML = `
            <h2>Error</h2>
            <p>${error.message}</p>
        `;

    }

}