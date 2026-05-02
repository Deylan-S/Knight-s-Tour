import React, { useState, useEffect, useRef } from "react";
import { solucionKnightsTour } from "./algoritmos/backtracking";
import { contarCaminosDP, contarCaminosBruta } from "./logica/PdCaminos";
import caballoImg from "./assets/knight.png";
import "./App.css";

// Velocidades de animación en milisegundos por paso
const VELOCIDAD_MS = {
  rapido: 40,
  normal: 120,
  lento: 350,
};

export default function App() {
  // Configuración del tablero
  const [N, setN] = useState(5);
  const [velocidad, setVelocidad] = useState("normal");
  const [modoObstaculo, setModoObstaculo] = useState(false);
  const [obstaculos, setObstaculos] = useState(new Set());
  const [posInicial, setPosInicial] = useState(null);
  const [modoPosInicial, setModoPosInicial] = useState(false);

  // Estado visual del tablero
  const [tablero, setTablero] = useState([]);
  const [celdaActual, setCeldaActual] = useState(null);
  const [ultimoRetroceso, setUltimoRetroceso] = useState(null);
  const [resuelto, setResuelto] = useState(false);

  // Control de la animación
  const [animando, setAnimando] = useState(false);
  const [paso, setPaso] = useState(0);
  const [pasos, setPasos] = useState([]);
  const timerRef = useRef(null);

  // Estadísticas del algoritmo
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  // Estado del módulo de conteo de caminos
  const [dpOrigen, setDpOrigen] = useState("");
  const [dpDestino, setDpDestino] = useState("");
  const [dpK, setDpK] = useState(3);
  const [dpResultado, setDpResultado] = useState(null);
  const [pestana, setPestana] = useState("tablero");

  // Reiniciar todo cuando cambia el tamaño del tablero
  useEffect(function() {
    resetearTodo();
  }, [N]);

  // Función que limpia todo el estado de la aplicación
  function resetearTodo() {
    clearInterval(timerRef.current);

    let tableroVacio = [];
    for (let i = 0; i < N; i++) {
      let fila = [];
      for (let j = 0; j < N; j++) {
        fila.push(0);
      }
      tableroVacio.push(fila);
    }

    setTablero(tableroVacio);
    setObstaculos(new Set());
    setPosInicial(null);
    setCeldaActual(null);
    setUltimoRetroceso(null);
    setResuelto(false);
    setAnimando(false);
    setPaso(0);
    setPasos([]);
    setStats(null);
    setError("");
    setModoObstaculo(false);
    setModoPosInicial(false);
  }

  // Maneja el clic del usuario sobre una celda del tablero
  function handleCeldaClic(i, j) {
    if (animando || resuelto) return;

    let key = i + "," + j;

    // Modo de selección de posición inicial
    if (modoPosInicial) {
      if (obstaculos.has(key)) return;
      setPosInicial([i, j]);
      setModoPosInicial(false);
      return;
    }

    // Modo de colocación de obstáculos
    if (modoObstaculo) {
      // No se puede poner obstáculo sobre la posición inicial
      if (posInicial !== null && posInicial[0] === i && posInicial[1] === j) {
        return;
      }

      setObstaculos(function(prev) {
        let next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    }
  }

  // Ejecuta el algoritmo de backtracking y prepara la animación
  function resolver() {
    if (animando) return;

    setError("");
    setResuelto(false);
    setStats(null);
    setPasos([]);
    setPaso(0);

    let inicio = posInicial;
    if (inicio === null) {
      inicio = [0, 0];
    }

    let resultado = solucionKnightsTour(N, inicio, [...obstaculos]);

    if (typeof resultado === "string") {
      setError(resultado);
      return;
    }

    setPasos(resultado.pasos);
    setStats(resultado.stats);

    // Reiniciar el tablero visualmente antes de animar
    let tableroVacio = [];
    for (let i = 0; i < N; i++) {
      let fila = [];
      for (let j = 0; j < N; j++) {
        fila.push(0);
      }
      tableroVacio.push(fila);
    }

    setTablero(tableroVacio);
    setCeldaActual(null);
    setUltimoRetroceso(null);
    setAnimando(true);
    setPaso(0);
  }

  // Efecto que controla la animación paso a paso
  useEffect(function() {
    if (!animando || pasos.length === 0) return;

    timerRef.current = setInterval(function() {
      setPaso(function(prev) {
        let siguiente = prev + 1;

        // Si ya no hay más pasos, terminar la animación
        if (siguiente >= pasos.length) {
          clearInterval(timerRef.current);
          setAnimando(false);
          setResuelto(true);
          setCeldaActual(null);
          setUltimoRetroceso(null);
          return prev;
        }

        let p = pasos[siguiente];

        // Copiar el tablero del paso actual
        let nuevoTablero = [];
        for (let i = 0; i < p.tablero.length; i++) {
          nuevoTablero.push([...p.tablero[i]]);
        }
        setTablero(nuevoTablero);

        // Actualizar resaltado según tipo de paso
        if (p.tipo === "avance") {
          setCeldaActual([p.x, p.y]);
          setUltimoRetroceso(null);
        } else {
          setUltimoRetroceso([p.x, p.y]);
          setCeldaActual(null);
        }

        return siguiente;
      });
    }, VELOCIDAD_MS[velocidad]);

    return function() {
      clearInterval(timerRef.current);
    };
  }, [animando, pasos, velocidad]);

  // Determina las clases CSS de cada celda según su estado
  function claseCelda(i, j, val) {
    let key = i + "," + j;
    let esObs = obstaculos.has(key);
    let esInicial = posInicial !== null && posInicial[0] === i && posInicial[1] === j;
    let esActual = celdaActual !== null && celdaActual[0] === i && celdaActual[1] === j;
    let esRetroceso = ultimoRetroceso !== null && ultimoRetroceso[0] === i && ultimoRetroceso[1] === j;

    // Patrón ajedrez calculado por posición (i+j) para que funcione en cualquier N
    let esClara = (i + j) % 2 === 0;
    let clases = "celda " + (esClara ? "celda-clara" : "celda-oscura");

    if (esObs) {
      clases += " obs";
    } else if (esInicial && !resuelto && val === 0) {
      clases += " inicio";
    } else if (esActual) {
      clases += " actual";
    } else if (esRetroceso) {
      clases += " retroceso";
    } else if (resuelto && val > 0) {
      clases += " final";
    } else if (val > 0) {
      clases += " visitada";
    }

    return clases;
  }

  // Ejecuta el conteo de caminos con DP y fuerza bruta para comparar
  function calcularCaminos() {
    try {
      let partesOrigen = dpOrigen.trim().split(",");
      let partesDestino = dpDestino.trim().split(",");

      let origen = [Number(partesOrigen[0]), Number(partesOrigen[1])];
      let destino = [Number(partesDestino[0]), Number(partesDestino[1])];

      if (
        partesOrigen.length !== 2 ||
        partesDestino.length !== 2 ||
        isNaN(origen[0]) || isNaN(origen[1]) ||
        isNaN(destino[0]) || isNaN(destino[1])
      ) {
        setDpResultado({ error: "Formato inválido. Usa fila,columna (ej: 0,0)" });
        return;
      }

      // Calcular con programación dinámica
      let t0 = performance.now();
      let resultadoDP = contarCaminosDP(N, origen, destino, dpK, [...obstaculos]);
      let tDP = (performance.now() - t0).toFixed(3);

      // Calcular con fuerza bruta (solo si K no es muy grande)
      let resultadoBruta = "—";
      let tBruta = "—";

      if (dpK <= 8) {
        let t1 = performance.now();
        resultadoBruta = contarCaminosBruta(N, origen, destino, dpK, [...obstaculos]);
        tBruta = (performance.now() - t1).toFixed(3);
      }

      setDpResultado({
        dp: resultadoDP,
        bruta: resultadoBruta,
        tDP: tDP,
        tBruta: tBruta,
      });
    } catch (e) {
      setDpResultado({ error: "Formato inválido. Usa fila,columna (ej: 0,0)" });
    }
  }

  return (
    <div className="app">
      {/* Encabezado principal */}
      <header className="header">
        <div className="header-inner">
          <div className="titulo-bloque">
            <img src={caballoImg} alt="Caballo de ajedrez" className="caballo-icono" />
            <div>
              <h1 className="titulo">Knight's Tour</h1>
              <p className="subtitulo">Backtracking</p>
            </div>
          </div>
        </div>
      </header>

      {/* Pestañas de navegación */}
      <div className="tabs">
        <button
          className={"tab" + (pestana === "tablero" ? " activa" : "")}
          onClick={function() { setPestana("tablero"); }}
        >
          Tablero
        </button>
        <button
          className={"tab" + (pestana === "caminos" ? " activa" : "")}
          onClick={function() { setPestana("caminos"); }}
        >
          Conteo de Caminos
        </button>
      </div>

      {/* Pestaña principal: tablero y controles */}
      {pestana === "tablero" && (
        <div className="contenido">
          {/* Panel izquierdo con controles */}
          <aside className="panel-control">
            <section className="seccion">
              <label className="etiqueta">Tamaño del tablero</label>
              <div className="fila-input">
                <input
                  type="number"
                  min={4}
                  max={8}
                  value={N}
                  onChange={function(e) {
                    let valor = parseInt(e.target.value);
                    if (valor < 4) valor = 4;
                    if (valor > 8) valor = 8;
                    setN(valor);
                  }}
                  className="input-num"
                  disabled={animando}
                />
                <span className="dim-label">× {N}</span>
              </div>
            </section>

            <section className="seccion">
              <label className="etiqueta">Velocidad</label>
              <div className="chips">
                {["rapido", "normal", "lento"].map(function(v) {
                  return (
                    <button
                      key={v}
                      className={"chip" + (velocidad === v ? " chip-on" : "")}
                      onClick={function() { setVelocidad(v); }}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="seccion">
              <label className="etiqueta">Herramientas</label>
              <button
                className={"btn-tool" + (modoPosInicial ? " btn-tool-on" : "")}
                onClick={function() {
                  setModoPosInicial(!modoPosInicial);
                  setModoObstaculo(false);
                }}
                disabled={animando || resuelto}
              >
                {modoPosInicial ? "✓ Seleccionando inicio" : "Posición inicial"}
              </button>
              <button
                className={"btn-tool" + (modoObstaculo ? " btn-tool-on" : "")}
                onClick={function() {
                  setModoObstaculo(!modoObstaculo);
                  setModoPosInicial(false);
                }}
                disabled={animando || resuelto}
              >
                {modoObstaculo ? "✓ Marcando obstáculos" : "Obstáculos"}
              </button>
            </section>

            <section className="seccion">
              <button
                className="btn-resolver"
                onClick={resolver}
                disabled={animando}
              >
                {animando ? "Resolviendo…" : "▶ Resolver"}
              </button>
              <button
                className="btn-reset"
                onClick={resetearTodo}
                disabled={animando}
              >
                ↺ Reiniciar
              </button>
            </section>

            {/* Leyenda de colores */}
            <section className="seccion leyenda">
              <label className="etiqueta">Leyenda</label>
              <div className="leyenda-item">
                <span className="ley-box inicio-l" />
                Posición inicial
              </div>
              <div className="leyenda-item">
                <span className="ley-box actual-l" />
                Avance
              </div>
              <div className="leyenda-item">
                <span className="ley-box retroceso-l" />
                Retroceso
              </div>
              <div className="leyenda-item">
                <span className="ley-box final-l" />
                Solución
              </div>
              <div className="leyenda-item">
                <span className="ley-box obs-l" />
                Obstáculo
              </div>
            </section>

            {/* Estadísticas, visibles después de resolver */}
            {stats !== null && (
              <section className="seccion stats">
                <label className="etiqueta">Estadísticas</label>
                <div className="stat-fila">
                  <span>Movimientos</span>
                  <strong>{stats.intentos}</strong>
                </div>
                <div className="stat-fila">
                  <span>Retrocesos</span>
                  <strong>{stats.retrocesos}</strong>
                </div>
                <div className="stat-fila">
                  <span>Tiempo</span>
                  <strong>{stats.tiempoMs} ms</strong>
                </div>
              </section>
            )}
          </aside>

          {/* Panel derecho: tablero de juego */}
          <main className="panel-tablero">
            {error !== "" && (
              <div className="error-msg">{error}</div>
            )}
            {resuelto && (
              <div className="exito-msg">✓ Solución encontrada</div>
            )}

            <div
              className="tablero"
              style={{ gridTemplateColumns: "repeat(" + N + ", 1fr)" }}
            >
              {tablero.map(function(fila, i) {
                return fila.map(function(val, j) {
                  let key = i + "-" + j;
                  let keyObs = i + "," + j;
                  let esObs = obstaculos.has(keyObs);
                  let esInicial = posInicial !== null && posInicial[0] === i && posInicial[1] === j;

                  return (
                    <div
                      key={key}
                      className={claseCelda(i, j, val)}
                      onClick={function() { handleCeldaClic(i, j); }}
                    >
                      {esObs ? (
                        <span className="icono-obs">✕</span>
                      ) : esInicial && val === 0 && !resuelto ? (
                        <img src={caballoImg} alt="inicio" className="icono-caballo" />
                      ) : val > 0 ? (
                        <span className="num-celda">{val}</span>
                      ) : null}
                    </div>
                  );
                });
              })}
            </div>

            {modoPosInicial && (
              <p className="hint">Haz clic en una celda para establecer la posición inicial</p>
            )}
            {modoObstaculo && (
              <p className="hint">Haz clic en celdas para agregar o quitar obstáculos</p>
            )}
          </main>
        </div>
      )}

      {/* Pestaña de conteo de caminos con DP */}
      {pestana === "caminos" && (
        <div className="contenido-caminos">
          <div className="caminos-card">
            <h2 className="card-titulo">Conteo de caminos de longitud K</h2>
            <p className="card-desc">
              Calcula cuántos caminos distintos existen desde una celda A hasta
              una celda B en exactamente K movimientos de caballo, usando
              Programación Dinámica (O(K·N²)) y comparando con Fuerza Bruta (O(8^K)).
            </p>

            <div className="dp-form">
              <div className="dp-campo">
                <label>Origen (fila,col)</label>
                <input
                  className="dp-input"
                  placeholder="ej: 0,0"
                  value={dpOrigen}
                  onChange={function(e) { setDpOrigen(e.target.value); }}
                />
              </div>
              <div className="dp-campo">
                <label>Destino (fila,col)</label>
                <input
                  className="dp-input"
                  placeholder="ej: 2,1"
                  value={dpDestino}
                  onChange={function(e) { setDpDestino(e.target.value); }}
                />
              </div>
              <div className="dp-campo">
                <label>K movimientos</label>
                <input
                  className="dp-input"
                  type="number"
                  min={1}
                  max={20}
                  value={dpK}
                  onChange={function(e) { setDpK(parseInt(e.target.value)); }}
                />
              </div>
            </div>

            <p className="dp-hint">
              Tablero actual: {N}×{N}. El tamaño se configura en la pestaña Tablero.
            </p>

            <button className="btn-calcular" onClick={calcularCaminos}>
              Calcular
            </button>

            {dpResultado !== null && (
              <div className="dp-resultado">
                {dpResultado.error !== undefined ? (
                  <p className="error-msg">{dpResultado.error}</p>
                ) : (
                  <table className="tabla-resultado">
                    <thead>
                      <tr>
                        <th>Método</th>
                        <th>Caminos</th>
                        <th>Tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="fila-dp">
                        <td>Programación Dinámica</td>
                        <td><strong>{dpResultado.dp}</strong></td>
                        <td>{dpResultado.tDP} ms</td>
                      </tr>
                      <tr>
                        <td>
                          Fuerza Bruta
                          {dpK > 8 ? " (omitida, K>8)" : ""}
                        </td>
                        <td><strong>{dpResultado.bruta}</strong></td>
                        <td>{dpResultado.tBruta} ms</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}