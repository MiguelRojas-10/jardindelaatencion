let nombreJugador = '';
let secuencia = [];
let plantas = [];
let plantasRegadas = 0;
let tiempo = 120;
let juegoActivo = true;
let timer;
let puntos = 0;
let puntosIntruso = 0;
let indiceAcertijo = 0;
let puntosAcertijo = 0;

// 🎵 sonidos
const sonidoCorrecto = new Audio('sounds/correcto.mp3');
sonidoCorrecto.volume = 0.1;
const sonidoError = new Audio('sounds/error.mp3');
const sonidoVictoria = new Audio('sounds/victoria.mp3');
const musicaFondo = new Audio('sounds/fondo.mp3');
musicaFondo.loop = true;
musicaFondo.volume = 0.2;
sonidoVictoria.volume = 0.2;
sonidoError.volume = 0.3;

const frutasDisponibles = [
  "images/frutas/manzana.png",
  "images/frutas/banana.png",
  "images/frutas/uva.png",
  "images/frutas/fresa.png",
  "images/frutas/sandia.png"
];

const grupos = [
  { emoji: "images/frutas/manzana.png", intruso: "images/intrusos/zapato.png" },
  { emoji: "images/frutas/banana.png", intruso: "images/intrusos/ladrillo.png" },
  { emoji: "images/frutas/uva.png", intruso: "images/intrusos/lapiz.png" },
  { emoji: "images/frutas/fresa.png", intruso: "images/intrusos/caja.png" },
  { emoji: "images/frutas/sandia.png", intruso: "images/intrusos/jugo.png" }
];

const acertijos = [
  { pregunta: 'Tengo agujas pero no pincho. ¿Qué soy?', opciones: ['Un cactus', 'Un reloj', 'Una brújula'], correcta: 'Un reloj' },
  { pregunta: 'Vuelo sin alas, lloro sin ojos. ¿Qué soy?', opciones: ['El viento', 'El fuego', 'El pensamiento'], correcta: 'El viento' },
  { pregunta: 'Mientras más me quitas, más grande soy. ¿Qué soy?', opciones: ['Un hoyo', 'El tiempo', 'La sombra'], correcta: 'Un hoyo' },
  { pregunta: 'Tiene dientes pero no muerde. ¿Qué es?', opciones: ['Una sierra', 'Un peine', 'Una llave'], correcta: 'Un peine' },
  { pregunta: 'Tiene patas pero no camina. ¿Qué es?', opciones: ['Una silla', 'Una mesa', 'Ambas'], correcta: 'Ambas' },
  { pregunta: 'Si me nombras, desaparezco. ¿Qué soy?', opciones: ['El silencio', 'El secreto', 'El miedo'], correcta: 'El silencio' },
  { pregunta: 'No es ser vivo, pero crece. ¿Qué es?', opciones: ['Una piedra', 'El fuego', 'El humo'], correcta: 'El fuego' },
  { pregunta: 'Tiene ojos pero no ve. ¿Qué es?', opciones: ['Un huracán', 'Una papa', 'Una red'], correcta: 'Una papa' },
  { pregunta: 'Si tengo, no comparto. Si comparto, ya no tengo. ¿Qué es?', opciones: ['Un secreto', 'El dinero', 'El tiempo'], correcta: 'Un secreto' },
  { pregunta: 'Es tuyo, pero otros lo usan más que tú. ¿Qué es?', opciones: ['Tu nombre', 'Tu casa', 'Tu ropa'], correcta: 'Tu nombre' },
  { pregunta: 'Siempre va hacia adelante pero nunca se detiene. ¿Qué es?', opciones: ['El reloj', 'El viento', 'El tiempo'], correcta: 'El tiempo' },
  { pregunta: 'Cuanto más tienes, menos ves. ¿Qué es?', opciones: ['La oscuridad', 'El miedo', 'El humo'], correcta: 'La oscuridad' },
  { pregunta: 'Sube pero nunca baja. ¿Qué es?', opciones: ['La edad', 'El sol', 'La marea'], correcta: 'La edad' },
  { pregunta: 'Es más ligero que una pluma pero ni el hombre más fuerte puede sostenerlo por mucho. ¿Qué es?', opciones: ['La respiración', 'La palabra', 'La mirada'], correcta: 'La respiración' },
  { pregunta: 'Puedes romperme sin tocarme. ¿Qué soy?', opciones: ['Una promesa', 'Un cristal', 'El silencio'], correcta: 'Una promesa' }
];

// ------------------ INICIO ------------------
window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('nombreUsuario');
  const boton = document.getElementById('botonJugar');

  input.addEventListener('input', () => {
    boton.disabled = input.value.trim() === '';
  });

  boton.addEventListener('click', iniciarJuegoCompleto);
});

