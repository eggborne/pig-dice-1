window.addEventListener('load', function() {
  document.getElementById('new-game-button').addEventListener('click', initiateNewGame);
  document.getElementById('add-player-button').addEventListener('click', handleAddPlayerClick);
  document.getElementById('confirm-game-button').addEventListener('click', handleConfirmGameClick);
});



// business logic

let game;

function initiateNewGame(playerName) {
  document.getElementById('new-game-form').classList.add('showing');
  document.getElementById('new-game-button').classList.remove('showing');
  game = new Game();
  let player = new Player(playerName);
  game.addPlayer(player);
}

function Game() {
  this.players = {};
  this.currentUniqueID = 0;
  this.currentPlayerTurnID = 1;
  this.turnScore = 0;
  this.phase = 'idle';
}

Game.prototype.addPlayer = function(player) {
  let newID = this.getUniqueID();
  player.id = newID;
  this.players[player.id] = player;
}

Game.prototype.getUniqueID = function() {
  this.currentUniqueID++;
  return this.currentUniqueID
}

Game.prototype.getDiceRoll = function(playerID) {
  return randomInt(1,6);
}

Game.prototype.nextTurnID = function(playerID) {
  return 1;
}

Game.prototype.startTurn = function() {
  alert(`starting turn for player ID ${this.currentPlayerTurnID}`)
  let player = this.players[this.currentPlayerTurnID];
  let roll = this.getDiceRoll();
  if (roll === 1) {
    // alert(':( player rolled a 1. Moving on to next turn');
    console.log('Player', this.currentPlayerTurnID, 'rolled a 1, so end the turn');
    this.currentPlayerTurnID = this.nextTurnID(); 
    this.startTurn();
    // end turn
  } else {
    console.log('Player', this.currentPlayerTurnID, 'rolled a', roll);
    this.turnScore += roll
    // player chooses draw or hold
    console.log('now player chooses DRAW or HOLD');
    let playerChoice = prompt(`Player ${player.id} rolled a ${roll}. Turn score so far is ${this.turnScore}. Player total score is ${player.score} Draw (d) or hold (h)?`);
    
    if (playerChoice[0].toLowerCase() === 'd') {
      this.startTurn(this.currentPlayerTurnID); // new turn with same player
    } else { // hold
      player.score += this.turnScore; // add this.turnScore to player total
      this.turnScore = 0;

      if (player.score >= 100) {
        // end game
        // alert(`player met or exceeded maximum score with ${player.score}`);
      } else {
        // new turn with next player
        // alert('held. Moving to next player');
        this.currentPlayerTurnID = this.nextTurnID(); 
        this.startTurn();
      }
      // end game if player.total over 100
    }
  }
}

function Player(name) {
  this.id;
  this.name = name;
  this.score = 0;
  this.rollCount = 0;
}

/// UI logic

function handleAddPlayerClick(e) {
  let newPlayer = new Player();
  game.addPlayer(newPlayer);
  let newRow = document.createElement('div');
  newRow.classList.add('input-row');
  newRow.innerHTML = `
    <p>Player ${newPlayer.id}:</p>
    <input value="#3d4558" class="player-color-input" id="player-color-input-${newPlayer.id}" type="color">
    <input id="player-name-input-${newPlayer.id}" type="text" placeholder="Enter name">
  `;
  document.getElementById('new-game-form').insertBefore(newRow, e.target);
}

async function handleConfirmGameClick(e) {
  document.getElementById('new-game-form').classList.remove('showing');
  createPlayerElements();
  await pause(1000);
  game.currentPlayerTurnID = 1;
  document.getElementById(`player-knob-1`).classList.add('selected');
  await pause(500);
  let firstRoll = game.getDiceRoll();
  changeCenterDie(firstRoll);
  game.turnScore += firstRoll;
  game.phase = 'waiting';
  document.querySelector(`#player-knob-1 > .player-turn-score`).innerText = '+' + game.turnScore;
  // game.startTurn();
}

async function changeCenterDie(denomination) {
  document.getElementById('roll-display').classList.remove('showing');
  await pause(400)
  let pattern = diePatterns[denomination].visibleDots;
  for (let i=1; i<=9; i++) {
    let dotQuery = `#center-die > .die-dot:nth-child(${i})`;
    if (pattern.indexOf(i) !== -1) {
      console.log('filling dotQuery', dotQuery);
      document.querySelector(dotQuery).classList.add('visible');
    } else {
      document.querySelector(dotQuery).classList.remove('visible');
    }
  }
  
  document.getElementById('roll-display').classList.add('showing');
}

async function createPlayerArea(playerObj) {
  let newPlayerID = playerObj.id;
  let newPlayerName = playerObj.name;
  let newPlayerElement = document.createElement('div');
  newPlayerElement.classList.add('player-knob');
  newPlayerElement.classList.add(`position-${newPlayerID}`);
  newPlayerElement.style.backgroundColor = playerObj.bgColor;
  newPlayerElement.id = `player-knob-${newPlayerID}`
  let drawButton = document.createElement('button');
  let holdButton = document.createElement('button');
  drawButton.classList.add('draw-button');
  holdButton.classList.add('hold-button');
  newPlayerElement.innerHTML = `
  <div id="${newPlayerID}" class="player-name">${newPlayerName}</div>
  <div class="player-score">0</div>
  <div id="button-area-${newPlayerID}">
    <button class="" type="button">DRAW</button>
    <button class="player-knob-hold-button" type="button">HOLD</button>
  </div>
  <div class="player-turn-score"></div>
  `;
  // document.getElementById(`button-area-${newPlayerID} > .draw-button`).addEventListener('click', function() {
  //   console.log('clicked', e.target)
  // });
  // document.getElementById(`button-area-${newPlayerID} > .hold-button`).addEventListener('click', function() {
  //   console.log('clicked', e.target)
  // });
  document.getElementById('game-area').append(newPlayerElement);

  await pause(200);
  newPlayerElement.classList.add('showing');
}

async function createPlayerElements() {
  for (let playerID in game.players) {
    let playerObj = game.players[playerID];
    let defaultName = defaultNames[playerID-1];
    let newPlayerName = document.getElementById(`player-name-input-${playerID}`).value || defaultName;
    playerObj.name = newPlayerName;
    playerObj.bgColor = document.getElementById(`player-color-input-${playerID}`).value;
    createPlayerArea(playerObj);
  }
}

const diePatterns = [
  undefined,
  { visibleDots: [5] }, // 1
  { visibleDots: [1,9] }, // 2
  { visibleDots: [1,5,9] }, // 3
  { visibleDots: [1,3,7,9] }, // 4
  { visibleDots: [1,3,5,7,9] }, // 5
  { visibleDots: [1,3,4,6,7,9] }, // 6
]

const defaultNames = [
  'Cheech',
  'Chong',
  'George',
  'Martha'
]


// utility functions

const pause = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);