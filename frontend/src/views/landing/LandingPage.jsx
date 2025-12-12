import React from "react";
import "../../assets/scss/landing.scss";

import Hero from "./Hero";
import Features from "./Features";
import CityData from "./CityData";
import UseCases from "./UseCases";
import CTA from "./CTA";
import Footer from "./Footer";
import UsersReview from "./UserReview";
import Intro from "./Intro";
import Team from "./Team";
import Navbar from "./Navbar";

export default function LandingPage() {
  return (
    <div className="urban-landing">
      <Navbar />
      <Hero />
      <Features />
      <Intro />
      <CityData />
      <UsersReview />
      <UseCases />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
}