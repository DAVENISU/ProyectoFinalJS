// Convertidor de Monedas 
//  // Autor: David Nieto


// Variables globales 
let historial = [];
let tasas = [];
const URLTasas = "./db/data.json"


// Referencias del DOM
const formConversor = document.getElementById('form-conversor');
const montoInput = document.getElementById('monto');
const monedaSelect = document.getElementById('moneda');
const resultadoDiv = document.getElementById('resultado');
const historialLista = document.getElementById('lista-historial');
const btnMostrarHistorial = document.getElementById('btn-mostrar-historial');
const btnBorrarHistorial = document.getElementById('btn-borrar-historial');

// --- Funciones ---
// Guarda el historial de conversiones en localStorage
function guardarHistorial(data) {
  localStorage.setItem('historial', JSON.stringify(data));
}

// leer hsitorial de datos desde local
function leerHistorial(dataInicial) {
  const convertidos = dataInicial.map(item => {
    const h = new Historial(item.tipo, item.categoria, item.fecha, item.monto);
    h.id = item.id;
    h.fechaCreacion = new Date(item.fechaCreacion);
    return h;
  });
  const maxId = Math.max(...convertidos.map(item => parseInt(item.id, 10)), 0);
  sincronizarContadorHistorial(maxId);
  return convertidos;
}

// mostrar la lista
function MostrarHistorialLista() {
  historialLista.innerHTML = '';

  if (historial.length === 0) {
    historialLista.innerHTML = '<li class="list-group-item text-muted">No hay conversiones registradas.</li>';
    return;
  }

  const ordenado = [...historial].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  ordenado.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div>
        <strong>${item.categoria}</strong> - ${item.fecha}
      </div>
      <span class="badge bg-primary">$${item.monto.toFixed(2)}</span>
    `;
    historialLista.appendChild(li);
  });
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

// Función nombrada para manejar la conversión
function manejarConversion(evento) {
  evento.preventDefault();

  const monto = parseFloat(montoInput.value);
  const moneda = monedaSelect.value;

  // condicional para manejar los errores de ingreso de información
  if (isNaN(monto) || monto <= 0) {
    resultadoDiv.textContent = 'Por favor ingresa un monto válido.';
    resultadoDiv.classList.replace('text-success', 'text-danger');
    Toastify({
        text: "Monto inválido",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
        background: "#dc3545",
        }
    }).showToast();
    return;
  }

  const tasa = tasas[moneda];
  const convertido = monto * tasa;
  resultadoDiv.textContent = `${monto.toLocaleString()} COP = ${convertido.toFixed(2)} ${moneda}`;
  resultadoDiv.classList.replace('text-danger', 'text-success');

  // Crear objeto historial
  const fechaHoy = new Date().toISOString().split('T')[0];
  const nuevo = new Historial('Conversión', moneda, fechaHoy, convertido);
  historial.push(nuevo);
  guardarHistorial(historial);
  MostrarHistorialLista();
}

// funcion para cargar opciones desde la base Json
function agregarmonedas(nomTasas) {
  monedaSelect.innerHTML = ''; // limpia el select

  for (const clave in nomTasas) {
    const option = document.createElement('option');
    option.value = clave;
    option.textContent = `${clave}`; // Podrías personalizar si quieres nombre largo
    monedaSelect.appendChild(option);
  }
}

function cargarHistorial() {
  const guardado = localStorage.getItem('historial');
  if (guardado) {
    historial = leerHistorial(JSON.parse(guardado));
  }
  MostrarHistorialLista();
}

// funcion asincrona de carga de tasas desde json
async function cargarTasas() {
  try{
    const response = await fetch(URLTasas);
    tasas = await response.json();
    localStorage.setItem("tasas", JSON.stringify(tasas))
    return tasas;
  } 
  catch(error) {
        Toastify({
        text: 'Error al cargar las tasas de la base de datos',
        duration: 5000,
        gravity: "top",
        position: "center",
        style: {
        background: "#dc3545",
        }
    }).showToast();
    tasas = {
              USD: 0.00025
            }
    return tasas;
  }
}
// función asincrona inicializadora
async function iniciar() {
  cargarHistorial();
  tasas = await cargarTasas()

  //Función para agregar divisas en html
  formConversor.addEventListener('submit', manejarConversion);

  // Mostrar Historial
  btnMostrarHistorial.addEventListener('click', alternarHistorial);

  // borrar Historial
  btnBorrarHistorial.addEventListener('click', borrarHistorial);

  // llenar moneda de pais
  agregarmonedas(tasas);

}
// inicializador
iniciar();




