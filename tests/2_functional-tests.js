const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve', () => {
    test('a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
        .post('/api/solve')
        .send({puzzle:'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
        .end((err,res) => {
          assert.equal(res.body.solution,'769235418851496372432178956174569283395842761628713549283657194516924837947381625');
          done();
        });    
    }); 
   

    test('puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({notpuzzle:puzzleStrings[0]})
      .end((err,res) => {
        assert.equal(res.status, 400);
        assert.property(res.body,'error');
        assert.equal(res.body.error,'Required field missing');
        done();
      });
    });

    test('a puzzle with incorrect characters: POST request to /api/solve',(done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle:'.B839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'})
      .end((err,res) => {
        assert.equal(res.status, 400);
        assert.property(res.body,'error');
        assert.equal(res.body.error,'Invalid characters in puzzle');
        done();
      });
    });

    test('a puzzle with incorrect length: POST request to /api/solve',(done) => {
      chai
    .request(server)
    .post('/api/solve')
    .send({puzzle:'888888888881.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37...',})
    .end((err,res) => {
      assert.equal(res.status, 400);
      assert.property(res.body,'error');
      assert.equal(res.body.error,'Expected puzzle to be 81 characters long');
      done();
      });
    });

    test('a puzzle that cannot be solved: POST request to /api/solve',(done) => {
      chai.request(server)
      .post('/api/solve')
      .send({puzzle:'.8839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'})
      .end((err,res) => {
        assert.equal(res.status, 400);
        assert.property(res.body,'error');
        assert.equal(res.body.error,'Puzzle cannot be solved');
        done();
      });
    });

  });

  suite('Check', () => {
    test('a puzzle placement with all fields: POST request to /api/check',(done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '7';
    chai
    .request(server)
    .post('/api/check')
    .send( {puzzle, coordinate, value})
    .end((err,res) => {
      assert.property(res.body,'valid');
      assert.isTrue(res.body.valid);
      done();
      });
    });

    test('a puzzle placement with single placement conflict: POST request to /api/check',(done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '6';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'valid');
      assert.isFalse(res.body.valid);
      assert.property(res.body,'conflict');
      assert.equal(res.body.conflict.length,1);
      assert.include(res.body.conflict,'column');
      done();
    });
  });

  test('a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '1';
    chai
    .request(server)
    .post('/api/check')
    .send( {puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'valid');
      assert.isFalse(res.body.valid);
      assert.property(res.body,'conflict');
      assert.equal(res.body.conflict.length,2);
      assert.include(res.body.conflict,'row');
      assert.include(res.body.conflict,'column');
      done();
    });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '5';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'valid');
      assert.isFalse(res.body.valid);
      assert.property(res.body,'conflict');
      assert.equal(res.body.conflict.length,3);
      assert.include(res.body.conflict,'row');
      assert.include(res.body.conflict,'column');
      assert.include(res.body.conflict,'region');
      done();
    });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle})
    .end((err,res) => {
      assert.property(res.body,'error');
      assert.equal(res.body.error,'Required field(s) missing');
      done();
    });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    const puzzle = 'C.839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
    const coordinate='A1';
    const value = '1';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'error');
      assert.equal(res.body.error,'Invalid characters in puzzle');
      done();
    });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    const puzzle = '...........9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '1';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'error');
      assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
      done();
    });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'XA1';
    const value = '7';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'error');
      assert.equal(res.body.error, "Invalid coordinate");
      done();
    });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const coordinate = 'A1';
    const value = '0';
    chai
    .request(server)
    .post('/api/check')
    .send({puzzle,coordinate,value})
    .end((err,res) => {
      assert.property(res.body,'error');
      assert.equal(res.body.error,"Invalid value");
      done();
    });
  });

  
  });
  

});



