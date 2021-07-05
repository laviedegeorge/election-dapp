import React from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import "./App.css";
import getWeb3 from "./getWeb3";
import Election from "./contracts/Election.json";

const App = () => {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState(null);
  const [voted, setVoted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [candidates, setCandidates] = React.useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const electionCandidates = candidates.map((candidate) => {
    return (
      <tr className="candidate" key={candidate.id}>
        <td>{candidate.id}</td>
        <td>{candidate.name}</td>
        <td>{candidate.voteCount}</td>
      </tr>
    );
  });

  const loadCandidiates = async (contract) => {
    setLoading(true);

    try {
      contract.methods
        .candidatesCount()
        .call()
        .then((count) => {
          let number = parseInt(count);
          let promiseArr = [];

          for (let index = 1; index <= count; index++) {
            let promise = contract.methods
              .candidates(index)
              .call()
              .then((res) => {
                return res;
              })
              .catch((error) => {
                console.error("Error from candidates:", error);
              });
            promiseArr.push(promise);
          }
          return promiseArr;
        })
        .then((promiseArr) => {
          Promise.all(promiseArr).then((values) => {
            setCandidates(values);
          });
        })
        .catch((error) => {
          console.error("Error from candidate count:", error);
        });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const connectToWeb3Provider = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = await Election.networks[networkId];
      const instance = await new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setState({ web3, accounts, contract: instance });
      console.log("accounts:", accounts);
      console.log("deployed network:", deployedNetwork);
      console.log("contract instance:", instance);
      await loadCandidiates(instance);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const initializeApp = async () => {
    await connectToWeb3Provider();
  };

  const vote = (candidate) => {
    //console.log(candidate);
    try {
      state.contract.methods
      .vote(candidate)
      .send({ from: state.accounts[0] }, (error, receipt) => {
        if (error) {
          console.log(error);
        } else {
          console.log(receipt);
        }
      })
    } catch (error) {
      console.log(error);
      return;
    }
      /* .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
      })
      .on("receipt", function (receipt) {
        // receipt example
        console.log(receipt);
      })
      .on("error", function (error, receipt) {
        // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(error, receipt);
      }); */

    /* .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      }); */

    setVoted(true);
  };

  const shortenAddress = (address) => {
    try {
      const addressArr = (address || "").split("");
      const shortAddress = addressArr.splice(0, 6).join("");
      return shortAddress;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  React.useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="App">
      <header>
        <h1> Election Results</h1>
      </header>

      <table className="table">
        <thead>
          <tr className="table-header">
            <th>SN.</th>
            <th>Candidates Name</th>
            <th>Vote count</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3">Loading ... </td>
            </tr>
          ) : candidates.length === 0 ? (
            <tr>
              <td colSpan="3">No Candidates to show...</td>
            </tr>
          ) : (
            electionCandidates
          )}
        </tbody>

        {/* {state && !state.web3 ? (
            <div>Loading Web3, accounts, and contract...</div>
          ) : loading ? (
          ) : (
            <div>
              
            </div>
          )} */}
      </table>

      {voted ? (
        ""
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            vote(parseInt(value));
          }}
        >
          <label>Select Candidate</label> <br />
          <select value={value} onChange={(e) => handleChange(e)}>
            <option>-- Select Candidate --</option>
            {candidates.map((candidate) => {
              return (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              );
            })}
          </select>{" "}
          <br />
          <button>Vote</button>
        </form>
      )}

      <footer>
        <p>
          Logged in as:{" "}
          <a href="#">{state && shortenAddress(state.accounts[0])}</a>
        </p>
        <p>
          {" "}
          Built by <a href="https://github.com/laviedegeorge">
            laviedegeorge
          </a>{" "}
        </p>
      </footer>
    </div>
  );
};

export default App;
