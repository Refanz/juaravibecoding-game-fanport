import React from "react";

interface Props {
  nearObject: number | null;
  activeQuiz: boolean;
  nearElevator: boolean;
  nearCCTV: boolean;
}

export default function InteractionHints({
  nearObject,
  activeQuiz,
  nearElevator,
  nearCCTV,
}: Props) {
  return (
    <>
      {nearObject !== null && !activeQuiz && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap z-40">
          ⌨️ Tekan{" "}
          <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">
            [SPASI]
          </span>{" "}
          untuk interaksi
        </div>
      )}
      {nearElevator && nearObject === null && !activeQuiz && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap z-40">
          🛗 Tekan{" "}
          <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">
            [SPASI]
          </span>{" "}
          naik/turun lantai
        </div>
      )}
      {nearCCTV && nearObject === null && !activeQuiz && !nearElevator && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-dark/90 border border-[#4fc3f7] py-1.5 px-4 text-[0.5rem] text-[#4fc3f7] rounded pointer-events-none whitespace-nowrap z-40">
          📹 Tekan{" "}
          <span className="bg-[#1b4f72] py-0.5 px-1.5 rounded-sm mx-0.5">
            [SPASI]
          </span>{" "}
          Monitor CCTV
        </div>
      )}
    </>
  );
}
