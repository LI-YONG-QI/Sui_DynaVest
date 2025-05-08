import React, { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    // 2 秒後重置狀態，讓使用者能連續複製多次
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <div className="flex flex-col items-center gap-2 cursor-pointer">
        {copied ? (
          <CopyCheck className="text-green-500" />
        ) : (
          <Copy className="text-gray-500" />
        )}
      </div>
    </CopyToClipboard>
  );
}
