import React, { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useLayoutEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    document.documentElement.classList.add("custom-cursor-active");

    if (!dotRef.current || !ringRef.current) return;

    gsap.set([dotRef.current, ringRef.current], {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      opacity: 1,
    });

    const quickDotX = gsap.quickTo(dotRef.current, "x", {
      duration: 0.15,
      ease: "power3.out",
    });

    const quickDotY = gsap.quickTo(dotRef.current, "y", {
      duration: 0.15,
      ease: "power3.out",
    });

    const quickRingX = gsap.quickTo(ringRef.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });

    const quickRingY = gsap.quickTo(ringRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    const handleMouseMove = (e) => {
      quickDotX(e.clientX);
      quickDotY(e.clientY);

      quickRingX(e.clientX);
      quickRingY(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover]")) {
        setIsHovering(false);
      }
    };

    const handleMouseLeaveWindow = () => {
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 0,
        duration: 0.2,
      });
    };

    const handleMouseEnterWindow = () => {
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 1,
        duration: 0.2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeaveWindow
    );

    document.documentElement.addEventListener(
      "mouseenter",
      handleMouseEnterWindow
    );

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");

      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeaveWindow
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnterWindow
      );
    };
  }, []);

  useLayoutEffect(() => {
    if (!dotRef.current || !ringRef.current) return;

    gsap.to(ringRef.current, {
      scale: isHovering ? 1.8 : 1,
      backgroundColor: isHovering
        ? "rgba(255,255,255,0.08)"
        : "transparent",
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(dotRef.current, {
      scale: isHovering ? 0 : 1,
      duration: 0.25,
      ease: "power3.out",
    });
  }, [isHovering]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="
          pointer-events-none
          fixed left-0 top-0
          z-[1000]
          h-2 w-2
          rounded-full
          bg-white
          mix-blend-difference
          opacity-0
        "
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="
          pointer-events-none
          fixed left-0 top-0
          z-[1000]
          h-9 w-9
          rounded-full
          border border-white
          mix-blend-difference
          opacity-0
        "
      />
    </>
  );
};

export default CustomCursor;