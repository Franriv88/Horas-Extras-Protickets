//================================
// LÓGICA DE GUARDADO Y CARGA DE DATOS (LocalStorage)
//================================

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});

function guardarDatos() {
    // Guarda los datos de la tabla
    const filas = document.querySelectorAll('#miTabla tbody tr');
    const datosDeTabla = [];
    filas.forEach(fila => {
        const fecha = fila.querySelector('input[name="fecha[]"]').value;
        const horaInicio = fila.querySelector('input[name="horaInicio[]"]').value;
        const horaFin = fila.querySelector('input[name="horaFin[]"]').value;
        if (fecha) {
            datosDeTabla.push({ fecha, horaInicio, horaFin });
        }
    });
    localStorage.setItem('misHorasExtras', JSON.stringify(datosDeTabla));

    // Guarda los inputs principales
    const mesSeleccionado = document.getElementById('mesSeleccionado').value;
    const galenoValor = document.getElementById('galeno').value;
    const viaticosValor = document.getElementById('viaticos').value;

    localStorage.setItem('mesSeleccionado', mesSeleccionado);
    localStorage.setItem('galenoValor', galenoValor);
    localStorage.setItem('viaticosValor', viaticosValor);
}

function cargarDatos() {
    // Carga los inputs principales
    const mesGuardado = localStorage.getItem('mesSeleccionado');
    if (mesGuardado) {
        document.getElementById('mesSeleccionado').value = mesGuardado;
    }
    
    const galenoGuardado = localStorage.getItem('galenoValor');
    if (galenoGuardado) {
        document.getElementById('galeno').value = galenoGuardado;
    }

    const viaticosGuardado = localStorage.getItem('viaticosValor');
    if (viaticosGuardado) {
        document.getElementById('viaticos').value = viaticosGuardado;
    }
    
    // Carga los datos de la tabla
    const datosGuardados = localStorage.getItem('misHorasExtras');
    if (datosGuardados) {
        const datosDeTabla = JSON.parse(datosGuardados);
        const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; 

        datosDeTabla.forEach(dato => {
            agregarFila(dato);
        });
    }
}

//================================
// LÓGICA DE CÁLCULO DE HORAS
//================================

function calcularHoras(inputElemento) {
    const fila = inputElemento.closest('tr');
    const fechaInput = fila.querySelector('input[name="fecha[]"]');
    const inicioInput = fila.querySelector('input[name="horaInicio[]"]');
    const finInput = fila.querySelector('input[name="horaFin[]"]');
    const resultadoSpan = fila.querySelector('.sumaParcial');

    if (!fechaInput.value || !inicioInput.value || !finInput.value) {
        resultadoSpan.textContent = "0";
        calcularTotalHoras();
        guardarDatos();
        return;
    }

    const fechaInicio = new Date(`${fechaInput.value}T${inicioInput.value}`);
    const fechaFin = new Date(`${fechaInput.value}T${finInput.value}`);
    let diferenciaMs = fechaFin - fechaInicio;

    if (diferenciaMs < 0) {
        diferenciaMs += 24 * 60 * 60 * 1000;
    }

    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.round((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
    resultadoSpan.textContent = `${horas}h ${minutos}m`;

    calcularTotalHoras();
    guardarDatos();
}

function calcularTotalHoras() {
    const totalHorasSpan = document.getElementById('totalHoras');
    const todasLasSumasParciales = document.querySelectorAll('.sumaParcial');
    let totalMinutos = 0;

    todasLasSumasParciales.forEach(span => {
        const texto = span.textContent;
        const horasMatch = texto.match(/(\d+)h/);
        const minutosMatch = texto.match(/(\d+)m/);
        const horas = horasMatch ? parseInt(horasMatch[1], 10) : 0;
        const minutos = minutosMatch ? parseInt(minutosMatch[1], 10) : 0;
        totalMinutos += (horas * 60) + minutos;
    });

    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    totalHorasSpan.textContent = `Total del Mes: ${totalHoras}h ${minutosRestantes}m`;

    actualizarFondoPorHorasExtras();
}

//================================
// LÓGICA DE BOTONES
//================================

function agregarFila(datos = null) {
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    const nuevaFila = tbody.insertRow();
    const fecha = datos ? datos.fecha : '';
    const horaInicio = datos ? datos.horaInicio : '';
    const horaFin = datos ? datos.horaFin : '';
    nuevaFila.innerHTML = `
        <td><input type="date" name="fecha[]" value="${fecha}" onchange="calcularHoras(this)"></td>
        <td><input type="time" name="horaInicio[]" value="${horaInicio}" onchange="calcularHoras(this)"></td>
        <td><input type="time" name="horaFin[]" value="${horaFin}" onchange="calcularHoras(this)"></td>
        <td><p><span class="sumaParcial">0</span></p></td>
        <td><button class="delete-btn" onclick="eliminarFila(this)">X</button></td>
    `;
    if (datos) {
        const inputFecha = nuevaFila.querySelector('input[type="date"]');
        calcularHoras(inputFecha);
    }
}

function eliminarFila(boton) {
    const fila = boton.closest('tr');
    fila.parentNode.removeChild(fila);
    calcularTotalHoras();
    guardarDatos();
}

//================================
// CAMBIO DE FONDO SEGÚN HORAS EXTRAS
//================================

function actualizarFondoPorHorasExtras() {
    const totalHorasSpan = document.getElementById('totalHoras');
    const textoTotal = totalHorasSpan.textContent; // ej: "Total del Mes: 45h 30m"
    let imagenDeFondoUrl;

    // Extraemos el número de horas del texto
    const horasMatch = textoTotal.match(/(\d+)h/);
    const horasTotales = horasMatch ? parseInt(horasMatch[1], 10) : 0;
    
    // Definí tus umbrales de horas e imágenes
    if (horasTotales < 10) {
        // Menos de 10 horas
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/f7957c7d-15d8-4d69-881a-f433c29be69b-d1.png")'; // Fondo tranquilo
    } else if (horasTotales >= 10 && horasTotales < 30) {
        // Entre 10 y 29 horas
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/878b519c-3256-4757-83b4-3b1ac2a14a90-d2.png")'; // Fondo moderado
    } else {
        // 30 horas o más
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/1a1e09de-7fde-40ff-9829-9e4c6b690463-d3.png")'; // Fondo intenso/playa
    }

    // Aplica la imagen de fondo al body
    document.body.style.backgroundImage = imagenDeFondoUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}
 