"use client";

import React from "react";

import { QRCodeSVG } from "qrcode.react";

const page = () => {
  const uri = `ethereum:0x80dAdeBda19E5C010c4417985a4c05d0a8008A81`;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>掃描下方 QR Code 進行存款</h2>
      <QRCodeSVG value={uri} size={100} level="H" />
      <p style={{ marginTop: "8px", wordBreak: "break-all" }}>
        URI: <code>{uri}</code>
      </p>
    </div>
  );
};

export default page;
