import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

import style from "./ListNFTModel.module.scss";
import formstyle from "../../styles/Form.module.scss";
import { Button } from "../componentIndex";

const ListNFTModel = ({
  handleCloseBtn,
  isOpen,
  price,
  handlePriceForm,
  handleListSubmit,
  loading,
}) => {
  return (
    <div
      className={style.listNFTModel}
      style={isOpen ? { scale: "1" } : { scale: "0" }}
    >
      <div className={style.listNFTModel_box}>
        <MdOutlineClose
          className={style.listNFTModel_box_closeBtn}
          onClick={!loading ? handleCloseBtn : () => {}}
        />
        <form
          className={style.listNFTModel_box_form}
          onSubmit={handleListSubmit}
        >
          <div className={formstyle.Form_box_input}>
            <label htmlFor="name">Price*</label>
            <input
              type="number"
              placeholder="1.4 ETH"
              required
              step=".01"
              value={price}
              onChange={handlePriceForm}
              className={formstyle.Form_box_input_input}
            />
          </div>

          <div className={formstyle.Form_box_button}>
            <Button
              btnName="List NFT"
              type="submit"
              loading={loading}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListNFTModel;
