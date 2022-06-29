import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import "./staking.css";
import "./airdrop.css";

import {
  ConnectMetamask,
  ConnectWeb3Wallet,
  DisconnectWallet,
  web3_,
} from "../Services";
import { airdrop, staking, vaulty } from "../Constants/Contaracts";
import { StakingABI } from "../Config/ABI/StakingABI";
import { vaultyABI } from "../Config/ABI/vaultyABI";
import { useNavigate } from "react-router-dom";
// import logo from "./";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { airdropABI } from "../Config/ABI/AirdopABI";

function Airdrop(props) {
  const [connect, setConnect] = useState(false);
  const [isApprovedBuy, setIsApprovedBuy] = useState(true);
  const [Number, setNumber] = useState("");
  const [task, setTask] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (props.metamaskAddress != "") {
      setConnect(true);
    } else {
      setConnect(false);
    }
  }, [props.metamaskAddress]);

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

  const getAirdop = async () => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      .getToken()
      .send({ from: props.metamaskAddress });
  };

  const vaultyBalanceOf = async () => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      .getAirdropBalance()
      .call();
  };

  const airDropUsersList = async () => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      .AirDropUsers()
      .call();
  };

  const airDropOwner = async () => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      ._owner()
      .call();
  };

  const airDropToken = async () => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      .TokenAmt()
      .call();
  };

  const isAddressInArray = async (addressList) => {
    return await new web3_.eth.Contract(airdropABI, airdrop).methods
      .isAddressInArray(addressList, props.metamaskAddress)
      .call();
  };

  async function claimAirdrop() {
    if (connect != true) {
      Swal.fire("Please Connect Wallet");
    } else {
      let aidropBalance = await vaultyBalanceOf(airdrop);
      console.log(aidropBalance, "Balance of Airdop");

      let allUsers = await airDropUsersList();
      console.log(allUsers, "users list");
      // let airOwner = await airDropOwner();
      // console.log(airOwner, "Air Dop Owner");
      let airToken = await airDropToken();
      console.log(airToken, "Air Dop Owner");
      let userAlready = await isAddressInArray(allUsers);
      console.log(userAlready, "User already present or not");
      if (userAlready == false) {
        if (parseFloat(aidropBalance) >= parseFloat(airToken)) {
          console.log("Airdop Called");
          await getAirdop()
            .then((res) =>
              Swal.fire("Success", "Airdop Claim Successfully", "success")
            )
            .catch(() => Swal.fire("error", "Please try again.", "error"));
        } else {
          Swal.fire("AirDrop does not have sufficent fund");
        }
      } else {
        Swal.fire("User Already Exist");
      }

      // if (isAddressInArray(AirdropUsers, msg.sender) == false, "User already claimed"){
      //   pass
      // }else{
      //   error
      // }
    }
  }
  return (
    <div>
      <div className="main-containerCls">
        <header className="main-header">
          <div
            className="main-header-content-container"
            style={{ justifyContent: "center" }}
          >
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
            <div class="container">
              <div class="neon">Be A Millionaire! </div>
              <div class="flux">
                Participate in #cryptocontest Just follow <b>5</b> simple steps.
              </div>
              <div class="flux">
                The First 1 Lakh users will get 100 tokens instantly.
              </div>
            </div>

            <>
              <div
                className="main-header-content-container flexDirRev"
                style={{ justifyContent: "space-around", margin: 10 }}
              >
                <div
                  className="main-header-content-principal"
                  style={{ flexDirection: "column" }}
                >
                  <h1
                    className="main-header-content-principal__title"
                    style={{ fontSize: 18 }}
                  >
                    <h1>Step 1:</h1>
                    <h1>
                      Follow <span>#Vaultypro </span> &amp;
                      <span className=""> #VaultyWallet</span>
                    </h1>
                  </h1>
                  <a
                    href="https://twitter.com/intent/tweet?button_hashtag=#Vaultypro #VaultyWallet&ref_src=twsrc%5Etfw"
                    class="twitter-hashtag-button"
                    target="_blank"
                    data-show-count="false"
                    className="main-header-navbar__nav__link disconnectButton"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid green",
                      padding: 10,
                      color: "green",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedMonth({ ...selectedMonth, one: true });
                    }}
                  >
                    {selectedMonth.one ? (
                      <> Completed </>
                    ) : (
                      <>Tweet #Vaultypro #VaultyWallet</>
                    )}
                  </a>
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Twitter_logo.svg/2560px-Twitter_logo.svg.png"
                  style={{ width: 100 }}
                  alt
                  className=""
                />
              </div>
            </>
            <>
              <div
                className="main-header-content-container"
                style={{ justifyContent: "space-around", margin: 10 }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/2048px-Facebook_f_logo_%282021%29.svg.png"
                  style={{ width: 100 }}
                  alt
                  className=""
                />
                <div
                  className="main-header-content-principal"
                  style={{ flexDirection: "column" }}
                >
                  <h1
                    className="main-header-content-principal__title"
                    style={{ fontSize: 18 }}
                  >
                    <h1>Step 2:</h1>
                    <h1>
                      Join <span>Facebook Page</span>
                    </h1>
                  </h1>

                  <a
                    className="main-header-navbar__nav__link disconnectButton"
                    href="https://www.facebook.com/VaultyPRO"
                    target="_blank"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid green",
                      padding: 10,
                      color: "green",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedMonth({ ...selectedMonth, two: true });
                    }}
                  >
                    {selectedMonth.two ? (
                      <> Completed </>
                    ) : (
                      <> Follow On Facebook</>
                    )}
                  </a>
                </div>
              </div>
            </>
            <>
              <div
                className="main-header-content-container flexDirRev"
                style={{ justifyContent: "space-around" }}
              >
                <div
                  className="main-header-content-principal"
                  style={{ flexDirection: "column" }}
                >
                  <h1
                    className="main-header-content-principal__title"
                    style={{ fontSize: 18 }}
                  >
                    <h1>Step 3:</h1>

                    <h1>
                      Tag <span>3 Friends</span>
                      <span className=""> In Comment Section</span>
                    </h1>
                  </h1>

                  <a
                    className="main-header-navbar__nav__link disconnectButton"
                    href="https://www.facebook.com/VaultyPRO"
                    target="_blank"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid green",
                      padding: 10,
                      color: "green",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedMonth({ ...selectedMonth, three: true });
                    }}
                  >
                    {selectedMonth.three ? <> Completed </> : <> Comment </>}
                  </a>
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/2048px-Facebook_f_logo_%282021%29.svg.png"
                  style={{ width: 100 }}
                  alt
                  className=""
                />
              </div>
            </>

            <>
              {" "}
              <div
                className="main-header-content-container "
                style={{ justifyContent: "space-around", margin: 10 }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png"
                  style={{ width: 100 }}
                  alt
                  className=""
                />
                <div
                  className="main-header-content-principal"
                  style={{ flexDirection: "column" }}
                >
                  <h1
                    className="main-header-content-principal__title"
                    style={{ fontSize: 18 }}
                  >
                    <h1>Step 4: </h1>
                    <h1>
                      Put A <span>Story Mentioning Us</span>
                    </h1>
                  </h1>

                  <a
                    className="main-header-navbar__nav__link disconnectButton"
                    href="https://www.instagram.com/vaultypro/"
                    target="_blank"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid green",
                      padding: 10,
                      color: "green",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedMonth({ ...selectedMonth, four: true });
                    }}
                  >
                    {selectedMonth.four ? (
                      <> Completed </>
                    ) : (
                      <> Story Instagram</>
                    )}
                  </a>
                </div>
              </div>
            </>
            <>
              <div
                className="main-header-content-container flexDirRev"
                style={{ justifyContent: "space-around" }}
              >
                <div
                  className="main-header-content-principal"
                  style={{ flexDirection: "column" }}
                >
                  <h1
                    className="main-header-content-principal__title"
                    style={{ fontSize: 18 }}
                  >
                    <h1>Step 5: </h1>
                    <h1>
                      Join <span>Our</span>
                      <span className=""> Telegram Group</span>
                    </h1>
                  </h1>

                  <a
                    className="main-header-navbar__nav__link disconnectButton"
                    href="https://t.me/vaultypro"
                    target="_blank"
                    style={{
                      borderRadius: "50px",
                      border: "2px solid green",
                      padding: 10,
                      color: "green",
                      cursor: "pointer",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      setSelectedMonth({ ...selectedMonth, five: true });
                    }}
                  >
                    {selectedMonth.five ? (
                      <> Completed </>
                    ) : (
                      <> Join Telegram</>
                    )}
                  </a>
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png"
                  style={{ width: 100 }}
                  alt
                  className=""
                />
              </div>
            </>
          </div>
          {selectedMonth.one &&
          selectedMonth.two &&
          selectedMonth.three &&
          selectedMonth.four &&
          selectedMonth.five ? (
            <>
              <a
                className="main-header-navbar__nav__link disconnectButton"
                style={{
                  borderRadius: "50px",
                  border: "2px solid green",
                  padding: 10,
                  margin: 20,
                  marginLeft: "50%",
                  marginTop: "5%",
                  color: "green",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                onClick={claimAirdrop}
              >
                Claim Airdrop
              </a>
            </>
          ) : (
            <h1
              style={{
                textAlign: "center",
                fontSize: 26,
                color: "white",
                margin: "15px 0",
              }}
            >
              Please Complete tasks
            </h1>
          )}
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
export default connect(mapStateToProps, null)(Airdrop);
