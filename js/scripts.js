window.addEventListener('load', function() {
  document.getElementById('new-game-button').addEventListener('click', handleNewGameButtonClick);
  document.getElementById('add-player-button').addEventListener('click', handleAddPlayerClick);
  document.getElementById('confirm-game-button').addEventListener('click', handleStartGameButtonClick);
});

// Business logic ///////////////////////////////////////////

let game;

function Game() {
  this.players = {}; // contains an id:Player pair for each player
  this.currentUniqueID = 0; // incremented by Game.prototype.addPlayer()
  this.currentPlayerTurnID = 1; // cycled by Game.prototype.nextTurnID()
  this.pointsThisTurn = 0; // reset to 0 at end of each turn ('hold' clicked or player rolls 1)
  this.phase = 'title'; // might be useful...?

  // referred to by Game.prototype.changeCenterDie to blacken the correct dots for each number
  this.diePatterns = [
    { visibleDots: [5] }, // 1
    { visibleDots: [1,9] }, // 2
    { visibleDots: [1,5,9] }, // 3
    { visibleDots: [1,3,7,9] }, // 4
    { visibleDots: [1,3,5,7,9] }, // 5
    { visibleDots: [1,3,4,6,7,9] }, // 6
  ],

  // referred to by 
  this.defaultCPUOptions = {
    names: [
      'George',
      'Martha',
      'Cheech',
      'Chong',
      'Siskel',
      'Ebert',
    ],
    bgColors: [
      '#3d4558',
      '#47764f',
      '#941e1e',
      '#571d58',
      '#2c7b7d',
      '#945b19',
    ],
  }
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
  this.currentPlayerTurnID++;
  if (this.currentPlayerTurnID > Object.keys(this.players).length) {
    this.currentPlayerTurnID = 1;
  }
  return this.currentPlayerTurnID;
}

Game.prototype.startTurn = function() {
  let player = this.players[this.currentPlayerTurnID];
  let turnOver = false;
  alert(`rolling for ${player.name}...`)
  let roll = this.getDiceRoll();
  if (roll === 1) {
    alert(':( player rolled a 1. Moving on to next turn');
    console.log('Player', this.currentPlayerTurnID, 'rolled a 1, so end the turn');
    turnOver = true;
  } else {
    console.log('Player', this.currentPlayerTurnID, 'rolled a', roll);
    this.pointsThisTurn += roll;
    document.querySelector(`#player-knob-${player.id} > .player-turn-score`).innerText = '+' + game.pointsThisTurn;

    // player chooses draw or hold
    console.log('now player chooses DRAW or HOLD');
    let playerChoice = prompt(`${player.name} rolled a ${roll}. Turn score so far is ${this.pointsThisTurn}. 
    \nPlayer total score is ${player.score} Draw (d) or hold (h)?`);
    
    if (playerChoice[0].toLowerCase() === 'd') {
      this.startTurn(this.currentPlayerTurnID); // new turn with same player
    } else { // hold
      player.score += this.pointsThisTurn; // add this.pointsThisTurn to player total
      document.querySelector(`#player-knob-${player.id} > .player-score`).innerText = '+' + game.pointsThisTurn;
      this.pointsThisTurn = 0;

      if (player.score >= 100) {
        // end game
        alert(`player met or exceeded maximum score with ${player.score}`);
      } else {
        // new turn with next player
        alert('held. Moving to next player');
        turnOver = true;
        // this.currentPlayerTurnID = this.nextTurnID(); 
        // this.startTurn();
      }
    }
  }
  if (turnOver) {
    document.getElementById(`player-knob-${player.id}`).classList.remove('selected');
    this.currentPlayerTurnID = this.nextTurnID();
    document.getElementById(`player-knob-${this.currentPlayerTurnID}`).classList.add('selected');
    // alert(`${player.name} turn is over. Now is ${this.players[this.currentPlayerTurnID]}'s turn`);
    this.startTurn();
  }
}

Game.prototype.advanceTurn = function(newTurnID) {
  console.log(`switching from player ${this.players[this.currentPlayerTurnID].name}`);
  document.getElementById(`player-knob-${this.currentPlayerTurnID}`).classList.remove('selected');
  this.currentPlayerTurnID = newTurnID || this.nextTurnID();
  console.log(`to player ${this.players[this.currentPlayerTurnID].name}`);
  document.getElementById(`player-knob-${this.currentPlayerTurnID}`).classList.add('selected');
  this.rotateGameBoard(this.players[this.currentPlayerTurnID].boardAngle * -1)
}

