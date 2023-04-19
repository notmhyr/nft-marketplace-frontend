import React from "react";
import Image from "next/image";

// internal imports
import style from "../styles/auth.module.scss";
import formstyle from "../styles/Form.module.scss";
import images from "../img";
import { Button, WebsiteHead } from "../components/componentIndex";
import Link from "next/link";
const signUp = () => {
  return (
    <div className={style.auth}>
      <WebsiteHead title="Sign up" />

      <h1>Sign Up</h1>

      <div className={style.auth_options}>
        <div className={style.auth_options_item}>
          <Image src={images.google} alt="google icon" width={35} height={35} />
          <span>Continue with Google</span>
        </div>
      </div>

      <p className={style.auth_or}>OR</p>

      <form className={style.auth_form}>
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
          <input
            type="email"
            placeholder="example@example.com"
            className={formstyle.Form_box_input_input}
          />
        </div>

        <div className={formstyle.Form_box_input}>
          <label htmlFor="password">Password</label>
          <input type="password" className={formstyle.Form_box_input_input} />
        </div>
        <div className={formstyle.Form_box_button}>
          <Button btnName="Continue" />
        </div>
      </form>
      <div className={style.auth_newUser}>
        <strong>Already have account?</strong>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
};

export default signUp;
