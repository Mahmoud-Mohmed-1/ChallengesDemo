import {Typography} from "antd";
import Header from "./components/Header";
import React from "react";
import Footer from "./components/Footer";
import Features from "./components/Features";
import ChallengeList from "./container/ChallengeList";
function App() {

  return (
      <>
          <Header/>
        <ChallengeList/>
          <Features/>
          <Footer/>
      </>
  );
}

export default App;
