import React from "react";
import pdf from "../assets/VaultyWp.pdf";
export default function Footer2() {
  return (
    <div className="flex">
      <div>
        <img />
      </div>
      <div>
        <ul>
          <li className="text-2xl">Applications</li>
          <li>Apple Store Logo</li>
          <li>Android Store Logo</li>
        </ul>
      </div>
      <div>
        <ul>
          <li className="text-2xl">Conditions</li>
          <li>MasterCard </li>
          <li>Terms of Service</li>
          <li> Anti Fraud Policy</li>
          <li> Cookie Policy</li>
          <li>Terms of Credits</li>
          <li>Privacy Policy</li>
          <li>Terms of Use</li>
          <li>Terms of Exchange</li>
        </ul>
      </div>

      <div className="flex ">
       
        <div className="flex flex-col">
          <a
            href={pdf}
            target="_blank"
            className="main-footer-navbar__nav__link"
          >
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
          <a
            href={pdf}
            target="_blank"
            className="main-footer-navbar__nav__link"
          >
            <button
              style={{
                padding: 10,
                height: "auto",
                width: 200,
                fontSize: "unset",
              }}
            >
              Subscribe for newsletter <i class="fa fa-download"></i>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
