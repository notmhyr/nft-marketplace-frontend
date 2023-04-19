import React, { useState } from "react";
import style from "./Button.module.scss";
import { ColorRing } from "react-loader-spinner";
const Button = ({
  btnName,
  handleClick,
  reverse,
  icon,
  type = "button",
  loading,
  disabled,
}) => {
  const [color, setColor] = useState(
    reverse
      ? ["#272727ff", "#272727ff", "#272727ff", "#272727ff", "#272727ff"]
      : ["#fff", "#fff", "#fff", "#fff", "#fff"]
  );

  return (
    <div>
      {/* if reverse true then reverse the button's color and disable hover if loading true */}
      <button
        className={`${
          reverse
            ? loading
              ? style.button_reverse_hover_disabled
              : style.button_reverse
            : loading
            ? style.button_hover_disabled
            : style.button
        }`}
        type={type}
        disabled={disabled}
        onClick={handleClick ? handleClick : () => {}}
      >
        {btnName} {icon}{" "}
        {loading ? (
          <ColorRing
            visible={true}
            height="25"
            width="25"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass={`${
              reverse ? style.button_reverse_loading : style.button_loading
            }`}
            colors={
              reverse
                ? [
                    "#272727ff",
                    "#272727ff",
                    "#272727ff",
                    "#272727ff",
                    "#272727ff",
                  ]
                : ["#fff", "#fff", "#fff", "#fff", "#fff"]
            }
          />
        ) : (
          ""
        )}
      </button>
    </div>
  );
};

export default Button;
