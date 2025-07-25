// Clase Historial
class Historial {
  constructor(tipo, categoria, fecha, monto) {
    this.id = contador++;
    this.tipo = tipo;
    this.categoria = categoria;
    this.fecha = fecha;
    this.monto = monto;
    this.fechaCreacion = new Date();
  }
}

// Contador de resgistros de Id
let contador = 1;

function sincronizarContadorHistorial(ultimoId) {
  contador = ultimoId + 1;
}


// Mostrar/ocultar historial
function alternarHistorial() {
  historialLista.classList.toggle('d-none');
  btnMostrarHistorial.textContent = historialLista.classList.contains('d-none') ? 'Ver Historial' : 'Ocultar Historial';
}

// Borrar historial
function borrarHistorial() {
  historial = [];
  localStorage.removeItem('historial');
  MostrarHistorialLista();
  Toastify({
    text: 'Historial borrado',
    duration: 3000,
    gravity: 'top',
    position: 'center',
    style: {
      background: '#6c7d71ff',
    },
  }).showToast();
}