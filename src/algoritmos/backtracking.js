// Los 8 movimientos posibles del caballo
const movX = [2, 1, -1, -2, -2, -1, 1, 2];
const movY = [1, 2, 2, 1, -1, -2, -2, -1];

// Función principal
export function solucionKnightsTour(NxN, posInicial, obstaculos) {
  
  let matriz = [];
  for (let i = 0; i < NxN; i++) {
    let fila = [];
    for (let j = 0; j < NxN; j++) {
      fila.push(0);
    }
    matriz.push(fila);
  }

  // Marcar obstáculos con -1
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      let coordenada = i + "," + j;
      if (obstaculos.includes(coordenada)) {
        matriz[i][j] = -1;
      }
    }
  }

  // Posición inicial
  let x = posInicial[0];
  let y = posInicial[1];

  // Validar que no sea obstáculo
  if (matriz[x][y] === -1) {
    return "Posición inicial inválida";
  }

  // Marcar primer movimiento
  matriz[x][y] = 1;

  // Contar casillas disponibles
  let totalCasillas = 0;
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      if (matriz[i][j] !== -1) {
        totalCasillas++;
      }
    }
  }

  // Ejecutar backtracking
  if (backtrack(x, y, 1, matriz, NxN, totalCasillas)) {
    return matriz;
  } else {
    return "No tiene solución";
  }
}

// Verifica si una casilla es válida
function esValida(x, y, matriz, NxN) {
  return (
    x >= 0 &&
    x < NxN &&
    y >= 0 &&
    y < NxN &&
    matriz[x][y] === 0
  );
}

// Cuenta opciones futuras 
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

// Backtracking principal
function backtrack(x, y, contMovimiento, matriz, NxN, totalCasillas) {
  
  if (contMovimiento === totalCasillas) {
    return true;
  }

  let movimientos = [];

  // Generar movimientos válidos
  for (let i = 0; i < 8; i++) {
    let nuevoX = x + movX[i];
    let nuevoY = y + movY[i];

    if (esValida(nuevoX, nuevoY, matriz, NxN)) {
      movimientos.push([nuevoX, nuevoY]);
    }
  }

  // Ordenar movimientos
  movimientos.sort((a, b) => {
    return (
      contarOpciones(a[0], a[1], matriz, NxN) -
      contarOpciones(b[0], b[1], matriz, NxN)
    );
  });

  // Intentar movimientos
  for (let [nuevoX, nuevoY] of movimientos) {
    matriz[nuevoX][nuevoY] = contMovimiento + 1;

    if (
      backtrack(
        nuevoX,
        nuevoY,
        contMovimiento + 1,
        matriz,
        NxN,
        totalCasillas
      )
    ) {
      return true;
    }

    // Deshacer movimiento
    matriz[nuevoX][nuevoY] = 0;
  }

  return false;
}

// =======================
// PRUEBAS
// =======================

// Prueba A (debe encontrar solución)
const resA = solucionKnightsTour(5, [0, 0], []);
console.table(resA);

// Prueba B (no tiene solución)
const resB = solucionKnightsTour(3, [0, 0], []);
console.log(resB);