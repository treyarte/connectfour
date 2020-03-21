/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

//get modal and overlay
const endGameModal = document.querySelector('.end-game');
const endGameOverlay = document.querySelector('.end-game-overlay');
const newGameBtn = document.querySelector('.new-game-btn');
const endGameMessage = document.querySelector('.end-game-message');
newGameBtn.addEventListener('click', () => {
  toggleEndGameResults();
  reset();
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // create matrix initialized with null
  for (let i = 0; i < WIDTH; i++) {
    board.push([]);
    for (let j = 0; j < HEIGHT; j++) {
      board[i].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // create a variable and setting it to the table html element
  const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  //create a table row element and setting attributes
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  //add event listener to top (table row)
  top.addEventListener('click', handleClick);
  top.addEventListener('mouseover', handleHover);
  top.addEventListener('mouseout', handleLeave);

  //creates the top row of the board
  //this is where a user clicks to drop a game piece
  for (let x = 0; x < WIDTH; x++) {
    //create a cell element and placing it in a variable
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    //adding the cell to the table row
    top.append(headCell);
  }
  //adding the top row to the board
  htmlBoard.append(top);

  //creating the visual board that pieces will go inside
  for (let y = 0; y < HEIGHT; y++) {
    //create a row element
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      //create a cell that will be added to the row
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    //add row to the htmlBoard
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let spotLocation;
  //check to see if there are any available spaces in the current column
  const isSpot = board[x].some(val => {
    return val === null;
  });
  //if there is space get the last index that contains null
  if (isSpot) {
    spotLocation = board[x].lastIndexOf(null);
  }
  return spotLocation;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const gamePiece = document.createElement('DIV');
  gamePiece.classList.add('piece', `player${currPlayer}`, 'piece-animation');

  //have to use getElementById instead of querySelector.
  //querySelector have to handle leading digit ids in a special way
  const cell = document.getElementById(`${y}-${x}`);
  cell.append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  endGameMessage.innerText = msg;
  toggleEndGameResults();
}

//toggle modal and overlay;
function toggleEndGameResults() {
  endGameModal.classList.toggle('exit');
  endGameOverlay.classList.toggle('exit');
}

/**handleHover: handle when the mouse hover on top change the class to the current player */
function handleHover(evt) {
  const topElement = evt.target;

  if (currPlayer === 1) {
    topElement.style.backgroundColor = '#ff1e56';
  } else {
    topElement.style.backgroundColor = '#ffac41';
  }
}

//set the background to nothing when the mouse leaves the element
function handleLeave(evt) {
  const topElement = evt.target;
  topElement.style.backgroundColor = '';
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  //when the element is click change the color of the top row so players know who is next
  const topElement = evt.target;
  if (currPlayer === 2) {
    topElement.style.backgroundColor = '#ff1e56';
  } else {
    topElement.style.backgroundColor = '#ffac41';
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[x][y] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} win!`);
  }

  // check for tie
  let tieChecker = board.every(nestedArray => {
    return nestedArray.every(val => {
      return val !== null;
    });
  });

  if (tieChecker) {
    endGame('No Contest!');
  }
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  //create arrays for the different type of win conditions
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //create nested arrays that have coordinates of the horizontal board
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      //nested array with column coordinates
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      //nested array with diagonal coordinates going to the right
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      //nested array with diagonal coordinates going to the left
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];
      //if any of these nested arrays contain 4 cells of the same player that player wins
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//reset the game board
function reset() {
  board.length = 0;
  console.log(board);
  document.querySelector('#board').innerHTML = '';
  currPlayer = 1;
  makeBoard();
  makeHtmlBoard();
}

makeBoard();
makeHtmlBoard();
