import HeroSection from "./HeroSection";
import About from "./About";
import Footer from './Footer';
import React from "react";

const Hero = () => {
  return (
    <div className="homepage">
     
      <HeroSection />
      <About />
      <Footer/>
    </div>
  );
};

export default Hero;
