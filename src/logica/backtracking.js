// Los 8 movimientos posibles del caballo
const movX = [2, 1, -1, -2, -2, -1, 1, 2];
const movY = [1, 2, 2, 1, -1, -2, -2, -1];

// Cuenta cuántos movimientos futuros tiene una casilla (heurística de Warnsdorff)
function contarOpciones(x, y, matriz, NxN) {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    let nx = x + movX[i];
    let ny = y + movY[i];
    if (esValida(nx, ny, matriz, NxN)) {
      count++;
    }
  }
  return count;
}

// Se crea la matriz, la llena con 0's, marca obstáculos, hace vlidaciones y llama a backtrack (no el de cieneguita)
// Va a retornar la matriz con los números del recorrido o un mensaje diciendo que no tiene solución
export function solucionKnightsTour(NxN, posInicial, obstaculos) {
  // Crea la matriz
  let matriz = [];
  for (let i = 0; i < NxN; i++) {
    let fila = [];
    for (let j = 0; j < NxN; j++) {
      fila.push(0);
    }
    matriz.push(fila);
  }

  // Marca los obstáculos
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      let coordenada = i.toString() + "," + j.toString();
      if (obstaculos.includes(coordenada)) {
        matriz[i][j] = -1;
      }
    }
  }

  // Extraer x e y de posInicial
  let x = posInicial[0];
  let y = posInicial[1];

  // Valida que la posición inicial esté dentro del tablero
  if (x < 0 || x >= NxN || y < 0 || y >= NxN) {
    return "Posición inicial fuera del tablero";
  }
  // Valida que la posición inicial no sea una casilla bloqueada
  if (matriz[x][y] === -1) {
    return "La posición inicial está bloqueada";
  }

  // Marca la casilla inicial como movimiento 1
  matriz[x][y] = 1;

  // Recorre toda la matriz y cuenta las casillas que se deben visitar (excluyendo las obstaculizadas)
  let totalCasillas = 0;
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      if (matriz[i][j] !== -1) {
        totalCasillas++;
      }
    }
  }

  // Objetos para guardar pasos y estadísticas que necesita la interfaz
  let historial = [];
  let stats = { intentos: 0, retrocesos: 0 };

  // Guardar el paso inicial
  let snapshotInicial = [];
  for (let i = 0; i < NxN; i++) {
    snapshotInicial.push([...matriz[i]]);
  }
  historial.push({ tipo: "avance", x: x, y: y, numero: 1, tablero: snapshotInicial });

  // Si retorna la matriz tiene solución, de lo contrario no la tiene
  let inicio = performance.now();
  let encontrado = backtrack(x, y, 1, matriz, NxN, totalCasillas, historial, stats);
  let fin = performance.now();

  if (!encontrado) {
    return "No tiene solución";
  }

  let tableroFinal = [];
  for (let i = 0; i < NxN; i++) {
    tableroFinal.push([...matriz[i]]);
  }

  return {
    pasos: historial,
    tableroFinal: tableroFinal,
    stats: {
      intentos: stats.intentos,
      retrocesos: stats.retrocesos,
      tiempoMs: (fin - inicio).toFixed(2),
    },
  };
}

// Verifica que las coordenadas estén dentro del tablero, que la casilla no haya sido visitada todavía
// y que no haya un obstáculo en la casilla
function esValida(x, y, matriz, NxN) {
  if (x >= 0 && x < NxN && y >= 0 && y < NxN) {
    if (matriz[x][y] === 0) {
      return true;
    }
  }
  return false;
}

// Verifica que las coordenadas dadas estén dentro de la matriz
function dentroDelTablero(coordenadaX, coordenadaY, NxN) {
  if (
    coordenadaX < 0 ||
    coordenadaY < 0 ||
    coordenadaX >= NxN ||
    coordenadaY >= NxN
  ) {
    return false;
  }
  return true;
}

