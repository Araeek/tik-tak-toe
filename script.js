const GameBoard = (() => {
  let board = [null, null, null, null, null, null, null, null, null];
  const getBoard = () => board;
  const winCombos = [
    ["0", "1", "2"],
    ["3", "4", "5"],
    ["6", "7", "8"],
    ["0", "3", "6"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["0", "4", "8"],
    ["2", "4", "6"],
  ];
  const putMarker = (place, marker) => {
    if (board[place] === null) {
      board[place] = marker;
      return true;
    }
    return false;
  };

  const isFull = () => {
    if (!board.some((cell) => cell === null)) {
      return true;
    }
  };

  const clearBoard = () => {
    board.forEach((cell, index) => (board[index] = null));
  };

  const checkWin = () => {
    for (let i = 0; i < winCombos.length; i++) {
      if (
        winCombos[i].every((val) =>
          Game.getPlayerTurn().getPlayedCells().includes(val)
        )
      ) {
        return true;
      }
    }
  };
  return { getBoard, putMarker, checkWin, isFull, clearBoard };
})();

const Player = (marker) => {
  let playedCells = [];
  const getPlayedCells = () => playedCells;
  const getMarker = () => marker;

  const pushToPlayedCell = (cellNumber) => {
    playedCells.push(cellNumber);
  };

  const clearPlayedCells = () => {
    playedCells = [];
  };
  return { getMarker, getPlayedCells, pushToPlayedCell, clearPlayedCells };
};

const Game = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let playerTurn = playerX;

  const getPlayerTurn = () => playerTurn;

  const initGame = () => {
    GameBoard.clearBoard();
    playerX.clearPlayedCells();
    playerO.clearPlayedCells();
    displayController.renderGameboard();
    playerTurn = playerX;
    displayController.init();
    displayController.updateTurn();
  };

  const playRound = (cell) => {
    if (GameBoard.putMarker(cell, playerTurn.getMarker())) {
      playerTurn.pushToPlayedCell(cell);
      displayController.renderGameboard();
      if (GameBoard.checkWin()) {
        displayController.showWinner();
      } else if (GameBoard.isFull()) {
        displayController.showTie();
      } else {
        changeTurn();
        displayController.updateTurn();
      }
    }
  };

  const changeTurn = () => {
    playerTurn = playerTurn === playerX ? playerO : playerX;
  };

  return { getPlayerTurn, playRound, initGame, changeTurn };
})();

const displayController = (() => {
  const gameStatus = document.querySelector("#game-status");
  const cells = document.querySelectorAll(".cell");
  const gameRestart = document.querySelector(".game-restart");

  const renderGameboard = () => {
    GameBoard.getBoard().forEach((cell, index) => {
      cells[index].innerHTML = cell;
    });
  };

  const playRound = (e) => {
    Game.playRound(e.target.dataset.cellIndex);
  };

  const init = () => {
    cells.forEach((cell) => cell.addEventListener("click", playRound));
    gameRestart.addEventListener("click", Game.initGame);
  };

  const showWinner = () => {
    gameStatus.innerHTML = `🎉Player ${Game.getPlayerTurn().getMarker()} Won!!!!!🎉`;
    endGame();
  };

  const showTie = () => {
    gameStatus.innerHTML = `🤝It's a Tie!!🤝`;
    endGame();
  };

  const endGame = () => {
    cells.forEach((cell) => cell.removeEventListener("click", playRound));
  };

  const updateTurn = () => {
    gameStatus.innerHTML = `Player ${Game.getPlayerTurn().getMarker()} turn`;
  };

  return { updateTurn, renderGameboard, showWinner, showTie, init };
})();

Game.initGame();
