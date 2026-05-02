// Los 8 movimientos en L del caballo
const MOV_X = [2, 1, -1, -2, -2, -1, 1, 2];
const MOV_Y = [1, 2, 2, 1, -1, -2, -2, -1];

// Verifica si una celda está dentro del tablero y no ha sido visitada
function esValida(x, y, tablero, N) {
  if (x < 0 || x >= N) return false;
  if (y < 0 || y >= N) return false;
  if (tablero[x][y] !== 0) return false;
  return true;
}

// Cuenta cuántos movimientos futuros
// tiene una celda. Cuantos menos opciones, más prioritaria es.
function contarOpciones(x, y, tablero, N) {
  let count = 0;

  for (let i = 0; i < 8; i++) {
    let nx = x + MOV_X[i];
    let ny = y + MOV_Y[i];

    if (esValida(nx, ny, tablero, N)) {
      count++;
    }
  }

  return count;
}

// Backtracking recursivo con registro de pasos para la animación
function backtrack(x, y, movNum, tablero, N, totalCasillas, pasos, stats) {
  // Caso base: se visitaron todas las casillas libres
  if (movNum === totalCasillas) {
    return true;
  }

  // Generar todos los movimientos válidos desde la posición actual
  let candidatos = [];

  for (let i = 0; i < 8; i++) {
    let nx = x + MOV_X[i];
    let ny = y + MOV_Y[i];

    if (esValida(nx, ny, tablero, N)) {
      let opciones = contarOpciones(nx, ny, tablero, N);
      candidatos.push({ nx: nx, ny: ny, opciones: opciones });
    }
  }

  // Ordenar por Warnsdorff
  candidatos.sort(function(a, b) {
    return a.opciones - b.opciones;
  });

  // Intentar cada candidato
  for (let c = 0; c < candidatos.length; c++) {
    let nx = candidatos[c].nx;
    let ny = candidatos[c].ny;

    // Marcca la celda con el número de movimiento
    tablero[nx][ny] = movNum + 1;
    stats.intentos++;

    let snapshotAvance = [];
    for (let i = 0; i < N; i++) {
      snapshotAvance.push([...tablero[i]]);
    }

    pasos.push({
      tipo: "avance",
      x: nx,
      y: ny,
      numero: movNum + 1,
      tablero: snapshotAvance,
    });

    // Llamada recursiva
    let exito = backtrack(nx, ny, movNum + 1, tablero, N, totalCasillas, pasos, stats);

    if (exito) {
      return true;
    }

    // Retroceso: desmarcar la celda
    tablero[nx][ny] = 0;
    stats.retrocesos++;

    let snapshotRetroceso = [];
    for (let i = 0; i < N; i++) {
      snapshotRetroceso.push([...tablero[i]]);
    }

    pasos.push({
      tipo: "retroceso",
      x: nx,
      y: ny,
      numero: 0,
      tablero: snapshotRetroceso,
    });
  }

  return false;
}


export function solucionKnightsTour(N, posInicial, obstaculos) {
  // Crear tablero vacío
  let tablero = [];
  for (let i = 0; i < N; i++) {
    let fila = [];
    for (let j = 0; j < N; j++) {
      fila.push(0);
    }
    tablero.push(fila);
  }

  // Marcar obstáculos con -1
  for (let k = 0; k < obstaculos.length; k++) {
    let partes = obstaculos[k].split(",");
    let i = Number(partes[0]);
    let j = Number(partes[1]);

    if (i >= 0 && i < N && j >= 0 && j < N) {
      tablero[i][j] = -1;
    }
  }

  let x = posInicial[0];
  let y = posInicial[1];

  // Validar que la posición inicial sea usable
  if (x < 0 || x >= N || y < 0 || y >= N || tablero[x][y] === -1) {
    return "Posición inicial inválida.";
  }

  // Contar cuántas casillas están libres (sin obstáculos)
  let totalCasillas = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (tablero[i][j] !== -1) {
        totalCasillas++;
      }
    }
  }

  // Marcar posición inicial como primer movimiento
  tablero[x][y] = 1;

  let pasos = [];
  let stats = { intentos: 0, retrocesos: 0 };

  // Registrar el primer paso (posición inicial)
  let snapshotInicial = [];
  for (let i = 0; i < N; i++) {
    snapshotInicial.push([...tablero[i]]);
  }

  pasos.push({
    tipo: "avance",
    x: x,
    y: y,
    numero: 1,
    tablero: snapshotInicial,
  });

  // Ejecutar el algoritmo y medir tiempo
  let inicio = performance.now();
  let encontrado = backtrack(x, y, 1, tablero, N, totalCasillas, pasos, stats);
  let fin = performance.now();

  if (!encontrado) {
    return "No tiene solución con esta configuración.";
  }

  // Construir tablero final
  let tableroFinal = [];
  for (let i = 0; i < N; i++) {
    tableroFinal.push([...tablero[i]]);
  }

  return {
    pasos: pasos,
    tableroFinal: tableroFinal,
    stats: {
      intentos: stats.intentos,
      retrocesos: stats.retrocesos,
      tiempoMs: (fin - inicio).toFixed(2),
    },
  };
}