import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
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
import CounterComponent from "../Components/Counter";

function Staking(props) {
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

  async function doStaking(stakeAmount, stakeDuration) {
    return await new web3_.eth.Contract(StakingABI, staking).methods
      .poolStake(stakeAmount, stakeDuration)
      .send({ from: props.metamaskAddress });
  }

  async function tokenApprove(stakingContractAddr, amount) {
    return await new web3_.eth.Contract(vaultyABI, vaulty).methods
      .approve(stakingContractAddr, amount)
      .send({ from: props.metamaskAddress });
  }

  async function handleStake() {
    if (connect) {
      if (Approval) {
        const tkn = web3_.utils.toWei(Number.toString(), "Gwei");
        const output = await doStaking(tkn, Month)
          .then((res) => {
            Swal.fire("Success", "Staking Successfully", "success");
          })
          .catch((e) => {
            Swal.fire("error", "Please Try Again", "error");
            console.log(e);
          });
        setApproval(false);
      } else {
        Swal.fire("Warning", "Please Approve First", "warning");
      }
    } else {
      Swal.fire("Warning", "Please Connect to the Wallet First", "warning");
    }
  }

  async function handleUnStake() {
    if (connect) {
      return await new web3_.eth.Contract(StakingABI, staking).methods
        .unstake()
        .send({ from: props.metamaskAddress })
        .then((res) => {
          Swal.fire("Success", "Unstaking Successfully", "success");
        })
        .catch((e) => {
          Swal.fire("error", "Please Try Again", "error");
          console.log(e);
          setIsAlreadyStake(true);
        });
    } else {
      Swal.fire("Warning", "Please Connect to the Wallet First", "warning");
    }
  }

  async function handleApprove() {
    if (connect) {
      if (Number === "0") {
        Swal.fire("Warning", "Please Enter amount greater then 0", "warning");
      } else if (Month != 0) {
        if (Number != "") {
          let vaultyBalance = await new web3_.eth.Contract(
            vaultyABI,
            vaulty
          ).methods
            .balanceOf(props.metamaskAddress)
            .call();

          let isAlreadyStake = await new web3_.eth.Contract(
            StakingABI,
            staking
          ).methods
            .isAlreadyStaked(props.metamaskAddress)
            .call();
          const tkn = web3_.utils.toWei(Number.toString(), "Gwei");
          console.log(
            "Vaulty Balance : ",
            parseFloat(vaultyBalance) / Math.pow(10, 9)
          );

          if (parseFloat(vaultyBalance) >= tkn) {
            if (!isAlreadyStake) {
              console.log("Transaction Possible");
              await tokenApprove(staking, tkn)
                .then((res) => {
                  Swal.fire("Success", "Approve Succesfull", "success");
                  setApproval(true);
                })
                .catch((error) => {
                  Swal.fire("error", "Please Try Again", "error");
                });
            } else {
              Swal.fire("Warning", "User is already Staked", "warning");
            }
          } else {
            Swal.fire(
              "Warning",
              "User Does Not Have Sufficent Vaulty Tokens",
              "warning"
            );
          }
        } else {
          Swal.fire("Warning", "Please input number", "warning");
        }
      } else {
        Swal.fire("Warning", "Please select month", "warning");
      }
    } else {
      Swal.fire("Warning", "Please connect to the MetaMask", "warning");
    }
  }

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

  // console.log(new web3_.eth.Contract(StakingABI, staking));
  return (
    <div>
      <div className="main-container" style={{ padding: "20px" }}>
        <header className="main-header">
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

            <div class="login-box">
              <h2 style={{ fontSize: 22 }}>Choose Staking Duration</h2>
              <div
                style={{
                  display: "flex",
                  margin: "10 -5px",

                  justifyContent: "space-around",
                }}
              >
                <div>
                  <button
                    className="btnStake"
                    onClick={() => {
                      setMonth(1);
                      setSelectedMonth({
                        one: true,
                        two: false,
                        three: false,
                        four: false,
                      });
                      setApy(2);
                    }}
                    disabled={selectedMonth.one}
                  >
                    1 Month
                  </button>
                </div>
                <div>
                  <button
                    className="btnStake"
                    onClick={() => {
                      setMonth(2);
                      setApy(5);
                      setSelectedMonth({
                        one: false,
                        two: true,
                        three: false,
                        four: false,
                      });
                    }}
                    disabled={selectedMonth.two}
                  >
                    3 Months
                  </button>
                </div>
                <div>
                  <button
                    className="btnStake"
                    onClick={() => {
                      setMonth(3);
                      setApy(20);
                      setSelectedMonth({
                        one: false,
                        two: false,
                        three: true,
                        four: false,
                      });
                    }}
                    disabled={selectedMonth.three}
                  >
                    6 Months
                  </button>
                </div>
                <div>
                  <button
                    className="btnStake"
                    onClick={() => {
                      setMonth(4);
                      setApy(50);
                      setSelectedMonth({
                        one: false,
                        two: false,
                        three: false,
                        four: true,
                      });
                    }}
                    disabled={selectedMonth.four}
                  >
                    12 Months
                  </button>
                </div>
              </div>

              <form>
                <div
                  className="user-box"
                  style={{
                    margin: "5px",
                  }}
                >
                  <input
                    type="number"
                    min={1}
                    name
                    placeholder={"Enter Amount"}
                    required
                    value={Number}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        setNumber("");
                        Swal.fire("please enter valid value");
                        return;
                      } else {
                        setNumber(e.target.value);
                      }
                    }}
                    style={{ margin: 10 }}
                  />
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p className="cardFont">APY</p>
                  </div>
                  <div>
                    <p className="cardFont"> {apy} %</p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p className="cardFont">You staked : </p>
                  </div>
                  <div>
                    <p className="cardFont">
                      {" "}
                      {UserData && UserData.stackAmount / Math.pow(10, 9)} $VLT
                    </p>
                  </div>
                </div>

                <div
                  className="flexClass"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="cardFont">Your balance : </p>
                  </div>
                  <div>
                    <p className="cardFont">
                      {" "}
                      {UserBalance &&
                        parseFloat(UserBalance / Math.pow(10, 9)).toFixed(
                          3
                        )}{" "}
                      $VLT
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p className="cardFont">Total staked : </p>
                  </div>
                  <div>
                    <p className="cardFont">
                      {" "}
                      {TotalStaked / Math.pow(10, 9)} $VLT
                    </p>
                  </div>
                </div>
                {maturityDate == 0 ? null : (
                  <>
                    <h1>Maturity Time</h1>

                    <CounterComponent endDate={maturityDate} />
                    <p className="cardFont">
                      *Complete Maturity Time To Get Rewards.
                      <br />
                      *Pay Penelty If Unstaked Earlier.
                    </p>
                  </>
                )}

                {!IsAlreadyStake ? (
                  <>
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      {!Approval ? (
                        <>
                          <a
                            onClick={handleApprove}
                            style={{ cursor: "pointer" }}
                          >
                            <span />
                            <span />
                            <span />
                            <span />
                            Approve
                          </a>
                        </>
                      ) : (
                        <></>
                      )}

                      <a onClick={handleStake} style={{ cursor: "pointer" }}>
                        <span />
                        <span />
                        <span />
                        <span />
                        Stake
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <a onClick={handleUnStake}>
                      <span />
                      <span />
                      <span />
                      <span />
                      Unstake
                    </a>
                  </>
                )}
              </form>
            </div>
          </div>
        </header>
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
export default connect(mapStateToProps, null)(Staking);
