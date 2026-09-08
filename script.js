// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================

// Pega aquí la URL que copiaste de Data API.
// Debe terminar en /rest/v1/
const SUPABASE_REST_URL = "https://xhdexnanmhjztrgeveax.supabase.co/rest/v1/";

// Pega aquí tu Publishable Key.
// Debe comenzar con sb_publishable_
const SUPABASE_KEY = "sb_publishable_CeHMU7LjrhLZoczJt7Qa_Q_YWEhXKRB";


// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const formulario =
    document.getElementById("formConfirmacion");

const asistencia =
    document.getElementById("asistencia");

const grupoCantidad =
    document.getElementById("grupoCantidad");

const cantidad =
    document.getElementById("cantidad");

const mensaje =
    document.getElementById("mensaje");

const boton =
    formulario.querySelector('button[type="submit"]');


// ==========================================
// MOSTRAR / OCULTAR CANTIDAD
// ==========================================

asistencia.addEventListener("change", function () {

    if (asistencia.value === "No") {

        grupoCantidad.style.display = "none";

    } else {

        grupoCantidad.style.display = "block";

    }
});


// ==========================================
// GUARDAR CONFIRMACIÓN
// ==========================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();

    const respuesta =
        asistencia.value;

    const numeroPersonas =
        respuesta === "Sí"
            ? Number(cantidad.value)
            : 0;


    // Evitamos doble clic mientras se guarda

    boton.disabled = true;

    boton.textContent =
        "Guardando confirmación...";

    mensaje.innerHTML = "";


    try {

        const respuestaSupabase =
            await fetch(
                `${SUPABASE_REST_URL}confirmaciones`,
                {
                    method: "POST",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json",
                        "Prefer": "return=minimal"
                    },

                    body: JSON.stringify({
                        nombre: nombre,
                        asistencia: respuesta,
                        cantidad_personas: numeroPersonas
                    })
                }
            );


        if (!respuestaSupabase.ok) {

            const error =
                await respuestaSupabase.text();

            console.error(
                "Error de Supabase:",
                error
            );

            throw new Error(
                "No se pudo guardar la confirmación."
            );
        }


        // ==================================
        // CONFIRMACIÓN EXITOSA
        // ==================================

        if (respuesta === "Sí") {

            mensaje.innerHTML =
                `
                ✨ ¡Gracias ${nombre}! ✨
                <br><br>

                Tu asistencia ha sido confirmada
                para ${numeroPersonas}
                ${numeroPersonas === 1
                    ? "persona"
                    : "personas"}.

                <br><br>

                ¡Nos dará mucho gusto verte!
                `;

        } else {

            mensaje.innerHTML =
                `
                Gracias por avisarnos,
                ${nombre}. 💛

                <br><br>

                Lamentamos que no puedas acompañarnos.
                `;

        }


        formulario.reset();

        grupoCantidad.style.display =
            "block";


    } catch (error) {

        console.error(error);

        mensaje.innerHTML =
            `
            ⚠️ No pudimos registrar tu
            confirmación.

            <br><br>

            Por favor intenta nuevamente.
            `;

    } finally {

        boton.disabled = false;

        boton.textContent =
            "Confirmar asistencia";
    }

});