import React from "react";
import { ColorRing } from "react-loader-spinner";

//internal imports
import style from "./LoadingComponent.module.scss";

const LoadingAccount = ({ message, wrap }) => {
  return (
    // if is warp true it fills the whole page
    <div className={wrap ? style.wrap_loading : style.loading}>
      <ColorRing
        visible={true}
        height="70"
        width="70"
        ariaLabel="blocks-loading"
        colors={[
          "#272727ff",
          "#272727ff",
          "#272727ff",
          "#272727ff",
          "#272727ff",
        ]}
      />
      {message && <span>{message}...</span>}
    </div>
  );
};

export default LoadingAccount;
