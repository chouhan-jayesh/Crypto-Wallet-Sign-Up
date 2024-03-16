import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const MetaMask = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const connectWallet = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChanged(result[0]);
        })
        .catch((error) => {
          setErrorMessage(`Error connecting wallet: ${error.message}`);
        });
    } else {
      setErrorMessage("Install MetaMask!!");
    }
  };

  const disconnectWallet = () => {
    // Clear locally stored wallet information or update state variables
    localStorage.clear();
    setDefaultAccount(null);
    setUserBalance(null);
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    getUserBalance(accountName);
  };

  const getUserBalance = (accountAddress) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [String(accountAddress), "latest"],
      })
      .then((balance) => {
        if (ethers) {
          setUserBalance(ethers.formatEther(balance));
        } else {
          setErrorMessage("ethers.utils is not available");
        }
      })
      .catch((error) => {
        setErrorMessage(`Error fetching balance: ${error.message}`);
      });
  };

  useEffect(() => {
    // Perform any additional setup or cleanup on component mount/unmount

    return () => {
      // Cleanup or reset state variables when the component unmounts
      setErrorMessage(null);
      setDefaultAccount(null);
      setUserBalance(null);
    };
  }, []);

  return (
    <div>
      <h1>MetaMask Wallet Connection</h1>
      <p>
        This is a sample code to connect your Ethereum wallet and fetch address
        and balance.
      </p>
      <button onClick={connectWallet}>Connect</button>
      <button onClick={disconnectWallet}>Disconnect</button>
      <h3>Address: {defaultAccount}</h3>
      <h3>Balance: ${userBalance}</h3>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default MetaMask;
