// Se crea la matriz, la llena con 0's y llama a backtrack (no el de cieneguita)
// Va a retornar la matriz con los números del recorrido o un mensaje diciendo que no tiene solución
export function solveKnightsTour(NxN, posInicial, obstaculos) {
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
      let x = i;
      let y = j;
      let xString = x.toString();
      let yString = y.toString();

      let cordenada = xString + "," + yString;

      if (obstaculos.includes(coordenada)) {
        matriz[i][j] = -1;
      }
    }
  }
  backtrack(x, y, 0, matriz);
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

function backtrack(x, y, contMovimiento, matriz) {}

// Verifica que se hayan visitado todas las casillas
function verificarVisitas(NxN, matriz) {
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      if (matriz[i][j] === 0) {
        return false;
      }
    }
  }
}

function prueba(NxN, obstaculos) {
  let matriz = [];
  for (let i = 0; i < NxN; i++) {
    let fila = [];
    for (let j = 0; j < NxN; j++) {
      fila.push(0);
    }
    matriz.push(fila);
  }
  for (let i = 0; i < NxN; i++) {
    for (let j = 0; j < NxN; j++) {
      let x = i;
      let y = j;
      let xString = x.toString();
      let yString = y.toString();

      let coordenada = xString + "," + yString;

      if (obstaculos.includes(coordenada)) {
        matriz[i][j] = -1;
      }
    }
  }
  return matriz;
}

console.log(prueba(5, ["0,2", "1,1", "3,3", "4,0"]));
