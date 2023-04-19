import React from "react";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";

//INTERNAL IMPORT
import style from "../styles/contactus.module.scss";
import formstyle from "../styles/Form.module.scss";
import { Button, WebsiteHead } from "../components/componentIndex";

const ContactUs = () => {
  return (
    <div className={style.contactus}>
      <WebsiteHead title="Contact us" />

      <h1>Contact Us</h1>
      <div className={style.contactus_box}>
        <div className={style.contactus_box_left}>
          <div className={style.contactus_box_left_item}>
            <h3>🗺 ADDRESS</h3>
            <p>
              Photo booth tattooed prism, portland taiyaki hoodie neutra
              typewriter
            </p>
          </div>
          <div className={style.contactus_box_left_item}>
            <h3>💌 EMAIL</h3>
            <p>nc.example@example.com</p>
          </div>
          <div className={style.contactus_box_left_item}>
            <h3>☎ PHONE</h3>
            <p>000-123-456-7890</p>
          </div>
          <div className={style.contactus_box_left_item}>
            <h3>🌏 SOCIALS</h3>
            <a href="#">
              <TiSocialFacebook />
            </a>
            <a href="#">
              <TiSocialLinkedin />
            </a>
            <a href="#">
              <TiSocialInstagram />
            </a>
            <a href="#">
              <TiSocialYoutube />
            </a>
            <a href="#">
              <TiSocialTwitter />
            </a>
          </div>
        </div>

        <div className={style.contactus_box_right}>
          <form className={formstyle.Form}>
            <div className={formstyle.Form_box_input}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                placeholder="john wick"
                className={formstyle.Form_box_input_input}
              />
            </div>
            <div className={formstyle.Form_box_input}>
              <label htmlFor="email">Email</label>
              <div className={formstyle.Form_box_input_box}>
                <div className={formstyle.Form_box_input_box_icon}>
                  <HiOutlineMail />
                </div>
                <input type="text" placeholder="Email*" />
              </div>
            </div>
            <div className={formstyle.Form_box_input}>
              <label htmlFor="description">Message</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="6"
                placeholder="your message"
              ></textarea>
            </div>
            <Button btnName="Send Message" handleClick={() => {}} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
