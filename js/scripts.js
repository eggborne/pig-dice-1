//#region main working

//Dice Roll
function roll() {
  let rollR
  rollR = Math.ceil(Math.random() * 6);
  return rollR;
}
//#endregion
//Game Object constructor
function Game() {
  this.Player = {}
  this.currentId = 0;
};

//Game method for assigning unique id to player
Game.prototype.aId = function() {
  this.currentId += 1;
  return this.currentId;
};
//Player Object constructor
function Player(pName) {
  this.pName = pName;
  this.pScore = 0;
  this.pTotalScore = 0;
};

//add player
Game.prototype.addPlayer = function(name) {
  this.Player.currentId = this.aId();
  this.Player.pName = name;
};

//temp console
const fGame = new Game("FirstGame");
const player1 = new Player("james");
const player2 = new Player("Marvin");
fGame.addPlayer(player1);
fGame.addPlayer(player2);







//#region main //
// // not needed ScoreBoard Object constructor
// function ScoreBoard(player) {
//   this.player = player
//   this.score = player.pScore;
// }

rollTest
let r1 = 0;
let r2 = 0;
let r3 = 0;
let r4 = 0;
let r5 = 0;
let r6 = 0;

let rollTry = 0;
function rollTest(){
  for (i = 0; i <100000000; i ++) {
          rollTry = roll();
          if (rollTry === 1) {
            r1 =r1 +1;
          }
          else if (rollTry === 6) {
            r6 =r6 +1;
          }
          else if (rollTry === 2) {
            r2 =r2 +1;
          }
          else if (rollTry === 3) {
            r3 =r3 +1;
          }
          else if (rollTry === 4) {
            r4 =r4 +1;
          }
          else if (rollTry === 5) {
            r5 =r5 +1;
          }
          else {
            console.log("not")
          }
        }
        return [r1,r2,r3,r4,r5,r6,(r1-r2)];
      }
      //#endregion
