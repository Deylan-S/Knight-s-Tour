const MOV_X = [2, 1, -1, -2, -2, -1, 1, 2];
const MOV_Y = [1, 2, 2, 1, -1, -2, -2, -1];

// Cuenta caminos de A a B en exactamente K movimientos usando Programación Dinamica.
//
// Estado: dp[i][j] = cantidad de formas de llegar a (i,j) en el paso actual
// Transición: para cada celda con caminos, expandir los 8 movimientos del caballo
//
// Complejidad: O(K * N^2)
export function contarCaminosDP(N, origen, destino, K, obstaculos) {
  if (obstaculos === undefined) {
    obstaculos = [];
  }
 
  // Guardar obstáculos en un Set para búsqueda rápida
  let bloqueadas = new Set(obstaculos);
 
  // Verificar que origen y destino no sean obstáculos
  let origenKey = origen[0] + "," + origen[1];
  let destinoKey = destino[0] + "," + destino[1];
 
  if (bloqueadas.has(origenKey) || bloqueadas.has(destinoKey)) {
    return 0;
  }
 
  // Inicializar la tabla con ceros
  let dp = [];
  for (let i = 0; i < N; i++) {
    let fila = [];
    for (let j = 0; j < N; j++) {
      fila.push(0);
    }
    dp.push(fila);
  }
 
  // Hay 1 forma de estar en el origen con 0 movimientos
  dp[origen[0]][origen[1]] = 1;
 
  
  for (let paso = 0; paso < K; paso++) {
    
    let siguiente = [];
    for (let i = 0; i < N; i++) {
      let fila = [];
      for (let j = 0; j < N; j++) {
        fila.push(0);
      }
      siguiente.push(fila);
    }
 
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        // Si no hay caminos que pasen por aquí, saltar
        if (dp[i][j] === 0) {
          continue;
        }
 
        
        for (let m = 0; m < 8; m++) {
          let ni = i + MOV_X[m];
          let nj = j + MOV_Y[m];
 
          // Verificar que la celda destino sea válida
          if (ni < 0 || ni >= N) continue;
          if (nj < 0 || nj >= N) continue;
 
          let key = ni + "," + nj;
          if (bloqueadas.has(key)) continue;
 
         
          siguiente[ni][nj] = siguiente[ni][nj] + dp[i][j];
        }
      }
    }
 
    dp = siguiente;
  }
 
  return dp[destino[0]][destino[1]];
}
 
// Cuenta caminos por fuerza bruta
// Solo se usa para comparar con DP. Es mucho más lento (O(8^K)).
export function contarCaminosBruta(N, origen, destino, K, obstaculos) {
  if (obstaculos === undefined) {
    obstaculos = [];
  }
 
  let bloqueadas = new Set(obstaculos);
  let total = 0;
 
  // Verificar que origen y destino no estén bloqueados
  let origenKey = origen[0] + "," + origen[1];
  let destinoKey = destino[0] + "," + destino[1];
 
  if (bloqueadas.has(origenKey) || bloqueadas.has(destinoKey)) {
    return 0;
  }
 
  // Recorre el tablero contando todos los caminos posibles
  function dfs(x, y, pasosRestantes) {
    // Si no quedan pasos, verificar si llegamos al destino
    if (pasosRestantes === 0) {
      if (x === destino[0] && y === destino[1]) {
        total++;
      }
      return;
    }
 
    // Probar los 8 movimientos del caballo
    for (let m = 0; m < 8; m++) {
      let nx = x + MOV_X[m];
      let ny = y + MOV_Y[m];
 
      if (nx < 0 || nx >= N) continue;
      if (ny < 0 || ny >= N) continue;
 
      let key = nx + "," + ny;
      if (bloqueadas.has(key)) continue;
 
      dfs(nx, ny, pasosRestantes - 1);
    }
  }
 
  dfs(origen[0], origen[1], K);
 
  return total;
}