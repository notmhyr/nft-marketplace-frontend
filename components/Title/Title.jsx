import React from "react";

//INTERNAL IMPORT
import style from "./Title.module.scss";

const Title = ({ heading, paragraph }) => {
  return (
    <div className={style.title}>
      <div className={style.title_box}>
        <h2>{heading}</h2>
        <p>{paragraph}</p>
      </div>
    </div>
  );
};

export default Title;
