/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import moment from "moment";
import Vaulty from "./assets/VaultyWp.pdf";
import RoadmapPc from "./assets/roadmap-01.svg";
import RoadmapMobile from "./assets/roadmap-02.svg";
import logo from "./assets/logo.svg";
import bgImg from "./assets/ilustrator.png";
import cardicon1 from "./assets/cardicon1.png";
import cardicon2 from "./assets/cardicon2.png";
import cardicon3 from "./assets/cardicon3.png";
import side1 from "./assets/side1.png";
import side2 from "./assets/side2.png";
import pancakeswap from "./assets/pancakesswap.png";
import bnb from "./assets/binance.png";
import keeToken from "./assets/keetoken.png";
import side3 from "./assets/side3.png";
import Swal from "sweetalert2";
import bgImg2 from "./assets/banner_vector3.png";
import CoinMoon from "./assets/coinmooner.png";
import CoinGecko from "./assets/coingekco.png";
import Coinod from "./assets/Coinsgods.png";
import CoinScope from "./assets/coinscope.png";
import CoinMarket from "./assets/Coinmarketcap01.png";
import { connect } from "react-redux";
import { ConnectMetamask, DisconnectWallet, web3_ } from "./Services/index";
import { ConnectWeb3Wallet } from "./Services";
// Create a connector

import "./App.css";
import { useEffect, useState } from "react";

