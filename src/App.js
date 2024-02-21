//App.js
import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { createContext, useEffect, useState } from "react";
import { boardDefault, generateWordSet } from "./Words";
import GameOver from "./components/GameOver";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letter: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState("");
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
    showModal: false
  });

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
      console.log(words.todaysWord); // Uncomment to see the correct word in the console
    });
  }, []);

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letter > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letter] = keyVal;
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letter: currAttempt.letter + 1 });
  };

  const onDelete = () => {
    if (currAttempt.letter === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
  };

  const onEnter = () => {
    if (currAttempt.letter !== 5) return; // Ensure a full word has been entered

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i].toLowerCase();
    }

    // Check if the word is in the list
    if (!wordSet.has(currWord)) {
      alert("Word is not in the list. Try again.");
      return; // Prevent advancing the attempt if the word is not in the list
    }

    // Proceed if the word is correct
    if (currWord === correctWord.toLowerCase()) {
      setGameOver({ gameOver: true, guessedWord: true, showModal: false });
      return;
    }

    // Check if it's the last attempt after verifying the word is in the list
    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }

    // If the word is in the list but not correct, and it's not the last attempt, move to the next attempt
    setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
  };

  useEffect(() => {
    if (gameOver.gameOver) {
      // Use a brief timeout to wait for the UI to update
      const timer = setTimeout(() => {
        setGameOver(prev => ({ ...prev, showModal: true }));
      }, 500); // Adjust delay as needed
  
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [gameOver.gameOver]);
  

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          onSelectLetter,
          onDelete,
          onEnter,
          correctWord,
          disabledLetters,
          setDisabledLetters,
          gameOver,
          setGameOver,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.showModal && <GameOver />}
  {!gameOver.gameOver && <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
