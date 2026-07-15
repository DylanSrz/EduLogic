import { vista404 } from "./vistas/noEncontrada.js";

const rutas = {};

export function registrarRuta(patron, vistaFn) {
    rutas[patron] = vistaFn;
}

function coincidirRuta(hash) {
    const segmentosHash = hash.split("/").filter(s => s !== "");

    for (const [clave, vistaFn] of Object.entries(rutas)) {
        const segmentosClave = clave.split("/").filter(s => s !== "");

        if (segmentosHash.length !== segmentosClave.length) continue;

        const parametros = {};
        let coincide = true;

        for (let i = 0; i < segmentosClave.length; i++) {
            const segRuta = segmentosClave[i];
            const segHash = segmentosHash[i];

            if (segRuta.startsWith(":")) {
                parametros[segRuta.slice(1)] = segHash;
            } else if (segRuta !== segHash) {
                coincide = false;
                break;
            }
        }

        if (coincide) return { vistaFn, parametros };
    }

    return null;
}

export function navegar() {
    const hash = window.location.hash.slice(1) || "/";
    const app = document.getElementById("app");

    if (!app) return;

    const coincidencia = coincidirRuta(hash);

    if (coincidencia) {
        coincidencia.vistaFn(app, coincidencia.parametros);
    } else {
        vista404(app);
    }
}