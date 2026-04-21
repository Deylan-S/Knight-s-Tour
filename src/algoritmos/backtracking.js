// Los 8 movimientos posibles del caballo
const movX = [2, 1, -1, -2, -2, -1, 1, 2];
const movY = [1, 2, 2, 1, -1, -2, -2, -1];

// Se crea la matriz, la llena con 0's y llama a backtrack (no el de cieneguita)
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
  // Extraer x e y de posInicial, marca la casilla inicial como movimiento 1
  let x = posInicial[0];
  let y = posInicial[1];
  matriz[x][y] = 1;

  let totalCasillas = 0;
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      if (matriz[i][j] !== -1) {
        totalCasillas++;
      }
    }
  }

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

// Falta implementar que el caballo no pueda pasar sobre las casillas bloqueadas
function backtrack(x, y, contMovimiento, matriz, NxN, totalCasillas) {
  // Si ya se visitaron todas las casillas libres retorna true
  if (contMovimiento === totalCasillas) {
    return true;
  }

  // Prueba los 8 movimientos posibles del caballo
  for (let i = 0; i < 8; i++) {
    let nuevoX = x + movX[i];
    let nuevoY = y + movY[i];

    if (esValida(nuevoX, nuevoY, matriz, NxN)) {
      matriz[nuevoX][nuevoY] = contMovimiento + 1;
      console.log(matriz);

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
    }
  }

  // Ninguno de los movimientos funcionó
  return false;
}

// Prueba A
const resA = solucionKnightsTour(5, [0, 0], []);
console.table(resA);

// Prueba B (sin solución)
const resB = solveKnightsTour(3, [0, 0], []);
console.log(resB);
