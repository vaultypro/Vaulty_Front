import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import logoSec from "../assets/logo.png";
import "./staking.css";

import {
  ConnectMetamask,
  ConnectWeb3Wallet,
  DisconnectWallet,
  web3_,
} from "../Services";
import { staking, vaulty } from "../Constants/Contaracts";
import { StakingABI } from "../Config/ABI/StakingABI";
import { vaultyABI } from "../Config/ABI/vaultyABI";
import { useNavigate } from "react-router-dom";
// import logo from "./";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import CopyToClipboard from "@uxui/copy-to-clipboard-react";
import CopyToClip from "../Components/CopyToClip";
import TokenInfo from "../Components/TokenInfo";

function CoinInformation(props) {
  const [connect, setConnect] = useState(false);
  const [isApprovedBuy, setIsApprovedBuy] = useState(true);
  const [Number, setNumber] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [Month, setMonth] = useState(0);
  const [Approval, setApproval] = useState(false);
  const [IsAlreadyStake, setIsAlreadyStake] = useState(false);
  const [UserData, setUserData] = useState(0);
  const [apy, setApy] = useState(0);
  const [UserBalance, setUserBalance] = useState(0);
  const [TotalStaked, setTotalStaked] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
  });
  const navigate = useNavigate();
  function copyText() {
    // set textarea to display block, then select the text inside the textarea
    let text = document.getElementById("holdtext");
    text.style.display = "block";
    text.select();
    // copy the text in the textarea
    try {
      let status = document.execCommand("Copy");
      if (!status) {
        console.log("Cannot copy text");
      } else {
        console.log("Copied");
      }
    } catch (err) {
      console.log(err);
      // handle error
    }
    text.style.display = "none";
  }
  useEffect(async () => {
    if (props.metamaskAddress != "") {
      setConnect(true);

      let isAlreadyStake = await new web3_.eth.Contract(
        StakingABI,
        staking
      ).methods
        .isAlreadyStaked(props.metamaskAddress)
        .call();

      let userData = await new web3_.eth.Contract(StakingABI, staking).methods
        .stakersDataset(props.metamaskAddress)
        .call();

      setIsAlreadyStake(isAlreadyStake);
      setUserData(userData);
      console.log("user data : ", UserData);

      let vaultyBalance = await new web3_.eth.Contract(
        vaultyABI,
        vaulty
      ).methods
        .balanceOf(props.metamaskAddress)
        .call();
      let MaturityDate = await new web3_.eth.Contract(
        StakingABI,
        staking
      ).methods
        .maturityDate(props.metamaskAddress)
        .call();
      setMaturityDate(MaturityDate);
      setUserBalance(vaultyBalance);
      let totalStakeAmount = await new web3_.eth.Contract(
        StakingABI,
        staking
      ).methods
        .totalStaked()
        .call();
      setTotalStaked(totalStakeAmount);

      console.log(isAlreadyStake, "User is already staked or not");
    } else {
      setConnect(false);
    }
  }, [props.metamaskAddress, IsAlreadyStake]);

  async function handleClick() {
    if (window.ethereum) {
      await ConnectMetamask();
      console.log("yess");

      setConnect(true);
      setIsApprovedBuy(true);
    } else {
      DisconnectWallet();
      await ConnectWeb3Wallet();

      setConnect(true);
      setIsApprovedBuy(true);
    }
  }
  return (
    <div>
      <div
        className="main-container"
        style={{ padding: "20px", height: "100vh" }}
      >
        <header className="main-header" style={{ marginBottom: 0 }}>
          <div
            className="main-header-content-container"
            style={{ justifyContent: "unset" }}
          >
            <header className="main-header">
              <div className="header-container">
                {/* Header navbar */}
                <nav className="main-header-navbar">
                  <img
                    src={logo}
                    alt="KeeSwap logo"
                    className="main-header-navbar__logo"
                    style={{ width: 250 }}
                    onClick={() => {
                      navigate("/");
                    }}
                  />
                  <ul
                    style={{
                      display: "flex",
                      justifyContent: "end ",
                      alignItems: "center",
                    }}
                  >
                    {connect ? (
                      <>
                        <li className="main-header-navbar__nav__item">
                          <a
                            href="#"
                            className="main-header-navbar__nav__link"
                            style={{
                              fontSize: "10px !important",
                              margin: "10px",
                              cursor: "pointer",
                            }}
                          >
                            {props.metamaskAddress &&
                              `${props.metamaskAddress.slice(
                                0,
                                3
                              )}..${props.metamaskAddress.slice(40, 42)}`}
                          </a>
                        </li>
                      </>
                    ) : null}

                    <li className="main-header-navbar__nav__item">
                      {connect ? (
                        <>
                          <a
                            className="main-header-navbar__nav__link disconnectButton"
                            onClick={() => {
                              setConnect(false);
                              DisconnectWallet();
                            }}
                          >
                            <span
                              style={{
                                borderRadius: "20px",
                                border: "1px solid green",
                                padding: 5,
                                color: "green",
                                fontSize: 10,
                                fontSize: "10px !important",
                                margin: "10px",
                                cursor: "pointer",
                              }}
                            >
                              Disconnect
                            </span>
                          </a>
                        </>
                      ) : (
                        <>
                          <a
                            className="main-header-navbar__nav__link disconnectButton"
                            style={{
                              borderRadius: "20px",
                              border: "1px solid green",
                              padding: 5,
                              color: "green",
                              cursor: "pointer",
                            }}
                            onClick={handleClick}
                          >
                            Connect Wallet
                          </a>
                        </>
                      )}
                    </li>
                  </ul>
                </nav>
                {/* Header content */}
              </div>
            </header>
          </div>
        </header>
        <TokenInfo />
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    metamaskAddress: state.ConnectivityReducer.metamaskAddress,
    metamaskConnect: state.ConnectivityReducer.metamaskConnect,
  };
};
export default connect(mapStateToProps, null)(CoinInformation);
