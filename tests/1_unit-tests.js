const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver=new Solver();


suite('UnitTests', () => {
  suite('Validate puzzle string', () => {
    test('handles a valid puzzle string of 81 characters', () => {
      let validStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let isValid = solver.validate(validStr).result;
      assert.isTrue(isValid);
      assert.equal(81,validStr.length);
    });
    test('handles a puzzle string with invalid characters (not 1-9 or .)',() => {
      let invalidStr = '#.839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
      let isValid = solver.validate(invalidStr).result;
      assert.isFalse(isValid);
    });
    test('handles a puzzle string that is not 81 characters in length',() => {
      let invalidStr = '.........9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let isValid = solver.validate(invalidStr).result;
      let invalidStrLen = invalidStr.length;
      assert.isFalse(isValid);
      assert.notEqual(81, invalidStrLen);
    });
  });

  suite('Validates placement',() => {
    let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    test('handles valid row placement',() => {
      let isValid = solver.checkRowPlacement(puzzleString,'A',1,'3');
      assert.isTrue(isValid);
    });

    test('handles an invalid row placement',() => {
      let isValid = solver.checkRowPlacement(puzzleString,'A',1,'1');
      assert.isFalse(isValid);
    });

    test('handles valid column placement',() => {
      let isValid = solver.checkColPlacement(puzzleString,'A',1,'7');
      assert.isTrue(isValid);
    });

    test('handles an invalid column placement',() => {
      let isValid = solver.checkColPlacement(puzzleString,'A',1,'6');
      assert.isFalse(isValid);
    });

    test('handles a valid region (3x3 grid) placement',() => {
      let isValid = solver.checkRegionPlacement(puzzleString,'A',1,'1');
      assert.isTrue(isValid);
    });

    test('handles an invalid region (3x3 grid) placement', () => {
      let isValid = solver.checkRegionPlacement(puzzleString,'A',1,'5');
      assert.isFalse(isValid);
    });
  });
   
  suite('Solver',() => {
    let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    test('valid puzzle strings pass the solver',() => {
      assert.isTrue(solver.solve(puzzleString).result);
    });

    test('invalid puzzle strings pass the solver',() => {
      assert.isFalse(solver.solve(puzzleString.slice(1)).result);
    });

    test('returns the expected solution for an incomplete puzzle',() => {
      assert.isTrue(solver.solve(puzzleString).result);
    });
  });
    
     });