function iniciarJuegoCompleto() {
  nombreJugador = document.getElementById('nombreUsuario').value.trim();
  if (nombreJugador === '') return;

  document.getElementById('pantalla-inicial').style.display = 'none';
  document.getElementById('contenido-juego').classList.remove('oculto');

  musicaFondo.play();
  mostrarJuego(1); // arranca en el primer juego
}

// ------------------ CAMBIO DE JUEGO ------------------
function mostrarJuego(num) {
  document.querySelectorAll('.juego').forEach(div => div.classList.add('oculto'));
  document.getElementById('juego' + num).classList.remove('oculto');

  if (num === 1) iniciarJuego();
  if (num === 2) iniciarFrutas();
  if (num === 3) iniciarIntruso();
  if (num === 4) {
    indiceAcertijo = 0;
    puntosAcertijo = 0;
    document.getElementById('puntos-acertijo').textContent = `Puntos: 0`;
    document.getElementById('boton-siguiente-acertijo').style.display = 'inline-block';
    mostrarAcertijo();
  }
}

// ------------------ JUEGO 1 ------------------
function iniciarJuego() {
  juegoActivo = true;
  clearInterval(timer);

  const juego = document.getElementById('juego');
  juego.innerHTML = '';
  document.getElementById('mensaje').textContent = '';
  plantasRegadas = 0;
  secuencia = [];
  plantas = [];

  document.getElementById('juego-frutas').classList.add('bloqueado');
  document.getElementById('reiniciar-frutas').disabled = true;

  while (secuencia.length < 8) {
    const num = Math.floor(Math.random() * 90) + 10;
    if (!secuencia.includes(num)) secuencia.push(num);
  }

  const ordenCorrecto = [...secuencia].sort((a, b) => a - b);

  secuencia.forEach(num => {
    const div = document.createElement('div');
    div.className = 'planta';
    div.textContent = num;
    div.onclick = () => regarPlanta(div, num, ordenCorrecto);
    juego.appendChild(div);
    plantas.push(div);
  });

  tiempo = 120;
  document.getElementById('tiempo').textContent = tiempo;
  timer = setInterval(() => {
    tiempo--;
    document.getElementById('tiempo').textContent = tiempo;
    if (tiempo <= 0) {
      clearInterval(timer);
      finalizarJuego(false);
    }
  }, 1000);
}

function regarPlanta(div, num, ordenCorrecto) {
  if (!juegoActivo) return;

  if (num === ordenCorrecto[plantasRegadas]) {
    div.classList.add('regada');
    div.onclick = null;
    plantasRegadas++;

    sonidoCorrecto.currentTime = 0;
    sonidoCorrecto.play();

    if (plantasRegadas === ordenCorrecto.length) {
      finalizarJuego(true);
    }
  } else {
    juegoActivo = false;
    sonidoError.currentTime = 0;
    sonidoError.play();
    finalizarJuego(false);
  }
} // ✅ cierre correcto de regarPlanta

function finalizarJuego(ganaste) {
  clearInterval(timer);
  const mensaje = document.getElementById('mensaje');
  if (ganaste) {
    mensaje.textContent = '¡Muy bien! 🌟 Has completado el jardín correctamente.';
    document.getElementById('juego-frutas').classList.remove('bloqueado');
    document.getElementById('reiniciar-frutas').disabled = false;
    document.getElementById('next1').disabled = false;
  } else {
    mensaje.textContent = '❌ Te equivocaste. Pulsa "Reiniciar juego" para intentarlo de nuevo.';
    plantas.forEach(planta => {
      planta.onclick = null;
      planta.style.opacity = '0.6';
      planta.style.cursor = 'not-allowed';
      planta.style.filter = 'grayscale(100%)';
    });
  }
}

