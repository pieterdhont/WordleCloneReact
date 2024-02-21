//GameOver.js

import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const { gameOver, currAttempt, correctWord } = useContext(AppContext);
  return (
    <div className={`gameOver-backdrop ${gameOver.gameOver ? 'show' : ''}`}>
      <div className="gameOver-content">
        <h3>{gameOver.guessedWord ? "Congratulations! You've guessed the word correctly!" : "You lost. Try again next time!"}</h3>
        <h1>Correct word: {correctWord.toUpperCase()}</h1>
        {gameOver.guessedWord && <h3>You guessed in: {currAttempt.attempt + 1 } attempts</h3>}
        
      </div>
    </div>
  );
}

export default GameOver;
