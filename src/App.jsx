import React, { useState } from "react";
import { solucionKnightsTour } from "./logica/backtracking";
import "./App.css";

function App() {
  const [tablero, setTablero] = useState([]);
  const [error, setError] = useState("");
  const [valorN, setValorN] = useState(5);
  const [obstaculos, setObstaculos] = useState([]);

  const ejecutarAlgoritmo = () => {
    setError("");
    try {
      const resultado = solucionKnightsTour(valorN, [0, 0], []);

      if (typeof resultado === "string") {
        setError(resultado);
        setTablero([]);
      } else {
        setTablero(resultado);
      }
    } catch (e) {
      console.error(e);
      setError("Error al ejecutar la lógica. Revisa la consola.");
    }
  };

  return (
    <div className="container">
      <h1>Knigh's Tour</h1>

      <div className="seccion-input">
        <label>Tamaño del tablero (NxN): </label>
        <input
          type="number"
          value={valorN}
          onChange={(e) => setValorN(parseInt(e.target.value))}
          min="3"
          max="10"
        />
        <button onClick={ejecutarAlgoritmo}>Resolver</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${valorN}, 50px)` }}
      >
        {tablero.map((fila, i) =>
          fila.map((celda, j) => (
            <div key={`${i}-${j}`} className="cell">
              {celda > 0 ? celda : ""}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

export default App;
