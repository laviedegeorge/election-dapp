// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {
    uint256 public candidatesCount;

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) private voters;

    constructor() {
        addCandidate("Apugo George Kelechi");
        addCandidate("Joseph Owonwo");
        addCandidate("Ernest Amabibi");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // check that sender has not voted before
        require(!voters[msg.sender]);
        
        // check that _candidateId is available
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        
        voters[msg.sender] = true;
        
        // update candidates vote count
        candidates[_candidateId].voteCount ++;
    }
}