// ------------------ JUEGO 2 ------------------
function iniciarFrutas() {
  const contenedor = document.getElementById('juego-frutas');
  const puntosTexto = document.getElementById('puntos');
  contenedor.innerHTML = '';

  puntosTexto.textContent = `Puntos: ${puntos}`; // mostramos el acumulado

  for (let i = 0; i < 24; i++) {
    const fruta = document.createElement('div');
    fruta.className = 'fruta';

    const imgSrc = frutasDisponibles[Math.floor(Math.random() * frutasDisponibles.length)];
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = "fruta";
    img.style.width = "50px";
    img.style.height = "50px";

    fruta.appendChild(img);

    fruta.onclick = () => {
      if (imgSrc.includes("manzana")) {
  puntos++;
  fruta.style.backgroundColor = '#A9DFBF';
  sonidoCorrecto.currentTime = 0;
  sonidoCorrecto.play();
} else {
  puntos--;
  fruta.style.backgroundColor = '#F1948A';
  sonidoError.currentTime = 0;
  sonidoError.play();
}

      fruta.onclick = null;
      puntosTexto.textContent = `Puntos: ${puntos}`;

      // si llegó a 20 puntos -> habilitar siguiente juego
      if (puntos >= 20) {
  document.getElementById('next2').disabled = false;
}
 else {
        // 🔄 cuando termine la tanda, reiniciar frutas para seguir jugando
        const todasSeleccionadas = [...contenedor.children].every(f => f.onclick === null);
        if (todasSeleccionadas) {
          setTimeout(() => iniciarFrutas(), 800); // pequeño delay antes de regenerar
        }
      }
    };

    contenedor.appendChild(fruta);
  }
}
// ------------------ JUEGO 3 ------------------
function iniciarIntruso() {
  const contenedor = document.getElementById('busca-intruso');
  const puntosTexto = document.getElementById('puntos-intruso');
  contenedor.innerHTML = '';

  const grupo = grupos[Math.floor(Math.random() * grupos.length)];
  // Creamos un arreglo con 9 imágenes iguales (del grupo)
  const items = Array(9).fill(grupo.emoji);
  const intrusoIndex = Math.floor(Math.random() * 9);
  items[intrusoIndex] = grupo.intruso; // reemplazamos uno por el intruso

  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'intruso-item';

    // crear imagen en lugar de texto
    const img = document.createElement('img');
    img.src = item;    // item ahora debe ser una ruta de imagen
    img.alt = "objeto";
    img.style.width = "60px";
    img.style.height = "60px";

    div.appendChild(img);

    div.onclick = () => {
  if (index === intrusoIndex) {
    puntosIntruso++;
    sonidoCorrecto.currentTime = 0;
    sonidoCorrecto.play();
  } else {
    puntosIntruso--;
    sonidoError.currentTime = 0;
    sonidoError.play();
  }

  puntosTexto.textContent = `Puntos: ${puntosIntruso}`;

  if (puntosIntruso >= 10) {
    document.getElementById('next3').disabled = false;
  }

  // 🔽 Espera un poquito ANTES de refrescar para que se escuche
  setTimeout(() => iniciarIntruso(), 300);
};

    contenedor.appendChild(div);
  });

  puntosTexto.textContent = `Puntos: ${puntosIntruso}`;
}

// ------------------ JUEGO 4 ------------------
function mostrarAcertijo() {
  const actual = acertijos[indiceAcertijo];
  document.getElementById('pregunta-acertijo').textContent = actual.pregunta;

  const opcionesDiv = document.getElementById('opciones-acertijo');
  opcionesDiv.innerHTML = '';
  actual.opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op;
    btn.onclick = () => verificarRespuesta(op);
    opcionesDiv.appendChild(btn);
  });

  document.getElementById('resultado-acertijo').textContent = '';
}

function verificarRespuesta(opcionElegida) {
  const actual = acertijos[indiceAcertijo];
  const resultado = document.getElementById('resultado-acertijo');
  const botones = Array.from(document.querySelectorAll('#opciones-acertijo button'));

  if (opcionElegida === actual.correcta) {
  puntosAcertijo++;
  resultado.textContent = '✅ ¡Correcto!';
  resultado.style.color = 'green';
  sonidoCorrecto.currentTime = 0;
  sonidoCorrecto.play();
} else {
  puntosAcertijo--;
  resultado.textContent = `❌ Incorrecto. La respuesta correcta era: "${actual.correcta}".`;
  resultado.style.color = 'red';
  sonidoError.currentTime = 0;
  sonidoError.play();
}


  document.getElementById('puntos-acertijo').textContent = `Puntos: ${puntosAcertijo}`;

  botones.forEach(btn => {
    if (btn.textContent === actual.correcta) {
      btn.style.backgroundColor = '#A9DFBF';
      btn.style.fontWeight = 'bold';
    } else {
      btn.style.opacity = 0.6;
    }
    btn.disabled = true;
  });
}

function siguienteAcertijo() {
  indiceAcertijo++;

  if (indiceAcertijo >= acertijos.length) {
    // Reproduce sonido de victoria
    sonidoVictoria.currentTime = 0;
    sonidoVictoria.play();

    // Oculta todo lo relacionado con el juego 4
    mostrarDiploma();
    return;
  }

  mostrarAcertijo();
}

function mostrarDiploma() {
  // Oculta los elementos del juego 4
  document.querySelector('#juego4 h2').style.display = 'none';
  document.querySelector('#juego4 .instruccion-juego').style.display = 'none';
  document.getElementById('pregunta-acertijo').style.display = 'none';
  document.getElementById('opciones-acertijo').style.display = 'none';
  document.getElementById('resultado-acertijo').style.display = 'none';
  document.getElementById('puntos-acertijo').style.display = 'none';
  document.getElementById('boton-siguiente-acertijo').style.display = 'none';

  // Muestra el diploma
  const diploma = document.getElementById('diploma');
  diploma.classList.remove('oculto');
  diploma.style.display = 'block';

  // Personaliza con nombre y puntaje
  document.getElementById('nombre-diploma').textContent = nombreJugador;
  document.getElementById('puntaje-final').textContent = puntosAcertijo;
}
