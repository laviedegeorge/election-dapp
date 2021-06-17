// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {

  uint public candidatesCount;

    struct Candidate {
      uint id;
      string name;
      uint voteCount;
    }

    mapping (uint => Candidate) public candidates;

    constructor() {
        addCandidate('Apugo George Kelechi');
        addCandidate('Joseph Owonwo');
        addCandidate('Ernest Amabibi');
    }

    function addCandidate (string memory _name) private {
      candidatesCount ++;
      candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }
}

/* 
     Deploying 'Election'
   --------------------
   > transaction hash:    0x663f6b5fa3fa8e976161309f702e1cbfa36492d8ba399b9e3104e41273520de6
   > Blocks: 0            Seconds: 0
   > contract address:    0x2c06c4434f5DE937d6C6e63Faa3Ae0c818eA3280
   > block number:        18
   > block timestamp:     1623889712
   > account:             0x605AD3a7573702B97439BcE9e7fa8FDaA9a054f0
   > balance:             99.95669272
   > gas used:            205247 (0x321bf)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00410494 ETH
 */
