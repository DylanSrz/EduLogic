const URL_BASE = "http://127.0.0.1:8000";

export function guardarToken(token) {
    localStorage.setItem("token", token);
}

export function obtenerToken() {
    return localStorage.getItem("token");
}

export function borrarToken() {
    localStorage.removeItem("token");
}

export async function pedirApi(ruta, opciones = {}) {

    const url = URL_BASE + ruta;

    const headers = {
        "Content-Type": "application/json",
        ...opciones.headers,
        ...(obtenerToken() && {
            Authorization: `Bearer ${obtenerToken()}`
        })
    };

    try {

        const respuesta = await fetch(url, {
            ...opciones,
            headers,
            body: opciones.body
                ? JSON.stringify(opciones.body)
                : undefined
        });

        if (respuesta.status === 401 && obtenerToken()) {
            borrarToken();
            window.location.hash = "#/login";
            throw new Error("La sesión ha expirado.");
        }

        if (!respuesta.ok) {

            const error = await respuesta.json();

            throw new Error(
                error.detail || "Ocurrió un error en la petición."
            );

        }

        if (respuesta.status === 204) {
            return null;
        }

        return await respuesta.json();

    }

    catch (error) {

        if (error instanceof TypeError) {
            throw new Error("No fue posible conectar con el servidor.");
        }

        throw error;

    }

}

export function apiGet(ruta) {
    return pedirApi(ruta, {
        method: "GET"
    });
}

export function apiPost(ruta, datos) {
    return pedirApi(ruta, {
        method: "POST",
        body: datos
    });
}

export function apiPut(ruta, datos) {
    return pedirApi(ruta, {
        method: "PUT",
        body: datos
    });
}

export function apiDelete(ruta) {
    return pedirApi(ruta, {
        method: "DELETE"
    });
}