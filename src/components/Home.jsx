import React from "react";
import Slider from "./Slider/Slider";

const Home = ( {appRefresher, setAppRefresher}) => {
  return (
    <div>
      <Slider  appRefresher={appRefresher} setAppRefresher={setAppRefresher}/>
    </div>
  );
};

export default Home;