Game.prototype.createPlayerElements = async function() {

  // *the Player objects were already created and added to this.players when user clicked "Add Another Player"*

  // This function gives a .name and .bgColor to each Player according to the user-entered values in the New Game input fields
  // and then calls Game.prototype.createPlayerKnob(Player) to add it to the DOM.
  
  let totalPlayers = Object.keys(this.players).length;
  console.log('total players is', totalPlayers);
  
  for (const playerID in this.players) {
    let playerObj = this.players[playerID];
    
    // get the color and input values from the corresponding New Game menu input:
    let nameInputValue = document.getElementById(`player-name-input-${playerID}`).value;
    let colorInputValue = document.getElementById(`player-color-input-${playerID}`).value;

    // assign those values to the Player object if they exist, or assign the default values if they don't:
    playerObj.name = nameInputValue || this.defaultCPUOptions.names[playerID-1];
    playerObj.bgColor = colorInputValue || this.defaultCPUOptions.bgColors[playerID-1];
    //
    let knobAngle = (360 / totalPlayers) * (playerID - 1);
    playerObj.boardAngle = knobAngle;
    console.log(`set ${playerObj.name}'s boardAngle to ${playerObj.boardAngle}`);

    // now that the Player has a name and bgColor established, it can be used to create a .player-knob element:
    await this.createPlayerKnob(playerObj);
    console.log(`${playerID} is ${colorInputValue}`)
  }
}

Game.prototype.createPlayerKnob = async function(playerObj) {

  ////// CREATE AND FILL THE KNOB

  // use document.createElement to create the outer container so we can give it a convenient variable
  let newPlayerElement = document.createElement('div');

  // give it a CSS #id which includes the unique 'id' property of our playerObj argument:
  newPlayerElement.id = `player-knob-${playerObj.id}`;

  // apply the classes it needs to look and be placed properly:
  newPlayerElement.classList.add('player-knob');

  // apply the background color the user just chose for it on the New Game menu form:
  newPlayerElement.style.backgroundColor = playerObj.bgColor;

  // fill in the HTML of the player knob, plugging in the player's ID and name:
  newPlayerElement.innerHTML = `
    <div id="${playerObj.id}" class="player-name">${playerObj.name}</div>
    <div class="player-score">${playerObj.score}</div>
    <div class="button-area">
      <button class="draw-button" type="button">DRAW</button>
      <button class="hold-button" type="button">HOLD</button>
    </div>
    <div class="player-turn-score"></div>
  `;

  ////// ATTACH BUTTON HANDLERS

  // call querySelector on newPlayerElement (not document) so that the query will only search within newPlayerElement:
  newPlayerElement.querySelector('button.draw-button').addEventListener('click', function(e) {
    console.log(`${playerObj.name} clicked DRAW`);
    // do 'DRAW' stuff

  });
  newPlayerElement.querySelector('button.hold-button').addEventListener('click', function(e) {
    console.log(`${playerObj.name} clicked HOLD`);
    // do 'HOLD' stuff

  });

  ////// ADD KNOB TO DOM

  document.getElementById('game-area').append(newPlayerElement);

  let playerKnobSize = parseInt(getComputedStyle(newPlayerElement).width);
  let gameBoardRadius = parseInt(getComputedStyle(document.getElementById('game-area')).width) / 2;
  gameBoardRadius -= (playerKnobSize / 2);
  let distancesFromCenter = getXandYDistanceForAngle(playerObj.boardAngle, gameBoardRadius);
  newPlayerElement.style.translate = `${distancesFromCenter.x}px ${distancesFromCenter.y}px`;

  await pause(200);
  newPlayerElement.classList.add('showing');
}

