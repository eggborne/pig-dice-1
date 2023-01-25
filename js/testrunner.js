const defaultOptions = {
  failuresOnly: false,
  fancy: true,
  keepConsole: false,
}

// function runTests(testsObject, options=defaultOptions) {
//   let startedAt = performance.now();
//   !options.keepConsole && console.clear();
//   let failures = 0;
//   console.log(`%cTESTING ${Object.keys(testsObject).length} FUNCTIONS...       `, options.fancy && `color: white; background-color: green; font-size: 1.25rem; padding: 0.5rem 1rem;`);
//   for (functionName in testsObject) {
//     let totalTests = testsObject[functionName].length;
//     !options.failuresOnly && console.warn(`%c ${functionName}: ${totalTests} TESTS`, options.fancy && `font-size: 1.1rem`);
//     let passed = 0;
//     testsObject[functionName].forEach(testEntry => {
//       let testResult = testEntry.code();
//       if (testResult === testEntry.expected) {
//         !options.failuresOnly && console.log(`%c${functionName}: ${testEntry.description} PASSED `, options.fancy && `padding: 0.5rem; color: white; background-color: #00aa00aa`);
//         passed++;
//       } else {
//         failures++;
//         console.error(`%c${functionName}: ${testEntry.description} FAILED `, options.fancy && `color: white; background-color: #aa0000bb; font-size: 1rem;`);
//         console.warn(`%c expected output: ${testEntry.expected} `, options.fancy && `font-size: 1.05rem`);
//         console.warn(`%c actual output: ${testResult} `, options.fancy && `font-size: 1.05rem`);
//       };
//     })
//     if (passed === totalTests) {
//       !options.failuresOnly && console.log(`%c ${passed}/${totalTests} PASSED FOR ${functionName} `, options.fancy && `color: white; background-color: #00aa00; font-size: 1.1rem; padding: 0.1rem`);
//     } else {
//       !options.failuresOnly && console.log(`%c ${passed}/${totalTests} PASSED FOR ${functionName} `, options.fancy && `color: white; background-color: #aa0000bb; font-size: 1.1rem; padding: 0.1rem`);
//     }
//   }
//   if (!failures) {
//     console.log(`%cALL TESTS PASSED!            `, options.fancy && `color: white; background-color: green; font-size: 1.25rem; padding: 0.5rem 1rem;`);
//   } else {
//     console.error(`%c ${failures} TEST${failures > 1 ? `S` : ``} FAILED.             `, options.fancy && `color: #eee; background-color: #aa0000; font-size: 1.1rem; padding: 0.5rem 1rem;`)
//   }
//   !options.failuresOnly && console.log(`took ${parseFloat((performance.now() - startedAt).toFixed(3))} ms`)
// }

function runTests(testsObject=tests, options=defaultOptions) {
  let startedAt = performance.now();
  !options.keepConsole && console.clear();
  let failures = 0;
  console.log(`%cTESTING ${Object.keys(testsObject).length} FUNCTIONS...`, options.fancy && `color: white; background-color: green; font-size: 1.25rem; padding: 0.5rem 1rem;`);
  for (functionName in testsObject) {
    let totalTests = testsObject[functionName].length;
    !options.failuresOnly && console.warn(`%c ${functionName}: ${totalTests} TEST${totalTests === 1 ? '' : 'S'}`, options.fancy && `font-size: 1.1rem`);
    let passed = 0;
    testsObject[functionName].forEach(testEntry => {
      let testResult = testEntry.code();
      if (testResult === testEntry.expected) {
        !options.failuresOnly && console.log(`%c${functionName}: ${testEntry.description} PASSED `, options.fancy && `padding: 0.5rem; color: white; background-color: #00aa00aa`);
        passed++;
      } else {
        failures++;
        console.error(`%c${functionName}: ${testEntry.description} FAILED `, options.fancy && `color: white; background-color: #aa0000bb; font-size: 1rem;`);
        console.warn(`%c expected output: ${testEntry.expected} `, options.fancy && `font-size: 1rem`);
        console.warn(`%c actual output: ${testResult} `, options.fancy && `font-size: 1rem`);
      };
    })
    if (passed === totalTests) {
      !options.failuresOnly && console.log(`%c ${passed}/${totalTests} PASSED FOR ${functionName} `, options.fancy && `color: white; background-color: #00aa00; font-size: 1.1rem; padding: 0.1rem`);
    } else {
      !options.failuresOnly && console.log(`%c ${passed}/${totalTests} PASSED FOR ${functionName} `, options.fancy && `color: white; background-color: #aa0000bb; font-size: 1.1rem; padding: 0.1rem`);
    }
  }
  if (!failures) {
    console.log(`%cALL TESTS PASSED!                       `, options.fancy && `color: white; background-color: green; font-size: 1.25rem; padding: 0.5rem 1rem;`);
  } else {
    console.error(`%c ${failures} TEST${failures === 1 ? `` : `S`} FAILED.             `, options.fancy && `color: #eee; background-color: #aa0000; font-size: 1.1rem; padding: 0.5rem 1rem;`)
  }
  !options.failuresOnly && console.log(`took ${parseFloat((performance.now() - startedAt).toFixed(3))} ms`)
}

tests = {
  getDiceRoll: [
    {
      description: "It returns an integer",
      code: () => {
        let game = new Game();
        game.getDiceRoll();
        return typeof roll === 'number';
      },
      expected: true
    },
    {
      description: "It returns integer between 1 and 6",
      code: () => {
        let game = new Game();
        let roll = game.getDiceRoll();
        return [1,2,3,4,5,6].indexOf(roll) !== -1;
      },
      expected: true
    },
  ],
}
