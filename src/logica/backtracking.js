// Los 8 movimientos posibles del caballo
const movX = [2, 1, -1, -2, -2, -1, 1, 2];
const movY = [1, 2, 2, 1, -1, -2, -2, -1];

// Variable que va a guardar el historial de movimientos del caballo
const historial = [];

// Prueba del programa

const tamaño = 5; // Tablero de 5x5
const inicio = [0, 0];
const obstaculos = ["1,1"];

console.log("######################################");
console.log(`Tablero: ${tamaño}x${tamaño}`);
console.log(`Inicio: [${inicio}]`);
console.log(`Obstáculos: ${obstaculos}`);

const resultado = solucionKnightsTour(tamaño, inicio, obstaculos);

if (typeof resultado === "string") {
  console.log(resultado);
} else {
  console.log(historial);
  console.log("Recorrido completado:");
  console.table(resultado);
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

  // Si retorna la matriz tiene solución, de lo contrario no la tiene
  if (backtrack(x, y, 1, matriz, NxN, totalCasillas)) {
    return matriz;
  } else {
    return "No tiene solución";
  }
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
function backtrack(x, y, contMovimiento, matriz, NxN, totalCasillas) {
  // Si ya se visitaron todas las casillas libres retorna true
  if (contMovimiento === totalCasillas) {
    return true;
  }

  // Prueba los 8 movimientos posibles del caballo
  for (let i = 0; i < 8; i++) {
    let nuevoX = x + movX[i];
    let nuevoY = y + movY[i];

    if (
      esValida(nuevoX, nuevoY, matriz, NxN) &&
      caminoDespejado(x, y, nuevoX, nuevoY, matriz)
    ) {
      matriz[nuevoX][nuevoY] = contMovimiento + 1;

      // Agrega el avance al historial de movimientos
      historial.push({
        x: nuevoX,
        y: nuevoY,
        mov: contMovimiento + 1,
        tipo: "avance",
      });

      // Llamada recursiva
      if (
        backtrack(
          nuevoX,
          nuevoY,
          contMovimiento + 1,
          matriz,
          NxN,
          totalCasillas,
        )
      ) {
        return true;
      }

      // Deshacer el movimiento
      matriz[nuevoX][nuevoY] = 0;
      // Agrega el retroceso al historial de movimientos
      historial.push({ x: nuevoX, y: nuevoY, mov: 0, tipo: "retroceso" });
    }
  }

  // Ninguno de los movimientos funcionó
  return false;
}
