


//================================
//      LÓGICA DE SUMA PARCIAL EN CADA CELDA
//================================





//================================
//      LÓGICA DE BOTONES
//================================
function agregarFila() {
    var tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    var nuevaFila = tbody.insertRow();

    var celda1 = nuevaFila.insertCell();
    var celda2 = nuevaFila.insertCell();
    var celda3 = nuevaFila.insertCell();
    var celda4 = nuevaFila.insertCell();
    var celda5 = nuevaFila.insertCell(); //celda con el botón de eliminar

    celda1.innerHTML = '<input type="date" name="fecha[]">';
    celda2.innerHTML = '<input type="time" name="horaInicio[]">';
    celda3.innerHTML = '<input type="time" name="horaFin[]">';
    celda4.innerHTML = '<p name="cantHoras[]">';
    celda5.innerHTML = '<button class="delete-btn" onclick="eliminarFila(this)">X</button>';
}

function eliminarFila(boton) {
    var fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}