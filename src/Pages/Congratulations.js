import React from "react";
import "./congratulations.css";
import { useNavigate } from "react-router-dom";
function Congratulations() {
  const navigate = useNavigate();
  return (
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mx-auto mt-5">
          <div class="payment">
            <div class="payment_header">
              <div class="check">
                <i class="fa fa-check" aria-hidden="true"></i>
              </div>
            </div>
            <div class="content">
              <h1>Payment Success !</h1>
              <p style={{ fontSize: "14px   " }}>
                {" "}
                Thankyou for being a part of vaulty.
              </p>
              <a
                onClick={() => {
                  navigate("/");
                }}
                style={{ marginTop: 80, cursor: "pointer" }}
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Congratulations;
