import React from "react";
import { TiTick } from "react-icons/ti";
import { Button, WebsiteHead } from "../components/componentIndex";

//INTERNAL IMPORT
import style from "../styles/subscription.module.scss";
const subscription = () => {
  const subscriptionArray = [
    {
      plan: "STARTER",
      price: "$5/mo",
      service: ["Automated Reporting", "Faster Processing", "Customizations"],
      info: "Literally you probably haven't heard of them jean shorts.",
    },
    {
      plan: "BASIC",
      price: "$15/mo",
      service: [
        "Everything in Starter",
        "100 Builds",
        "Progress Reports",
        "Premium Support",
      ],

      info: "Literally you probably haven't heard of them jean shorts.",
    },
    {
      plan: "PLUS",
      price: "$25/mo",
      service: [
        "Everything in Basic",
        "Unlimited Builds",
        "Advanced Analytics",
        "Company Evaluations",
      ],

      info: "Literally you probably haven't heard of them jean shorts.",
    },
  ];
  return (
    <div className={style.subscription}>
      <WebsiteHead title="Subscription" />

      <div className={style.subscription_info}>
        <h1>💎 Subscription</h1>
        <p>Pricing to fit the needs of any company size</p>
      </div>

      <div className={style.subscription_options}>
        {subscriptionArray.map((el, i) => (
          <div className={style.subscription_item} key={i + 1}>
            <strong>{el.plan}</strong>
            <h3>{el.price}</h3>
            {el.service.map((service, i) => (
              <div className={style.subscription_item_service} key={i}>
                <TiTick />
                <span>{service}</span>
              </div>
            ))}
            <div className={style.subscription_item_btn}>
              <Button btnName="Submit" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default subscription;
