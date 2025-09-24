


//================================
//      LÓGICA DE SUMA PARCIAL EN CADA CELDA
//================================
function calcularHoras(inputElemento) {
    // 1. Encuentra la fila (tr) donde ocurrió el cambio
    const fila = inputElemento.closest('tr');

    // 2. Busca los elementos necesarios SÓLO dentro de esa fila
    const fechaInput = fila.querySelector('input[name="fecha[]"]');
    const inicioInput = fila.querySelector('input[name="horaInicio[]"]');
    const finInput = fila.querySelector('input[name="horaFin[]"]');
    const resultadoSpan = fila.querySelector('.sumaParcial');

    // 3. Verifica si tenemos todos los datos para calcular
    if (!fechaInput.value || !inicioInput.value || !finInput.value) {
        resultadoSpan.textContent = "0"; // Si falta un dato, el resultado es 0
        return;
    }

    // 4. Crea objetos de fecha completos para un cálculo preciso
    const fechaInicio = new Date(`${fechaInput.value}T${inicioInput.value}`);
    const fechaFin = new Date(`${fechaInput.value}T${finInput.value}`);

    // 5. Calcula la diferencia en milisegundos
    let diferenciaMs = fechaFin - fechaInicio;

    // Si el resultado es negativo, significa que cruzó la medianoche (ej: 22:00 a 02:00)
    if (diferenciaMs < 0) {
        diferenciaMs += 24 * 60 * 60 * 1000; // Sumamos 24 horas
    }

    // 6. Convierte la diferencia a horas y minutos
    const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
    const minutos = Math.round((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

    // 7. Muestra el resultado en el span de la fila
    resultadoSpan.textContent = `${horas}h ${minutos}m`;
}




//================================
//      LÓGICA DE BOTONES
//================================
function agregarFila() {
    // Selecciona el cuerpo de la tabla
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    
    // Inserta una nueva fila al final
    const nuevaFila = tbody.insertRow();

    // Asigna el HTML completo de la fila, incluyendo los eventos onchange
    // Esto asegura que los nuevos inputs llamen a la función de cálculo
    nuevaFila.innerHTML = `
        <td><input type="date" name="fecha[]" onchange="calcularHoras(this)"></td>
        <td><input type="time" name="horaInicio[]" onchange="calcularHoras(this)"></td>
        <td><input type="time" name="horaFin[]" onchange="calcularHoras(this)"></td>
        <td><p><span class="sumaParcial" name="cantHoras[]">0</span></p></td>
        <td><button class="delete-btn" onclick="eliminarFila(this)">X</button></td>
    `;
}

function eliminarFila(boton) {
    var fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}