import React from "react";
import { Route, Routes } from "react-router-dom";
import TokenInfo from "./Components/TokenInfo";
import Homepage from "./Homepage";
import Airdrop from "./Pages/Airdrop";
import CoinInformation from "./Pages/CoinInformation";
import Congratulations from "./Pages/Congratulations";
import Staking from "./Pages/Staking";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />}></Route>
      <Route path="/staking" element={<Staking />} />
      <Route path="/airdrop" element={<Airdrop />} />
      <Route path="/success" element={<Congratulations />} />
      <Route path="/coininfo" element={<CoinInformation />} />
    </Routes>
  );
}
