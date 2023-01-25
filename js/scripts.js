// business logic
let game;

function startGame(playerName) {
  game = new Game();
  let player = new Player(playerName);
  game.addPlayer(player);
  game.startTurn(player.id)
}
function Game() {
  this.players = {
    // playerID: Player,
    // playerID: Player,
    // etc.
  };
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

Game.prototype.startTurn = function() {
  alert(`starting turn for player ID ${this.currentPlayerTurnID}`)
  let player = this.players[this.currentPlayerTurnID];
  let roll = this.getDiceRoll();
  if (roll === 1) {
    alert(':( player rolled a 1. Moving on to next turn');
    console.log('Player', this.currentPlayerTurnID, 'rolled a 1, so end the turn');
    let nextPlayerID = 1;
    this.currentPlayerTurnID = nextPlayerID;
    this.startTurn();
    // end turn
  } else {
    console.log('Player', this.currentPlayerTurnID, 'rolled a', roll);
    game.turnScore += roll
    // player chooses draw or hold
    console.log('now player chooses DRAW or HOLD');
    let playerChoice = prompt(`Player ${player.id} rolled a ${roll}. Turn score so far is ${game.turnScore}. Player total score is ${player.score} Draw (d) or hold (h)?`);
    if (playerChoice[0].toLowerCase() === 'd') {
      this.startTurn(this.currentPlayerTurnID);
      // new turn with same player
    } else { // hold
      player.score += this.turnScore;
      this.turnScore = 0;
      alert('held. Moving to next player');

      this.currentPlayerTurnID = 1; // the next one in game.players, or first if at end
      this.startTurn();

      // add game.turnScore to player total
      // end game if player.total over 100
      // new turn with next player
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




// utility functions

const pause = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);