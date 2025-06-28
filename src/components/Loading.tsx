import React from "react";
import "./Loading.css";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => (
  <div className="loading-container">
    <svg className="loading-svg" viewBox="0 0 120 120">
      <circle
        className="loading-globe"
        cx="60"
        cy="60"
        r="40"
        fill="none"
        stroke="#e91e63"
        strokeWidth="3"
      />
      <circle
        className="loading-prover"
        cx="60"
        cy="20"
        r="5"
        fill="#fff"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <circle
        className="loading-prover"
        cx="100"
        cy="60"
        r="5"
        fill="#fff"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <circle
        className="loading-prover"
        cx="60"
        cy="100"
        r="5"
        fill="#fff"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <circle
        className="loading-prover"
        cx="20"
        cy="60"
        r="5"
        fill="#fff"
        stroke="#e91e63"
        strokeWidth="2"
      />
      <path
        className="loading-flow"
        d="M60 20 Q80 40 100 60 Q80 80 60 100 Q40 80 20 60 Q40 40 60 20 Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeDasharray="10 10"
      />
      <circle
        className="loading-dot"
        r="3"
        fill="#e91e63"
      />
    </svg>
    <div className="loading-text">{text || "Loading..."}</div>
  </div>
);

export default Loading; 