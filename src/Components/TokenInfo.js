import React from "react";
import "./tokenInfo.css";
export default function TokenInfo() {
  return (
    <div className="max-w-[900px] mx-auto mt-4 bg-white rounded-2xl">
      <div _ngcontent-ila-c44 className="token-info-section">
        <h1 _ngcontent-ila-c44 className="token-info-title text-black">
          Vaulty
        </h1>
        <div _ngcontent-ila-c44 className="row">
          <div _ngcontent-ila-c44 className="col p-0">
            <div _ngcontent-ila-c44 className="token-details-box">
              <h6 _ngcontent-ila-c44 className="token-type text-black text-2xl">
                Token Type
              </h6>
              <p _ngcontent-ila-c44 className="token-name text-black text-2xl">
                BEP-20
              </p>
            </div>
          </div>
          <div _ngcontent-ila-c44 className="col p-0">
            <div
              _ngcontent-ila-c44
              className="token-details-box token-details-box2 "
            >
              <h6
                _ngcontent-ila-c44
                className="token-type text-black mx-2 text-2xl"
              >
                Symbol
              </h6>
              <p
                _ngcontent-ila-c44
                className="token-name text-black mx-2 text-2xl"
              >
                $VLT
              </p>
            </div>
          </div>
          <div _ngcontent-ila-c44 className="col p-0">
            <div _ngcontent-ila-c44 className="token-details-box">
              <h6
                _ngcontent-ila-c44
                className="token-type text-black mx-2 text-2xl"
              >
                Decimals
              </h6>
              <p
                _ngcontent-ila-c44
                className="token-name text-black mx-2 text-2xl"
              >
                9
              </p>
            </div>
          </div>
          <div _ngcontent-ila-c44 className="col p-0">
            <div
              _ngcontent-ila-c44
              className="token-details-box token-details-box2"
            >
              <h6
                _ngcontent-ila-c44
                className="token-type text-black mx-2 text-2xl"
              >
                Current Price
              </h6>
              <p
                _ngcontent-ila-c44
                className="token-name token-name2 text-black mx-2 text-2xl"
              >
                0.05 USDT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
