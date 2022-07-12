import React from "react";
import "./footer.css";
import logo from "../assets/logo.svg";
import appstore from "../assets/Conditions documents/appstore.svg";
import playstore from "../assets/Conditions documents/playstore.svg";
import pdf from "../assets/VaultyWp.pdf";
import antifraud from "../assets/Conditions documents/anti-fraud_policy.pdf";
import termsofexchange from "../assets/Conditions documents/Coinovy_terms_of_exchange_operations.pdf";
import termsofuse from "../assets/Conditions documents/Coinovy_terms_of_use.pdf";
import privacypolicy from "../assets/Conditions documents/coinovy-Privacy-Policy.pdf";
import cookiepolicy from "../assets/Conditions documents/cookie_policy.pdf";
import tos from "../assets/Conditions documents/tos.pdf";
import toc from "../assets/Conditions documents/terms_of_credits.pdf";

export default function Footer() {
  return (
    <div>
      {" "}
      <footer className="text-center bg-[#0d0d2b] text-white">
        <div className="flex flex-wrap justify-evenly p-20 items-start">
          <div className="flex flex-col">
            <img src={logo} alt="Vaulty Logo" className="main-footer__logo" />
            <p>©2022 Vaulty. All rights reserved</p>
          </div>

          <div>
            <ul style={{ textAlign: "justify" }}>
              <li className="text-2xl p-2 font-bold text-white">Application</li>
              <li className="p-2 text-xl flex">
                <div className="flex items-center">
                  <img src={appstore} width="30" />
                  <p className="mx-2">App Store</p>
                </div>
              </li>
              <li className="p-2 text-xl">
                <div className="flex items-center">
                  <img src={playstore} width="30" />
                  <p className="mx-2">Play store</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            {" "}
            <ul style={{ textAlign: "justify" }}>
              <li className="text-2xl py-2 font-bold text-white">Conditions</li>

              <li className="text-xl">
                <a href={tos} target="_blank">
                  Terms of Service
                </a>
              </li>
              <li className="text-xl">
                {" "}
                <a href={antifraud} target="_blank">
                  Anti Fraud Policy
                </a>
              </li>
              <li className="text-xl">
                {" "}
                <a href={cookiepolicy} target="_blank">
                  Cookie Policy
                </a>{" "}
              </li>
              <li className="text-xl">
                <li className="text-xl">
                  {" "}
                  <a href={toc} target="_blank">
                    Terms of Credits
                  </a>{" "}
                </li>
              </li>
              <li className="text-xl">
                <a href={privacypolicy} target="_blank">
                  Privacy Policy
                </a>{" "}
              </li>
              <li className="text-xl">
                <a href={termsofuse} target="_blank">
                  Terms of Use
                </a>{" "}
              </li>
              <li className="text-xl">
                {" "}
                <a href={termsofexchange} target="_blank">
                  {" "}
                  Terms of Exchange
                </a>
              </li>
            </ul>
          </div>
          <div>
            {" "}
            <ul style={{ textAlign: "justify" }}>
              <li className="text-2xl p-2 font-bold text-white">Follow Us</li>
              <li className="p-2">
                <div className="flex">
                  {" "}
                  <a
                    href="https://www.instagram.com/vaultypro/"
                    target="_blank"
                    class="nav-item"
                  >
                    <div class="nav-links">
                      <i class="fab fa-instagram"></i>
                    </div>
                  </a>
                  <a
                    href="https://twitter.com/VaultyPRO"
                    target="_blank"
                    class="nav-item mx-2"
                  >
                    <div class="nav-links transition-all">
                      <i class="fab fa-twitter"></i>
                    </div>
                  </a>
                  <a
                    href="https://www.facebook.com/VaultyPRO"
                    target="_blank"
                    class="nav-item mx-2"
                  >
                    <div class="nav-links transition-all">
                      <i class="fab fa-facebook"></i>
                    </div>
                  </a>
                  <a
                    href="https://discord.com/invite/pUcjq95w"
                    target="_blank"
                    class="nav-item mx-2"
                  >
                    <div class="nav-links transition-all">
                      <i class="fab fa-discord"></i>
                    </div>
                  </a>
                  <a
                    href="https://t.me/vaultypro"
                    target="_blank"
                    class="nav-item"
                  >
                    <div class="nav-links transition-all">
                      <i class="fab fa-telegram"></i>
                    </div>
                  </a>
                </div>
              </li>
              <li className="p-2">
                <a
                  href={pdf}
                  target="_blank"
                  className="main-footer-navbar__nav__link"
                >
                  {" "}
                  <button class="px-4 py-2 mx-2 border border-sky-500 bg-transparent hover:bg-gradient-to-r from-[#a42e9a] to-[#5951f6] text-white text-2xl font-medium rounded-full">
                    Download Whitepaper
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
