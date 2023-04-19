import React from "react";
import Image from "next/image";

//INTERNAL IMPORT
import style from "../styles/aboutus.module.scss";
import images from "../img";
import WebsiteHead from "../components/WebsiteHead";

const AboutUs = () => {
  const factsArray = [
    {
      title: "10 million",
      info: "Articles have been public around the world (as of Sept. 30, 2021)",
    },
    {
      title: "100,000",
      info: "Registered users account (as of Sept. 30, 2021)",
    },
    {
      title: "220+",
      info: "Countries and regions have our presence (as of Sept. 30, 2021",
    },
  ];
  return (
    <div className={style.aboutus}>
      <WebsiteHead title="about us" />

      <div className={style.aboutus_box}>
        <div className={style.aboutus_box_hero}>
          <div className={style.aboutus_box_hero_left}>
            <h1>👋 About Us</h1>
            <p>
              We’re impartial and independent, and every day we create
              distinctive, world-class programmes and content which inform,
              educate and entertain millions of people in the around the world.
            </p>
          </div>
          <div className={style.aboutus_box_hero_right}>
            <Image src={images.hero4} alt="hero" />
          </div>
        </div>

        <div className={style.aboutus_box_title}>
          <h2>⛱ Founder</h2>
          <p>
            We’re impartial and independent, and every day we create
            distinctive, world-class programmes and content
          </p>
        </div>

        <div className={style.aboutus_box_founder}>
          <div className={style.aboutus_box_founder_box}>
            <Image src={images.mhyr} alt="owner" width={300} height={300} />
            <div className={style.aboutus_box_founder_box_info}>
              <h3>Mahyar Hosaini</h3>
              <p>Web3 developer</p>
            </div>
          </div>
        </div>

        <div className={style.aboutus_box_title}>
          <h2>🚀 Fast Facts</h2>
          <p>
            We're impartial and independent, and every day we create
            distinctive, world-class programmes and content
          </p>
        </div>

        <div className={style.aboutus_box_facts}>
          {factsArray.map((el, i) => (
            <div className={style.aboutus_box_facts_box} key={i + 1}>
              <h3>{el.title}</h3>
              <p>{el.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