Game.prototype.changeCenterDie = async function(denomination) {

  // fade out if showing already:
  if (document.getElementById('center-die').classList.contains('showing')) {
    document.getElementById('roll-display').classList.remove('showing');
    await pause(400); // wait for it to fully disappear before changing the dots
  }

  // make dots visible or invisible according to this.diePatterns.visibleDots:
  let pattern = this.diePatterns[denomination-1].visibleDots;
  for (let i=1; i<=9; i++) {
    let dotQuery = `#center-die > .die-dot:nth-child(${i})`;
    if (pattern.indexOf(i) !== -1) {
      document.querySelector(dotQuery).classList.add('visible');
    } else {
      document.querySelector(dotQuery).classList.remove('visible');
    }
  }
  
  // now that it has the new dot pattern, fade it in again:
  document.getElementById('roll-display').classList.add('showing');
}

Game.prototype.rotateGameBoard = function(degrees) {
  let gameBoard = document.getElementById('game-area');
  gameBoard.style.transform = `rotate(${degrees}deg)`;
  let playerKnobs = [...document.getElementsByClassName('player-knob')];
  for (let knob in playerKnobs) {
    let currentKnob = playerKnobs[knob];
    console.log('knob', currentKnob.style);
    currentKnob.style.transform = `rotate(${degrees * -1}deg)`;
  }
}

function Player() {
  this.id; // established by Game.prototype.addPlayer()
  this.name; // established by Game.prototype.createPlayerElements()
  this.bgColor; // established by Game.prototype.createPlayerElements()
  this.score = 0;
  this.rollCount = 0;
  this.boardAngle = 0; // degrees of angle from center
}


/// UI logic ///////////////////////////////////////////

function handleNewGameButtonClick() { // user clicks "New Game..." button at initial page load

  document.getElementById('new-game-form').classList.add('showing');
  document.getElementById('new-game-button').classList.remove('showing');
  game = new Game();
  let player = new Player();
  game.addPlayer(player);

  setInterval(() => {
    let turnPlayer = game.players[game.currentPlayerTurnID];
    document.getElementById('debug').innerHTML = `
    <div><p>phase: </p><p>${game.phase}</p></div>
    <div><p>pointsThisTurn: </p><p>${game.pointsThisTurn}</p></div>
    <br />
    <div><p>turn: </p><p>${turnPlayer.name || 'none'}</p></div>
    <div><p>player score: </p><p>${turnPlayer.score}</p></div>
    `;
  }, 100);
}

function handleAddPlayerClick(e) { // user clicks "Add Another Player" on the "New Game" menu

  // instantiate a new Player object:
  let newPlayer = new Player();

  // add it to the Game object:
  game.addPlayer(newPlayer);

  // create and add another row of text and color inputs, associating them with the new Player using its 'id' property:
  let newRow = document.createElement('div');
  newRow.classList.add('input-row');
  newRow.innerHTML = `
    <p>Player ${newPlayer.id}:</p>
    <input value="${game.defaultCPUOptions.bgColors[newPlayer.id-1]}" class="player-color-input" id="player-color-input-${newPlayer.id}" type="color">
    <input id="player-name-input-${newPlayer.id}" type="text" placeholder="Enter name">
  `;

  // add the row at the end of the list, which is just before the button which was clicked (e.target):
  document.getElementById('new-game-form').insertBefore(newRow, e.target);
}

async function handleStartGameButtonClick(e) { // user clicks "START!" on the "New Game" menu
  document.getElementById('new-game-form').classList.remove('showing');
  await game.createPlayerElements();
  await pause(500);
  document.getElementById(`player-knob-1`).classList.add('selected');
  await pause(500);


  let firstRoll = game.getDiceRoll();
  game.changeCenterDie(firstRoll);
  game.pointsThisTurn += firstRoll;
  game.phase = 'waiting';
  document.querySelector(`#player-knob-1 > .player-turn-score`).innerText = '+' + game.pointsThisTurn;
  
  // game.startTurn();
}

// Utility functions

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const pause = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getXandYDistanceForAngle(angle, radius) {
  angle = degreesToRadians(angle + 90);
  //let xDistance = Math.cos(angle) * radius;
  let xDistance = Math.cos(angle) * radius;
  console.log(xDistance);
  let yDistance = Math.sin(angle) * radius;
  console.log(yDistance);
  return { x: xDistance, y: yDistance };
}

function radiansToDegrees(radians) {
  return radians * (180/Math.PI);
}

function degreesToRadians(degrees) {  
  return degrees * (Math.PI/180);
}