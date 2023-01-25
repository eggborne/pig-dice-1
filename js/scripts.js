//Dice Roll
function roll() {
  let rollR
  rollR = Math.ceil(Math.random() * 6);
  return rollR;
}

// //Game Object constructor
// function Game() {
  //   this.gameInstance = {};
  // }
  
  
  // //Player Object constructor
  // function Player() {
    
    // }
    
    // //add player
    // Game.prototype.addPlayer = function() {
      
      // }
      
      // //Scoreboard Object constructor
      
      
      
      
      
      //#region main rollTest
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
