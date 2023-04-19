import Head from "next/head";
import React from "react";

const WebsiteHead = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | galaxy` : "galaxy"}</title>
        <meta name="description" content="nft marketplace on sepolia network" />
        <link rel="icon" href="/website-icon.png" />
      </Head>
    </>
  );
};

export default WebsiteHead;
