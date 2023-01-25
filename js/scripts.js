// business logic
let game;

function startGame(playerName) {
  game = new Game();
  let player = new Player(playerName);
  game.addPlayer(player);
  game.startTurn(player.id)
}

function Game() {
  this.players = {};
  this.currentUniqueID = 0;
  this.currentPlayerTurnID = 1;
  this.turnScore = 0;
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
    alert(':( player rolled a 1. Moving on to next turn');
    console.log('Player', this.currentPlayerTurnID, 'rolled a 1, so end the turn');
    this.currentPlayerTurnID = this.nextTurnID(); 
    this.startTurn();
    // end turn
  } else {
    console.log('Player', this.currentPlayerTurnID, 'rolled a', roll);
    game.turnScore += roll
    // player chooses draw or hold
    console.log('now player chooses DRAW or HOLD');
    let playerChoice = prompt(`Player ${player.id} rolled a ${roll}. Turn score so far is ${game.turnScore}. Player total score is ${player.score} Draw (d) or hold (h)?`);
    if (playerChoice[0].toLowerCase() === 'd') {
      this.startTurn(this.currentPlayerTurnID); // new turn with same player
    } else { // hold
      player.score += this.turnScore; // add game.turnScore to player total
      this.turnScore = 0;

      if (player.score >= 100) {
        // end game
        alert(`player met or exceeded maximum score with ${player.score}`);
      } else {
        // new turn with next player
        alert('held. Moving to next player');
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

const diePatterns = [
  undefined,
  { visibleDots: [5] }, // 1
  { visibleDots: [1,9] }, // 2
  { visibleDots: [1,5,9] }, // 3
  { visibleDots: [1,3,7,9] }, // 4
  { visibleDots: [1,3,5,7,9] }, // 5
  { visibleDots: [1,3,4,6,7,9] }, // 6
]


// utility functions

const pause = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);