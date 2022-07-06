import React, { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import "./staking.css";
import "./airdrop.css";
import image1 from "../assets/airdrop/airdrop/image1.gif";
import image2 from "../assets/airdrop/airdrop/image2.svg";
import image3 from "../assets/airdrop/airdrop/image3.svg";
import image4 from "../assets/airdrop/airdrop/image4.svg";
import image5 from "../assets/airdrop/airdrop/image5.svg";
import image6 from "../assets/airdrop/airdrop/image6.svg";
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
      .getUsersList()
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
      <div
        className="main-containerCls heightCls"
        style={{
          backgroundImage: `url(${image1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
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
          </div>
        </header>
        <>
          <h1 style={{ textAlign: "center" }} className="neon">
            Airdrop
          </h1>
          <h1 style={{ padding: 5, textAlign: "center", fontSize: 22 }}>
            How To Participate?
          </h1>
          <div
            className="main-header-content-container "
            style={{ justifyContent: "center" }}
          >
            <div
              className="main-header-content-principal"
              style={{ flexDirection: "column", width: "20%" }}
            >
              <a
                href="https://twitter.com/VaultyPRO"
                target="_blank"
                onClick={() => {
                  setSelectedMonth({ ...selectedMonth, one: true });
                }}
              >
                {selectedMonth.one ? (
                  <img
                    src={image3}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                ) : (
                  <img
                    src={image3}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                )}
              </a>
            </div>
            <div
              className="main-header-content-principal"
              style={{ flexDirection: "column", width: "20%" }}
            >
              <a
                href="https://www.facebook.com/VaultyPRO
"
                target="_blank"
                onClick={() => {
                  setSelectedMonth({ ...selectedMonth, two: true });
                }}
              >
                {selectedMonth.two ? (
                  <img
                    src={image4}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                ) : (
                  <img
                    src={image4}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                )}
              </a>
            </div>
            <div
              className="main-header-content-principal"
              style={{ flexDirection: "column", width: "20%" }}
            >
              <a
                href="https://discord.com/invite/EXuUuxn5"
                target="_blank"
                onClick={() => {
                  setSelectedMonth({ ...selectedMonth, three: true });
                }}
              >
                {selectedMonth.three ? (
                  <img
                    src={image5}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                ) : (
                  <img
                    src={image5}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                )}
              </a>
            </div>
            <div
              className="main-header-content-principal hover:translate-y-6"
              style={{ flexDirection: "column", width: "20%" }}
            >
              <a
                href="https://www.instagram.com/vaultypro/"
                target="_blank"
                onClick={() => {
                  setSelectedMonth({ ...selectedMonth, four: true });
                }}
              >
                {selectedMonth.four ? (
                  <img
                    src={image6}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                ) : (
                  <img
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                    src={image6}
                    width="200"
                  />
                )}
              </a>
            </div>
            <div
              className="main-header-content-principal"
              style={{
                flexDirection: "column",
                maxWidth: "300px !important",
                width: "20%",
              }}
            >
              <a
                href="https://t.me/vaultypro"
                target="_blank"
                onClick={() => {
                  setSelectedMonth({ ...selectedMonth, five: true });
                }}
              >
                {selectedMonth.five ? (
                  <img
                    src={image2}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                ) : (
                  <img
                    src={image2}
                    width="200"
                    className="hover:-translate-y-6 transition ease-in-out delay-550"
                  />
                )}
              </a>
            </div>
          </div>
        </>
        {selectedMonth.one &&
        selectedMonth.two &&
        selectedMonth.three &&
        selectedMonth.four &&
        selectedMonth.five ? (
          <>
            <div className="flex justify-center my-3">
              <button
                className="glow-on-hover"
                style={{ width: "300px", height: "auto", padding: 10 }}
              >
                Claim Airdrop
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center my-3">
            <button
              className="glow-on-hover"
              style={{ width: "300px", height: "auto", padding: 10 }}
            >
              Please Complete All Tasks
            </button>
          </div>
        )}
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
