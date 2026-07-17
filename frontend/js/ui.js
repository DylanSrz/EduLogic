// Utilidades de interfaz compartidas por las vistas.

// Escapa un valor para insertarlo con seguridad en HTML.
// Cubre contenido de elementos Y valores de atributos (por eso escapa " y '):
// cualquier dato que venga de la API, de la URL o del usuario debe pasar por
// aqui antes de entrar a un innerHTML o a un value="...".
export function escapeHTML(valor) {
    if (valor === null || valor === undefined) return "";
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
