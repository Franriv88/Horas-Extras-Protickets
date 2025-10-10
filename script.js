//================================
// LÓGICA PRINCIPAL AL CARGAR LA PÁGINA
//================================

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
});


//================================
// LÓGICA DE GUARDADO Y CARGA (LocalStorage)
//================================

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
// LÓGICA DE CÁLCULO DE HORAS Y DÍA (FUNCIÓN RESTAURADA)
//================================

function calcularHorasYDia(inputElemento) {
    const fila = inputElemento.closest('tr');
    
    // --- LÓGICA PARA CALCULAR EL DÍA ---
    const fechaInput = fila.querySelector('input[name="fecha[]"]');
    const diaSemanaSpan = fila.querySelector('.dia-semana');
    
    if (fechaInput.value) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const fechaSeleccionada = new Date(fechaInput.value + 'T00:00');
        const numeroDia = fechaSeleccionada.getDay();
        diaSemanaSpan.textContent = dias[numeroDia];
    } else {
        diaSemanaSpan.textContent = "---";
    }

    // --- LÓGICA PARA CALCULAR HORAS ---
    const inicioInput = fila.querySelector('input[name="horaInicio[]"]');
    const finInput = fila.querySelector('input[name="horaFin[]"]');
    const resultadoSpan = fila.querySelector('.sumaParcial');

    if (!fechaInput.value || !inicioInput.value || !finInput.value) {
        resultadoSpan.textContent = "0";
    } else {
        const fechaInicio = new Date(`${fechaInput.value}T${inicioInput.value}`);
        const fechaFin = new Date(`${fechaInput.value}T${finInput.value}`);
        let diferenciaMs = fechaFin - fechaInicio;

        if (diferenciaMs < 0) {
            diferenciaMs += 24 * 60 * 60 * 1000;
        }

        const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
        const minutos = Math.round((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
        resultadoSpan.textContent = `${horas}h ${minutos}m`;
    }
    
    // Al final, actualizamos todo
    calcularTotalHoras();
    guardarDatos();
}


//================================
// LÓGICA DE SUMA TOTAL DE HORAS
//================================

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

    // ¡Esta es la llamada clave que activa el cambio de fondo!
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
        <td><span class="dia-semana">---</span></td>
        <td><input type="date" name="fecha[]" value="${fecha}" onchange="calcularHorasYDia(this)"></td>
        <td><input type="time" name="horaInicio[]" value="${horaInicio}" onchange="calcularHorasYDia(this)"></td>
        <td><input type="time" name="horaFin[]" value="${horaFin}" onchange="calcularHorasYDia(this)"></td>
        <td><p><span class="sumaParcial">0</span></p></td>
        <td><button class="delete-btn" onclick="eliminarFila(this)">X</button></td>
    `;
    
    if (datos && datos.fecha) {
        const inputFecha = nuevaFila.querySelector('input[type="date"]');
        calcularHorasYDia(inputFecha);
    }
}

// FUNCIÓN eliminarFila RESTAURADA
function eliminarFila(boton) {
    const fila = boton.closest('tr');
    fila.parentNode.removeChild(fila);
    
    // Llamadas necesarias para actualizar todo
    calcularTotalHoras();
    guardarDatos();
}


//================================
// CAMBIO DE FONDO SEGÚN HORAS EXTRAS
//================================

function actualizarFondoPorHorasExtras() {
    const totalHorasSpan = document.getElementById('totalHoras');
    const textoTotal = totalHorasSpan.textContent; 
    let imagenDeFondoUrl;

    const horasMatch = textoTotal.match(/(\d+)h/);
    const horasTotales = horasMatch ? parseInt(horasMatch[1], 10) : 0;
    
    if (horasTotales < 10) {
        // Fondo tranquilo
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/f7957c7d-15d8-4d69-881a-f433c29be69b-d1.png")'; 
    } else if (horasTotales >= 10 && horasTotales < 30) {
        // Fondo moderado
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/878b519c-3256-4757-83b4-3b1ac2a14a90-d2.png")'; 
    } else {
        // Fondo intenso/playa
        imagenDeFondoUrl = 'url("https://cdn.getcrowder.com/images/1a1e09de-7fde-40ff-9829-9e4c6b690463-d3.png")'; 
    }

    document.body.style.backgroundImage = imagenDeFondoUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
}