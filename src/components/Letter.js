//Letters.js

import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";


function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters, gameOver } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const upperCorrectWord = correctWord.toUpperCase();

  // Calculate letter states based on the entire attempt
  const calculateLetterStates = () => {
    const result = { correct: false, almost: false, error: true };
    if (letter === "") return result; // Ignore empty

    // Check if the letter matches exactly (correct position)
    result.correct = upperCorrectWord[letterPos] === letter;
    if (result.correct) {
      result.error = false;
      return result;
    }

    // Check for 'almost' considering the count of the letter in both guessed and correct word
    const correctLetterCount = upperCorrectWord.split(letter).length - 1;
    const guessedLetterCountBeforeCurrent = board[attemptVal].slice(0, letterPos).filter(l => l === letter).length;
    const correctLetterCountBeforeCurrent = upperCorrectWord.slice(0, letterPos).split(letter).length - 1;

    result.almost = upperCorrectWord.includes(letter) && 
                    (guessedLetterCountBeforeCurrent < correctLetterCount || 
                     correctLetterCountBeforeCurrent < correctLetterCount);
    result.error = !result.almost;

    return result;
  };

  const { correct, almost, error } = calculateLetterStates();
  const letterState = (currAttempt.attempt > attemptVal || (gameOver.gameOver && currAttempt.attempt === attemptVal)) &&
                      (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (!correct && !almost) {
      setDisabledLetters(prev => [...prev, letter]);
    }
  }, [currAttempt.attempt, letter, correct, almost]);

  return (
    <div className="letter" id={letterState}>
      {letter}
    </div>
  );
}

export default Letter;
