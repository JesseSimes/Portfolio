import React from "react";

const Mid = () => {
  const text = " IMAGINE | PLAN | CREATE | IMAGINE | PLAN | CREATE |";

  return (
    <>
      <style>
        {`
          @keyframes infiniteMarquee {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(-50%, 0, 0);
            }
          }
        `}
      </style>

      <section className="w-full overflow-hidden py-10">
        <div
          className="
            flex
            w-max
            will-change-transform
            animate-[infiniteMarquee_15s_linear_infinite]
          "
        >

          {}
          <div className="flex shrink-0">
            <h1
              className="
                whitespace-nowrap
                pr-10
                text-[5vw]
                font-black
                uppercase
                leading-none
                tracking-[-0.06em]
              "
            >
              {text}
            </h1>
          </div>

          {}
          <div className="flex shrink-0">
            <h1
              className="
                whitespace-nowrap
                pr-10
                text-[5vw]
                font-black
                uppercase
                leading-none
                tracking-[-0.06em]
              "
            >
              {text}
            </h1>
          </div>

        </div>
      </section>
    </>
  );
};

export default Mid;