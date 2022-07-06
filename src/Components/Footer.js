import React from "react";
import "./footer.css";
import logo from "../assets/logo.svg";
import pdf from "../assets/VaultyWp.pdf";
export default function Footer() {
  return (
    <div>
      {" "}
      <footer className="text-center bg-[#0d0d2b] text-white">
        <div className="flex justify-evenly p-20 items-center">
          <img src={logo} alt="Vaulty Logo" className="main-footer__logo" />
          <div className="flex flex-wrap items-center justify-center">
            <a
              class="app-btn blu flex flex-col items-center vert"
              href="http:apple.com"
            >
              <i class="fab fa-apple"></i>
              <p>
                <span class="big-txt">App Store</span>
              </p>
            </a>

            <a
              class="app-btn blu flex flex-col items-center vert"
              href="http:google.com"
            >
              <i class="fab fa-google-play"></i>
              <p>
                <span class="big-txt">Google Play</span>
              </p>
            </a>
          </div>
        </div>

        <div className="container px-6 pt-6 social-icons">
          <div className="grid lg:grid-cols-4 md:grid-cols-2">
            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5">Company</h5>
              <ul className="list-none mb-0">
                <li>
                  <a href="#!" className="text-white">
                    About Vaulty
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-white">
                    Vaulty Media
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-white">
                    Link 3
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-white">
                    Link 4
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5">Products</h5>
              <ul className="list-none mb-0">
                <li>
                  <a href="#!" className="text-white">
                    Company
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-white">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#!" className="text-white">
                    COnditions
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h5 className="uppercase font-bold mb-2.5">Conditions</h5>
              <ul className="list-none mb-0">
                <li>
                  <a href="#" className="text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#buy" className="text-white">
                    Buy
                  </a>
                </li>
                <li>
                  <a href="#values" className="text-white">
                    Values
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="text-white">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div class="main">
              <div>
                <h3>Contact Us</h3>
              </div>
              <div className="flex ">
                <a
                  href="https://www.instagram.com/vaultypro/"
                  target="_blank"
                  class="nav-item"
                >
                  <div class="nav-links">
                    <i class="fab fa-instagram"></i>
                  </div>
                  <span class="nav-link-text">Instagram</span>
                </a>
                <a
                  href="https://twitter.com/VaultyPRO"
                  target="_blank"
                  class="nav-item"
                >
                  <div class="nav-links transition-all">
                    <i class="fab fa-twitter"></i>
                  </div>
                  <span class="nav-link-text">Twitter</span>
                </a>
                <a
                  href="https://www.facebook.com/VaultyPRO"
                  target="_blank"
                  class="nav-item"
                >
                  <div class="nav-links transition-all">
                    <i class="fab fa-facebook"></i>
                  </div>
                  <span class="nav-link-text">Facebook</span>
                </a>
                <a
                  href="https://t.me/vaultypro"
                  target="_blank"
                  class="nav-item"
                >
                  <div class="nav-links transition-all">
                    <i class="fab fa-telegram"></i>
                  </div>
                  <span class="nav-link-text">Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="md:ml-auto md:mb-6">
          <p className="text-4xl">
            <strong>Newsletter Signup</strong>
          </p>
        </div>
        <div>
          <div className="gap-8 flex justify-center items-center">
            <div className="md:mb-9">
              <input
                type="text"
                className="
          form-control
          block
          w-[200px]
          text-5xl
          px-8
          py-3
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
                id="exampleFormControlInput1"
                placeholder="Email address"
              />
            </div>
            <div className="mb-9">
              <button
                type="submit"
                className="inline-block px-6 py-2 border-2 border-white text-white font-medium text-2xl leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              >
                Subscribe
              </button>
            </div>
          </div>
          <form action></form>
        </div>
        <a href={pdf} target="_blank" className="main-footer-navbar__nav__link">
          <button
            style={{
              padding: 10,
              height: "auto",
              width: 200,
              fontSize: "unset",
            }}
          >
            Download Whitepaper <i class="fa fa-download"></i>
          </button>
        </a>
        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          ©2022 Valuty. All rights reserved
        </div>
      </footer>
    </div>
  );
}
