/* Ensure the page has fully loaded before setting event listeners */
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

const tiles = Array.from(document.querySelectorAll('.tile'))
const displayTurn = document.querySelector('.display-turn')
const resetButton = document.querySelector('.btn-reset')
const announcer = document.querySelector('.announcer')

let board = ['', '', '', '', '', '', '', '', '']
let currentPlayer = 'X'
let isGameActive = true

const PLAYERX_WON = 'PLAYERX_WON'
const PLAYERO_WON = 'PLAYERO_WON'
const DRAW = 'DRAW'

/*
    Indexes within the board
    [0] [1] [2]
    [3] [4] [5]
    [6] [7] [8]
*/

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

//create the event listeners
function ready() {
  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => getMove(tile, index))
  })

  resetButton.addEventListener('click', resetBoard)
}

function getMove(tile, index) {
  if (isMoveValid(index) && isGameActive) {
    tile.innerText = currentPlayer
    tile.classList.add(`player${currentPlayer}`)
    updateBoard(index)

    //unless the game is over
    if (!isGameOver()) {
      currentPlayer = changePlayer(currentPlayer)
    }
  }
}

function isMoveValid(index) {
  let result = board[index] === '' ? true : false
  return result
}

function updateBoard(index) {
  board[index] = currentPlayer
}

function isGameOver() {
  let gameWon = false

  //check if there is a winner
  for (let i = 0; i <= 7; i += 1) {
    const winCondition = winningCombos[i]
    const a = board[winCondition[0]]
    const b = board[winCondition[1]]
    const c = board[winCondition[2]]
    if (a === '' || b === '' || c === '') {
      continue
    }
    if (a === b && b === c) {
      gameWon = true
      break
    }
  }

  if (gameWon) {
    announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON)
    isGameActive = false
    return true
  }

  if (!board.includes('')) {
    announce(DRAW)
    isGameActive = false
  }
  return false
}

function changePlayer(currentPlayer) {
  displayTurn.classList.remove(`player${currentPlayer}`)
  result = currentPlayer === 'X' ? 'O' : 'X'
  displayTurn.innerText = result
  displayTurn.classList.add(`player${result}`)
  return result
}

function announce(message) {
  switch (message) {
    case PLAYERO_WON:
      announcer.innerHTML =
        'Player <span class="playerO">O</span> won!! Game over.'
      break
    case PLAYERX_WON:
      announcer.innerHTML =
        'Player <span class="playerX">X</span> won!! Game over.'
      break
    case DRAW:
      announcer.innerHTML = "It's a draw. Game over."
      break
  }
  announcer.classList.remove('hide')
}

function resetBoard() {
  board = ['', '', '', '', '', '', '', '', '']
  isGameActive = true
  announcer.classList.add('hide')

  if (currentPlayer === 'O') {
    currentPlayer = changePlayer(currentPlayer)
  }

  tiles.forEach((tile) => {
    tile.innerText = ''
    tile.classList.remove('playerX')
    tile.classList.remove('playerO')
  })
}