import { busdContract, ico } from "./Constants/Contaracts";
import Spinner from "react-spinkit";
import { busdAbi, icoAbi } from "./Constants/Abi";
import { store } from "./Redux/store";
import { ProgressBar } from "react-bootstrap";
import CounterComponent from "./Components/Counter";
function App(props) {
  const [connect, setConnect] = useState(false);
  const [sale, setSale] = useState(true);
  const [tokenData, setTokenData] = useState("");
  const [isApprovedBuy, setIsApprovedBuy] = useState(true);
  const [details, setDetails] = useState([]);
  const [token, setToken] = useState("");
  const [spinnerAppr, setSpinnerAppr] = useState(false);
  const [kees, setKees] = useState("");
  const [spinnerBuy, setSpinnerBuy] = useState(false);
  const [addApprove, setAddAppr] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const [addBuy, setBuyAddr] = useState("");
  const [counter, setCounter] = useState(0);
  const [isApproved, setIsApproved] = useState(true);
  const [error, setError] = useState("");

  useEffect(async () => {
    console.log("New Address ", props.metamaskAddress);
    localStorage.setItem("Address", props.metamaskAddress);

    if (!isApproved) {
      DisconnectWallet();
      setToken("");
      setIsApproved(true);

      setKees("");
    }
    if (props.metamaskAddress != "") {
      if (counter > 0) {
      } else {
        const res = await new web3_.eth.Contract(icoAbi, ico).methods
          .getTokenomics()
          .call();
        setDetails(res);
        const icoOver = await new web3_.eth.Contract(icoAbi, ico).methods
          .isIcoOver()
          .call();
        setSale(icoOver);
        console.log("ico khatam", icoOver);
        setDetails(res);
        setTokenData(
          await new web3_.eth.Contract(icoAbi, ico).methods
            .showAllTrade()
            .call()
        );
        setCounter(counter + 1);
      }
    }
  }, [props.metamaskAddress]);
  useEffect(() => {
    DisconnectWallet();
  }, []);

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

  async function handleChange(e) {
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if (isNumeric(e.target.value)) {
      setError("");
      setToken(e.target.value);

      console.log(details[2] / Math.pow(10, 18));
      setKees(
        e.target.value / parseFloat(details[2] / Math.pow(10, 18)).toFixed(4)
      );
    } else {
      setKees("");
      setError("Please Enter Numbers In Input");
      setToken("");
      return;
    }
  }

  async function handleApprove() {
    if (!connect) {
      Swal.fire("Please connect Metamask");
      setToken("");
      setKees("");
      setIsApproved(true);
      setIsApprovedBuy(true);
    } else {
      setSpinnerAppr(true);
      let res = await new web3_.eth.Contract(busdAbi, busdContract).methods
        .balanceOf(props.metamaskAddress)
        .call();

      console.log(res / Math.pow(10, 18), token);
      let addAppr = store.getState().ConnectivityReducer.metamaskAddress;
      setAddAppr(addAppr);

      const tkn = web3_.utils.toWei(token.toString(), "ether");

      console.log(res / Math.pow(10, 18) < parseFloat(token));
      if (res / Math.pow(10, 18) > parseFloat(token)) {
        await new web3_.eth.Contract(busdAbi, busdContract).methods
          .approve(ico, tkn)
          .send({
            from: props.metamaskAddress,
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash);
          })
          .on("confirmation", () => {})
          // get New Contract Address
          .then(async (res) => {
            Swal.fire("Transaction Successful", "", "success");
            setIsApproved(false);
            setInputDisable(true);
            setSpinnerAppr(false);
            setIsApprovedBuy(false);
          })
          .catch((err) => {
            console.log(err);
            Swal.fire(
              "Transaction Failed",
              "Please Try After Some Time",
              "error"
            );
            setToken("");
            setKees("");
            setIsApproved(true);
            setSpinnerAppr(false);
          });
      } else {
        Swal.fire(
          `Please Enter Atleast ${token} BUSD In Your Account To Intiate This Transaction.`
        );
        setToken("");
        setKees("");
        setIsApproved(true);
        setIsApprovedBuy(true);
        setSpinnerAppr(false);
      }
    }
  }

  async function handleBuy() {
    const tkn = web3_.utils.toWei(token.toString(), "ether");
    setSpinnerBuy(true);
    if (details && details[3] > Math.floor(new Date().getTime() / 1000.0)) {
      Swal.fire(
        `Investment will start from ${moment
          .unix(details[3])
          .format("DD/MM/YYYY")}`
      );
      setToken("");
      setKees("");
      setInputDisable(false);
      setIsApproved(true);
      setIsApprovedBuy(true);
      setSpinnerAppr(false);
      setSpinnerBuy(false);
    } else {
      await new web3_.eth.Contract(icoAbi, ico).methods
        .SaleICOToken(tkn)
        .send({
          from: props.metamaskAddress,
        })
        .then((res) => {
          console.log(res);
          setSpinnerBuy(false);
          Swal.fire("Transaction Successful", "", "success");
          setToken("");
          setIsApproved(true);
          setSpinnerAppr(false);
          setKees("");
        })

        .catch((err) => {
          setSpinnerBuy(false);
          console.log(err);
          Swal.fire(
            "Transaction Failed",
            "Please Try After Some Time",
            "error"
          );
        });
    }
    console.log(await new web3_.eth.Contract(icoAbi, ico).methods);
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-container">
          {/* Header navbar */}
          <nav className="main-header-navbar">
            <img
              src={logo}
              alt="KeeSwap logo"
              className="main-header-navbar__logo"
              style={{ width: 160 }}
            />
            <ul className="main-header-navbar__nav">
              <li className="main-header-navbar__nav__item">
                <a href="#" className="main-header-navbar__nav__link">
                  Home
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#about" className="main-header-navbar__nav__link">
                  Buy
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#features" className="main-header-navbar__nav__link">
                  Values
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#price" className="main-header-navbar__nav__link">
                  Price
                </a>
              </li>
              <li className="main-header-navbar__nav__item">
                <a href="#roadmap" className="main-header-navbar__nav__link">
                  Roadmap
                </a>
              </li>
              {connect ? (
                <>
                  <li className="main-header-navbar__nav__item">
                    <a href="#" className="main-header-navbar__nav__link">
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
          <div className="main-header-content-container">
            <div className="main-header-content-principal">
              <h1 className="main-header-content-principal__title">
                Fastest &amp; <span>secure platform </span> to invest in{" "}
                <span className=""> crypto</span>
              </h1>
              <p className="main-header-content-principal__description typewriter">
                Buy cryptocurrencies, trusted by various users.
              </p>
            </div>
            <img
              src={bgImg}
              alt
              className="main-header-content-principal__illustration ball"
            />
          </div>
        </div>
      </header>
      <main className="main-content">
        {/* Why us section */}
        <section className="why-us-wrapper">
          {/* Stats */}
          <div className="stats-section">
            <div className="stats-section__reference">
              <i className="fas fa-chart-line" />
              <h3 className="stats-section__reference__title">$VLT</h3>
              <p className="stats-section__reference__description">Staking</p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-user" />
              <h3 className="stats-section__reference__title">
                Custom Credit Card
              </h3>
              <p className="stats-section__reference__description">
                Vaulty Master Card
              </p>
            </div>
            <div className="stats-section__reference">
              <i className="fas fa-globe" />
              <h3 className="stats-section__reference__title">Mobile App</h3>
              <p className="stats-section__reference__description">
                NFT and Crypto Bridge
              </p>
            </div>
          </div>
          {/* Why us */}
          <div className="why-us-section" id="about">
            <div className="why-us-section__content">
              <h2 className="why-us-section__content__title">
                Why you should choose Vaulty?
              </h2>
              <p className="why-us-section__content__description">
                VAULTY is a digital finances app, with digital assets that
                combine wallets to send, receive, exchange, earn and borrow
                (All-In-One Wallet System). Under the direction of Mr. Saitej,
                Vaulty was founded with a vision to uplift trust and security
                throughout the digital spectrum and with that, a group of
                technical and marketing teams has been established in Dubai,
                Estonia & India..
              </p>
              {/* <a className="why-us-section__content__btn" onClick={handelPopup}>
                Buy Now
              </a> */}
              {console.log(
                details &&
                  details[3] < Math.floor(new Date().getTime() / 1000.0)
              )}
              {!sale ? (
                <>
                  <div className="flexDiv">
                    <div>
                      <h3
                        className="why-us-section__content__title"
                        style={{ textAlign: "center", color: "black" }}
                      >
                        Buy Vaulty
                      </h3>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          onChange={handleChange}
                          placeholder="Enter Amount To Buy"
                          style={{
                            padding: 8,
                            marginTop: 10,
                            width: "100%",
                            color: "black",
                          }}
                          value={token}
                          disabled={inputDisable}
                        />
                        <div
                          style={{
                            padding: 5,
                            border: "1px solid black",
                            width: "85px",
                            justifyContent: "space-around",
                            marginTop: "10px",
                            borderRadius: 7,
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img src={bnb} width="20" />
                          <div>BUSD</div>
                        </div>
                      </div>

                      <span>
                        <p style={{ color: "red" }}>{error}</p>
                      </span>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder={`${kees} $VLT`}
                          style={{
                            padding: 10,
                            marginTop: 10,
                            width: "100%",
                            background: "white",
                          }}
                          disabled
                        />
                        <div
                          style={{
                            padding: 5,
                            border: "1px solid black",
                            width: "85px",
                            justifyContent: "space-around",
                            marginTop: "10px",
                            borderRadius: 7,
                            marginLeft: 8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img src={keeToken} width="20" />
                          <div>$VLT</div>
                        </div>
                      </div>
                    </div>

                    <div className="flexDivBtn">
                      <button
                        className="why-us-section__content__btn"
                        onClick={handleApprove}
                        disabled={token == "" || isApproved == false}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {spinnerAppr ? (
                            <Spinner
                              name="circle"
                              style={{ width: 30, height: 30 }}
                            />
                          ) : (
                            <>Approve</>
                          )}
                        </div>
                      </button>
                      <button
                        className="why-us-section__content__btn"
                        onClick={handleBuy}
                        disabled={isApproved || isApprovedBuy}
                      >
                        {spinnerBuy ? (
                          <Spinner
                            name="circle"
                            style={{ width: 30, height: 30 }}
                          />
                        ) : (
                          <>Buy</>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: 28, color: "white" }}>
                    ICO Is Over You Can Not Invest
                  </h1>
                </>
              )}
            </div>
            <img
              src={bgImg2}
              alt
              className="why-us-section__illustration ball imgCls"
            />
          </div>
          {connect ? (
            <>
              <div className="benefits-section" id="price">
                <h2 className="benefits-section__title">
                  Check how much you can <span>earn</span>
                </h2>
                <p className="benefits-section__description">
                  Vaulty also provides the user an opportunity to convert its
                  crypto into fiat and vice-versa
                </p>
                <div className="card-info">
                  <h2
                    className="card-info__title"
                    style={{ textAlign: "center", padding: 10, fontSize: 20 }}
                  >
                    Token Information{" "}
                  </h2>
                  <div>
                    <h4
                      className="card-info__title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Presale Rate :</div>
                      <div>{details && details[2] / Math.pow(10, 18)} BUSD</div>
                    </h4>
                    <h4
                      className="card-info__title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Start Time :</div>
                      <div>
                        {details &&
                          moment.unix(details[3]).format("DD/MM/YYYY")}
                      </div>
                    </h4>
                    <h4
                      className="card-info__title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>End Time :</div>
                      <div>
                        {details &&
                          moment.unix(details[4]).format("DD/MM/YYYY")}
                      </div>
                    </h4>
                    <h4
                      className="card-info__title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>User Will Get :</div>
                      <div>
                        {kees + " "}
                        $VLT
                      </div>
                    </h4>
                    <h4
                      className="card-info__title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Vesting Round :</div>
                      <div>0</div>
                    </h4>
                    {!sale && <CounterComponent endDate={details[4]} />}
                  </div>

                  <p className="card-info__description">
                    {!sale && (
                      <ProgressBar
                        animated
                        now={(details[5] / details[7]) * 100}
                      />
                    )}
                  </p>
                  <span className="card-info__advice">
                    Revenue will change based on mining difficulty and BUSD
                    Price.
                  </span>
                </div>
              </div>
            </>
          ) : null}
        </section>
        {/* Cryptocurrencies section */}
        <section className="cryptocurrencies-section" id="products">
          <h2 className="cryptocurrencies-section__title">
            Advantages Of Using Vaulty
          </h2>
          <div className="cryptocurrencies-info-cards">
            <div className="info-card">
              <img src={cardicon1} width="60" />
              <h3 className="info-card__title">CRYPTO TRADERS </h3>
              <p className="info-card__description">
                The platform will enable cryptocurrency traders to buy and sell
                cryptocurrencies.
              </p>
            </div>
            <div className="info-card">
              <img src={cardicon2} width="60" />
              <h3 className="info-card__title">TOKEN TO COIN (T2C)</h3>
              <p className="info-card__description">
                A feature pioneered by Vaulty to exchange Token to Coin. This
                feature enables new token companies to list on Vaulty.
              </p>
            </div>
            <div className="info-card">
              <img src={cardicon3} width="60" />
              <h3 className="info-card__title">
                CROSS-BORDER TRANSACTIONS WITH IBAN
              </h3>
              <p className="info-card__description">
                Users can transfer currencies and conduct transactions around
                the world using their Vaulty wallet.
              </p>
            </div>
          </div>
        </section>
        {/* Features section */}
        <section className="features-section" id="features">
          <h2 className="features-section__title">Our Core Values</h2>
          <article className="invest-smart-article">
            <div className="invest-smart-article__content">
              <h3 className="invest-smart-article__content__title">
                Community
              </h3>
              <p className="invest-smart-article__content__description">
                The Vaulty ecosystem's most valuable asset is its community.
              </p>
            </div>
            <img
              src={side1}
              style={{ width: 300 }}
              alt="Crypto stats"
              className="invest-smart-article__graphic"
            />
          </article>
          <article className="detailed-stats-article">
            <div className="detailed-stats-article__content">
              <h3 className="detailed-stats-article__content__title">
                Utility
              </h3>
              <p className="detailed-stats-article__content__description">
                In the Crypto realm, we believe utility is the cornerstone.
              </p>
            </div>
            <img
              src={side2}
              style={{ width: 300 }}
              alt="Detailed statistics"
              className="detailed-stats-article__graphic"
            />
          </article>
          <article className="grow-profit-article">
            <div className="grow-profit-article__content">
              <h3 className="grow-profit-article__content__title">
                Inclusivity
              </h3>
              <p className="grow-profit-article__content__description">
                At Vaulty we put inclusivity at the center of our purpose.
              </p>
            </div>
            <img
              src={side3}
              style={{ width: 300, height: 400 }}
              alt="Profit graphic"
              className="grow-profit-article__graphic"
            />
          </article>
          {/* <div class="basr-social-share social">
            <ul class="">
              <li>
                <a class="facebook" href="">
                  <i class="fa fa-facebook"></i>
                  <span>Facebook</span>
                </a>
              </li>

              <li>
                <a class="twitter" href="">
                  <i class="fa fa-twitter"></i>
                  <span>Twitter</span>
                </a>
              </li>

              <li>
                <a class="googleplus" href="">
                  <i class="fa fa-google-plus"></i>
                  <span>Google Plus</span>
                </a>
              </li>

              <li>
                <a class="linkedin" href="">
                  <i class="fa fa-linkedin"></i>
                  <span>Linkedin</span>
                </a>
              </li>

              <li>
                <a class="tumblr" href="">
                  <i class="fa fa-tumblr"></i>
                  <span>Tumblr</span>
                </a>
              </li>
            </ul>
          </div> */}
        </section>
        <section>
          <h1
            style={{
              textAlign: "center",
              margin: "0 auto",
              textAlign: "center",
              fontSize: 30,
              color: "aliceblue",
              padding: 40,
            }}
          >
            See Us At
          </h1>
          <div
            className="Social"
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: 60,
            }}
          >
            <img src={CoinGecko} className="socialWidth" />

            <img src={CoinMoon} className="socialWidth" />

            <img src={CoinScope} className="socialWidth" />

            <img src={Coinod} className="socialWidth" />
            <img src={CoinMarket} className="socialWidth" />
            <img src={pancakeswap} className="socialWidth" />
          </div>
        </section>
      </main>
      {/* Call To Action */}

      <section id="roadmap">
        <img src={RoadmapPc} className="widthCls" />
        <img src={RoadmapMobile} className="widthClsMobile" />
      </section>

      {/* Main footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <img
            src={logo}
            alt="KeeSwap company logo"
            className="main-footer__logo"
          />
          {/* Footer navs */}
          <nav className="main-footer-navbar">
            {/* Quick Link nav */}
            <ul className="main-footer-navbar__nav">
              <li className="main-footer-navbar__nav__item">
                <h3 className="main-footer-navbar__nav__title">Quick Link</h3>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#" className="main-footer-navbar__nav__link">
                  Home
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#about" className="main-footer-navbar__nav__link">
                  Buy
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#features" className="main-footer-navbar__nav__link">
                  Values
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#price" className="main-footer-navbar__nav__link">
                  Price
                </a>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a href="#roadmap" className="main-footer-navbar__nav__link">
                  Roadmap
                </a>
              </li>
            </ul>
            {/* Resources link */}
            <ul className="main-footer-navbar__nav">
              <li className="main-footer-navbar__nav__item">
                <h3 className="main-footer-navbar__nav__title">Resources</h3>
              </li>
              <li className="main-footer-navbar__nav__item">
                <a
                  href={Vaulty}
                  target="_blank"
                  rel="noreferrer"
                  className="main-footer-navbar__nav__link"
                >
                  Download Whitepaper
                </a>
              </li>
            </ul>
          </nav>
          {/* Payment systems */}

          {/* Copy and social links */}
          <div className="copy-and-social">
            <h3
              className="copy-and-social__copy"
              style={{ color: "aliceblue" }}
            >
              ©2022 Vaulty. All rights reserved
            </h3>
            <div className="social-icons">
              <i className="fab fa-facebook-f" />
              <i className="fab fa-instagram" />
              <i className="fab fa-youtube" />
              <i className="fab fa-twitter" />
              <i className="fab fa-linkedin-in" />
            </div>
          </div>
        </div>
      </footer>
      {/* Attribution footer */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    metamaskAddress: state.ConnectivityReducer.metamaskAddress,
    metamaskConnect: state.ConnectivityReducer.metamaskConnect,
  };
};
export default connect(mapStateToProps, null)(App);
