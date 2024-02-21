import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters, gameOver } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const upperCorrectWord = correctWord.toUpperCase();

  // Check if the letter matches exactly (correct position)
  const correct = upperCorrectWord[letterPos] === letter;

  // Check if the letter is present in the correct word but in the wrong position
  const almost = !correct && letter !== "" && upperCorrectWord.includes(letter);

  // Enhanced logic for 'almost' to consider the letter frequency in the correct word vs. the guess
  const correctLetterFrequency = upperCorrectWord.split('').filter(l => l === letter).length;
  const guessLetterFrequency = board[attemptVal].slice(0, letterPos + 1).filter(l => l === letter).length;
  const newAlmost = almost && guessLetterFrequency <= correctLetterFrequency;

  // Determine the letter's state for styling with id
  const letterState = (currAttempt.attempt > attemptVal || (gameOver.gameOver && currAttempt.attempt === attemptVal)) &&
                      (correct ? "correct" : newAlmost ? "almost" : "error");

  useEffect(() => {
    // Logic to add letter to disabledLetters if the attempt is over, and the letter is not correct or 'almost'
    // Only update disabledLetters after a full attempt is made (i.e., onEnter has been triggered)
    if (currAttempt.attempt > attemptVal && !correct && !upperCorrectWord.includes(letter)) {
      setDisabledLetters(prev => [...new Set([...prev, letter])]);
    }
  }, [currAttempt.attempt, correct, almost, letter, upperCorrectWord, setDisabledLetters]);

  return (
    <div className="letter" id={letterState}>
      {letter}
    </div>
  );
}

export default Letter;
