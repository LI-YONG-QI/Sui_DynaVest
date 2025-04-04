import Image from "next/image";
import Link from "next/link";

interface StrategyCardProps {
  title: string;
  apy: string;
  risk: {
    level: "Low" | "Medium" | "High";
    color: string;
    bgColor: string;
  };
  protocol: string;
  description: string;
  image: string;
  externalLink?: string;
  learnMoreLink?: string;
}

const getRiskColor = (risk: StrategyCardProps["risk"]) => {
  switch (risk.level) {
    case "Low":
      return { text: "#10B981", bg: "rgba(16, 185, 129, 0.3)" };
    case "Medium":
      return { text: "#B9AB15", bg: "rgba(230, 212, 9, 0.3)" };
    case "High":
      return { text: "#E83033", bg: "rgba(232, 48, 51, 0.3)" };
  }
};

export default function StrategyCard({
  title,
  apy,
  risk,
  protocol,
  description,
  image,
  externalLink,
  learnMoreLink,
}: StrategyCardProps) {
  // Extract the base description without "Learn More" text
  const baseDescription = description.replace(/\s*Learn More\s*$/, "");

  return (
    <div className="flex flex-col items-center gap-[18px] p-5 bg-white rounded-2xl shadow-[0px_21px_27px_-10px_rgba(71,114,234,0.65)]">
      <div className="flex justify-around items-center w-full">
        <Image
          src={image}
          alt={title}
          width={60}
          height={60}
          className="rounded-lg object-cover"
        />
        <div className="flex flex-col justify-center gap-2.5 w-[224px]">
          <div className="flex gap-[3px] self-stretch">
            <h3 className="font-[family-name:var(--font-manrope)] text-[18px] font-bold text-lg text-[#17181C]">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-inter)] font-medium text-base text-[#17181C]">
              {apy}
            </span>
            <div
              className="flex justify-center items-center gap-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: getRiskColor(risk).bg }}
            >
              <span
                className="font-[family-name:var(--font-inter)] font-medium text-sm"
                style={{ color: getRiskColor(risk).text }}
              >
                {risk.level} Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center gap-[5px]">
          {externalLink ? (
            <Link
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[5px] hover:underline"
            >
              <span className="font-[family-name:var(--font-plus-jakarta)] font-medium text-sm text-black">
                {protocol}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </Link>
          ) : (
            <span className="font-[family-name:var(--font-plus-jakarta)] font-medium text-sm text-black">
              {protocol}
            </span>
          )}
        </div>
        <div className="flex items-start">
          <p className="font-[family-name:var(--font-plus-jakarta)] font-medium text-sm text-[#17181C] text-left">
            {baseDescription}
            {learnMoreLink && (
              <Link
                href={learnMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-[#5F79F1] hover:underline"
              >
                Learn More
              </Link>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center self-stretch gap-[13px]">
        <button className="flex-1 h-[37px] flex justify-center items-center bg-[#5F79F1] text-white rounded-[11px] font-[family-name:var(--font-plus-jakarta)] font-semibold text-sm">
          Invest
        </button>
        <Image
          src="/bot-icon.svg"
          alt="Bot"
          width={24}
          height={24}
          className="text-[#1E3498]"
        />
      </div>
    </div>
  );
}
