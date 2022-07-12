import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import icon3 from "../assets/icon3.svg";
import "./staking.css";
import { FaInfo } from "react-icons/fa";
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
        <header
          className="main-header"
          style={{ marginBottom: "10px !important" }}
        >
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
        <h1 className="text-5xl" style={{ textAlign: "center", padding: 20 }}>
          How To Participate ?
        </h1>
        <p className="text-3xl text-center color-[gray] opacity-[0.6]">
          Stake and earn additional VLT on top of purchased tokens and Vaulty
          App trading fees
        </p>
        <div class="login-box p-5">
          <div className="flex flex-wrap justify-between gap-4 ">
            <div className="flex justify-center md:justify-start ">
              <img src={logo} style={{ width: "50% " }} />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl text-gray">Claimable(USDT) Value</p>
              <p className="text-3xl text-bold">$0</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">APY</p>
              <p className="text-3xl">{apy}%</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">My VLT Staked</p>
              <p className="text-3xl">
                {" "}
                {UserData && UserData.stackAmount / Math.pow(10, 9)} $VLT
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl">Total Balance</p>
              <p className="text-3xl">
                {" "}
                {UserBalance &&
                  parseFloat(UserBalance / Math.pow(10, 9)).toFixed(3)}{" "}
                $VLT
              </p>
            </div>
          </div>
          <hr className="border-bg " />
          <div className="flex flex-col">
            <div className="flex p-2 m-4">
              <div className="flex-row md:flex-col justify-center">
                <button
                  onClick={() => {
                    setMonth(1);
                    setSelectedMonth({
                      one: true,
                      two: false,
                      three: false,
                      four: false,
                    });
                    setApy(1);
                  }}
                  disabled={selectedMonth.one}
                  class="px-4 py-2 mx-2 mb-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full"
                >
                  1 Month
                </button>
                <button
                  onClick={() => {
                    setMonth(2);
                    setSelectedMonth({
                      one: false,
                      two: true,
                      three: false,
                      four: false,
                    });
                    setApy(2);
                  }}
                  disabled={selectedMonth.two}
                  class="px-4 py-2 mx-2 mb-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full"
                >
                  3 Months
                </button>
                <button
                  onClick={() => {
                    setMonth(3);
                    setSelectedMonth({
                      one: false,
                      two: false,
                      three: true,
                      four: false,
                    });
                    setApy(3);
                  }}
                  disabled={selectedMonth.three}
                  class="px-4 py-2 mx-2 mb-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full"
                >
                  9 Months
                </button>
                <button
                  onClick={() => {
                    setMonth(4);
                    setSelectedMonth({
                      one: false,
                      two: false,
                      three: false,
                      four: true,
                    });
                    setApy(4);
                  }}
                  disabled={selectedMonth.four}
                  class="px-4 py-2 mx-2 mb-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full"
                >
                  12 Months
                </button>
              </div>
            </div>
            <div>
              <p className="text-2xl py-3">
                Stake VLT on Vaulty.pro to earn a portion of the platform’s
                revenue, distributed as VLT tokens.
              </p>
              <div className="p-1">
                <div className="flex items-start justify-center ">
                  <div className="flex flex-col md:flex-row rounded-3xl border-2 border-purple-500/75 p-2 items-start justify-center">
                    <span class="border border-white p-2 rounded-full ml-5 items-start ">
                      <FaInfo size={10} />
                    </span>
                    <p className="text-2xl text-gray p-2 text-justify opacity-[0.6]">
                      Ut wisi enim ad minim veniam, quis nostrud exerci tation
                      ullamcorper suscipit lobortis nisl ut aliquip ex ea
                      commodo consequat. Lorem ipsum dolor sit amet,
                      consectetuer adipiscing elit, sed diam nonummy nibh
                      euismod tincidunt ut laoreet
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-3 justify-around items-center md:flex-row ">
                <div className="border-bg flex flex-1 items-center rounded-2xl items-center ">
                  <div className="  px-0.5 py-0.5 flex flex-1 relative">
                    <div className="bg-[#020123] px-0.5 py-0.5 relative flex flex-1 rounded-2xl items-center">
                      <div className=" bg-[#020123]flex flex-1 relative flex-1 items-center">
                        <div class="flex-1 items-center">
                          {" "}
                          <span className="absolute bg-[#020123] -top-1.5 px-3 ml-10 text-[9px] md:text-xl">
                            Amount of VLT to Stake
                          </span>
                          <input
                            className="outline-transparent py-[14px] px-[20px] text-white bg-[#020123] w-full text-2xl rounded-2xl"
                            type="number"
                            min={1}
                            step={0.01}
                            name
                            placeholder={"Enter Amount"}
                            required
                            value={Number}
                            onChange={(e) => {
                              if (e.target.value < 0) {
                                setNumber("");
                                Swal.fire("Please Enter Valid Value");
                                return;
                              } else {
                                setNumber(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="ml-5">
                        <span className="border-bg py-2 px-3 text-xl rounded-full ">
                          Max
                        </span>
                      </div>
                      <div className="hidden md:block mr-1">
                        <img src={logo} width="80" />
                      </div>
                    </div>
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
                    <div className="flex-1 justify-center p-2 mx-auto">
                      {/* <button class="px-4 py-2 mx-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full">
                        Stake VLT
                      </button> */}
                      {Approval ? (
                        <>
                          <div className="border-bg flex-1 w-fit  mx-initial rounded-full">
                            <div className="px-0.5 py-0.5 relative w-fit">
                              <div
                                onClick={handleStake}
                                style={{ cursor: "pointer" }}
                                className="w-fit outline-transparent py-[8px] px-[8px] text-white bg-[#020123] w-full text-2xl rounded-full py-2 px-5"
                              >
                                Stake
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {" "}
                          <div className="border-bg flex-1 w-fit  mx-initial rounded-full">
                            <div className="px-0.5 py-0.5 relative w-fit">
                              <div
                                onClick={handleStake}
                                style={{ cursor: "pointer" }}
                                className="w-fit outline-transparent py-[8px] px-[8px] text-white bg-[#020123] w-full text-2xl rounded-full py-2 px-5"
                              >
                                Approve
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="flex-1 justify-center p-2 mx-initial">
                      {/* <button class="px-4 py-2 mx-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full">
                        Stake VLT
                      </button> */}
                      <div className="border-bg flex-1 w-fit  mx-auto rounded-full">
                        <div className="px-0.5 py-0.5 relative w-fit">
                          <div
                            onClick={handleUnStake}
                            style={{ cursor: "pointer" }}
                            className="w-fit outline-transparent py-[8px] px-[8px] text-white bg-[#020123] w-full text-2xl rounded-full py-2 px-5"
                          >
                            Unstake
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <h1 style={{ textAlign: "center", padding: 20, marginTop: 60 }}>
          Why Stake Your VLT?
        </h1>
        <div className="flex flex-wrap md:flex-unwrap justify-center gap-4">
          <div className="cards p-5  shadow-2xl rounded-xl mx-2">
            <div>
              <img src={icon1} style={{ maxWidth: "100px" }} />
              <p className="text-3xl text-white">Earn Rewards</p>
            </div>

            <div
              className="border-bg"
              style={{ height: 2, marginBottom: 6 }}
            ></div>
            <p className="text-2xl text-white">
              Rewards are given for actions that help the network reach
              consensus. You'll get rewards for running software that properly
              batches transactions into new blocks and checks the work of other
              validators because that's what keeps the chain running securely.
            </p>
          </div>
          <div className="w-[300px] p-5 cards rounded-xl mx-2">
            <div>
              <img src={icon2} style={{ maxWidth: "100px" }} />
              <p className="text-3xl text-white">Better Security</p>
            </div>
            <div
              className="border-bg"
              style={{ height: 2, marginBottom: 6 }}
            ></div>
            <p className="text-2xl text-white">
              Rewards are given for actions that help the network reach
              consensus. You'll get rewards for running software that properly
              batches transactions into new blocks and checks the work of other
              validators because that's what keeps the chain running securely.
            </p>
          </div>
          <div className="w-[300px] p-5 cards rounded-xl mx-2">
            <div>
              <img src={icon3} style={{ maxWidth: "100px" }} />
              <p className="text-3xl text-white">More Sustainable</p>
            </div>
            <div
              className="border-bg"
              style={{ height: 2, marginBottom: 6 }}
            ></div>
            <p className="text-2xl text-white">
              Stakers don't need energy-intensive computers to participate in a
              proof-of-stake system–just a home computer or smartphone. This
              will make Vaulty better for the environment.
            </p>
          </div>
        </div>
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