// Verfica que no hayan casillas bloqueadas en el recorrido de las coordenadas de salida hasta las de llegada
function caminoDespejado(x, y, destinoX, destinoY, matriz) {
  const NxN = matriz.length;
  let paso1X, paso1Y, paso2X, paso2Y;

  // Se saca la cantidad de movimientos que se van a hacer en X y en Y restandole la posición inicial a la posición destino
  const distanciaX = destinoX - x;
  const distanciaY = destinoY - y;

  // Se hace primero el recorrido de la distancia más larga
  if (distanciaX === 2 || distanciaX === -2) {
    paso1X = x + distanciaX / 2;
    paso1Y = y;
    paso2X = x + distanciaX;
    paso2Y = y;
  } else {
    paso1X = x;
    paso1Y = y + distanciaY / 2;
    paso2X = x;
    paso2Y = y + distanciaY;
  }

  // Se verifica que al hacer el recorrido no se salga del tablero
  if (
    !dentroDelTablero(paso1X, paso1Y, NxN) ||
    !dentroDelTablero(paso2X, paso2Y, NxN)
  ) {
    return false;
  }

  // Verifica que no haya una casilla bloqueada en el camino (el destino libre se verifica en otra función (esValida))
  if (matriz[paso1X][paso1Y] === -1 || matriz[paso2X][paso2Y] === -1) {
    return false;
  }

  return true;
}

// Intenta hacer todos los movimientos posibles mientras verifica que sean válidos hasta recorrer todo el tablero,
// en caso de que no haya solucón lo notifica
function backtrack(x, y, contMovimiento, matriz, NxN, totalCasillas, historial, stats) {
  // Si ya se visitaron todas las casillas libres retorna true
  if (contMovimiento === totalCasillas) {
    return true;
  }

  // Genera los candidatos válidos y los ordena con Warnsdorff
  let candidatos = [];
  for (let i = 0; i < 8; i++) {
    let nuevoX = x + movX[i];
    let nuevoY = y + movY[i];
    if (esValida(nuevoX, nuevoY, matriz, NxN) && caminoDespejado(x, y, nuevoX, nuevoY, matriz)) {
      candidatos.push({ nuevoX: nuevoX, nuevoY: nuevoY, opciones: contarOpciones(nuevoX, nuevoY, matriz, NxN) });
    }
  }
  candidatos.sort(function(a, b) {
    return a.opciones - b.opciones;
  });

  // Prueba los 8 movimientos posibles del caballo
  for (let c = 0; c < candidatos.length; c++) {
    let nuevoX = candidatos[c].nuevoX;
    let nuevoY = candidatos[c].nuevoY;

    matriz[nuevoX][nuevoY] = contMovimiento + 1;
    stats.intentos++;

    // Agrega el avance al historial de movimientos
    let snapshotAvance = [];
    for (let i = 0; i < NxN; i++) {
      snapshotAvance.push([...matriz[i]]);
    }
    historial.push({
      x: nuevoX,
      y: nuevoY,
      mov: contMovimiento + 1,
      tipo: "avance",
      numero: contMovimiento + 1,
      tablero: snapshotAvance,
    });

    // Llamada recursiva
    if (backtrack(nuevoX, nuevoY, contMovimiento + 1, matriz, NxN, totalCasillas, historial, stats)) {
      return true;
    }

    // Deshacer el movimiento
    matriz[nuevoX][nuevoY] = 0;
    stats.retrocesos++;

    // Agrega el retroceso al historial de movimientos
    let snapshotRetroceso = [];
    for (let i = 0; i < NxN; i++) {
      snapshotRetroceso.push([...matriz[i]]);
    }
    historial.push({
      x: nuevoX,
      y: nuevoY,
      mov: 0,
      tipo: "retroceso",
      numero: 0,
      tablero: snapshotRetroceso,
    });
  }

  // Ninguno de los movimientos funcionó
  return false;
}