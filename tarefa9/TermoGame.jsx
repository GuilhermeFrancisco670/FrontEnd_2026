import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { StrictMode } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { useState } from "https://esm.sh/react";


// Palavra secreta para o jogo 
const PALAVRA_SECRETA = "DACIO";

// Componente da Letra (Square)
function Square({ letter, color }) {
  return <div className={`square ${color || ''}`}>{letter}</div>;
}

// Componente da Linha (Row)
// Retorna um Fragment (<>) para agrupar os Squares
function Row({ guess, colors }) {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Square 
          key={i} 
          letter={guess ? guess[i] : ''} 
          color={colors ? colors[i] : ''} 
        />
      ))}
    </>
  );
}

// Componente do Teclado Virtual
function Keyboard({ onKeyClick, colorsByKey }) {
  const linhas = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <>
      {linhas.map((linha, i) => (
        <div key={i} className="board-row">
          {linha.map((tecla) => (
            <button 
              key={tecla} 
              className={`key ${colorsByKey[tecla] || ''}`} 
              onClick={() => onKeyClick(tecla)}
            >
              {tecla === 'BACKSPACE' ? '⌫' : tecla}
            </button>
          ))}
        </div>
      ))}
    </>
  );
}

// Componente Principal (Game)
// Fragment (<>) como elemento raiz 
function Game() {
  const [attempts, setAttempts] = useState(Array(6).fill(null)); // Array de 6 tentativas
  const [currentRow, setCurrentRow] = useState(0); // Linha atual
  const [currentCol, setCurrentCol] = useState(0); // Coluna atual (0 a 4)
  const [gameOver, setGameOver] = useState(false);
  const [colorMap, setColorMap] = useState({}); // Mapa de cores das teclas do teclado

  // Lógica para processar a tentativa (ENTER)
  const handleEnter = () => {
    if (currentCol !== 5) return; // Só valida se a linha estiver cheia

    const guess = attempts[currentRow].join('');
    const newAttempts = [...attempts];
    const colors = Array(5).fill('');
    const newColorMap = { ...colorMap };

    // Verifica cada letra
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      if (letter === PALAVRA_SECRETA[i]) {
        colors[i] = 'green';
        newColorMap[letter] = 'green';
      } else if (PALAVRA_SECRETA.includes(letter)) {
        colors[i] = 'yellow';
        if (newColorMap[letter] !== 'green') newColorMap[letter] = 'yellow';
      } else {
        colors[i] = 'gray';
        if (!newColorMap[letter]) newColorMap[letter] = 'gray';
      }
    }

    newAttempts[currentRow] = { guess, colors };
    setAttempts(newAttempts);
    setColorMap(newColorMap);

    // Verifica se ganhou ou perdeu
    if (guess === PALAVRA_SECRETA) {
      setGameOver('Parabéns! Você acertou!');
    } else if (currentRow === 5) {
      setGameOver(`Que pena! A palavra era ${PALAVRA_SECRETA}`);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    }
  };

  // Lógica de digitação
  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      handleEnter();
    } else if (key === 'BACKSPACE') {
      if (currentCol > 0) {
        const newAttempts = [...attempts];
        if (!newAttempts[currentRow]) newAttempts[currentRow] = [];
        newAttempts[currentRow].pop();
        setAttempts(newAttempts);
        setCurrentCol(currentCol - 1);
      }
    } else if (currentCol < 5 && key.length === 1 && key.match(/[A-Z]/i)) {
      const newAttempts = [...attempts];
      if (!newAttempts[currentRow]) newAttempts[currentRow] = [];
      newAttempts[currentRow][currentCol] = key;
      setAttempts(newAttempts);
      setCurrentCol(currentCol + 1);
    }
  };

  // Atalho para digitar com teclado físico
  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('BACKSPACE');
      else handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [currentRow, currentCol, attempts, gameOver]);

  // Renderização do tabuleiro
  const boardRows = Array(6).fill(null).map((_, rowIndex) => {
    const attemptData = attempts[rowIndex];
    const guess = attemptData ? attemptData.guess : null;
    const colors = attemptData ? attemptData.colors : null;
    return (
      <div key={rowIndex} className="board-row">
        <Row guess={guess} colors={colors} />
      </div>
    );
  });

  // O React Fragments é aplicado aqui: agrupa Título, Status, Tabuleiro e Teclado
  return (
    <>
      <div className="game-container">
        <h1>Jogo das Palavras</h1>
        {gameOver && <div className="status">{gameOver}</div>}
        
        <div className="board">
          {boardRows}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Keyboard onKeyClick={handleKeyPress} colorsByKey={colorMap} />
        </div>
      </div>
    </>
  );
}

// Renderização na DOM
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);