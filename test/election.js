const Election = artifacts.require('./Election.sol');

contract("Election", (accounts) => {
  // Test that Election contract returns 3 candidates 
  it("initializes with three candidates", () => {
    return Election.deployed().then((instance) => {
      return instance.candidatesCount();
    })
    .then((count) => {
      assert.equal(count, 3);
    });
  });

  it("it initializes the candidates with the correct values", () => {
    return Election.deployed()
    .then((instance) => {
      electionInstance = instance;
      return electionInstance.candidates(1);
    })
    .then((candidate) => {
      assert.equal(candidate[0], 1, "contains the correct ID");
      assert.equal(candidate[1], "Apugo George Kelechi", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");

      return electionInstance.candidates(2);
    })
    .then((candidate) => {
      assert.equal(candidate[0], 2, "contains the correct ID");
      assert.equal(candidate[1], "Joseph Owonwo", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");

      return electionInstance.candidates(3);
    })
    .then((candidate) => {
      assert.equal(candidate[0], 3, "contains the correct ID");
      assert.equal(candidate[1], "Ernest Amabibi", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    })
  });

  it("allows a voter to cast a vote", () => {
    return Election.deployed().then((instance) => {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then((receipt) => {
      return electionInstance.voters(accounts[0]);
    }).then((voted) => {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then((candidate) => {
      const voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });

  
});