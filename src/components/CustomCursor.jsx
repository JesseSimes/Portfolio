import React, { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";

// Custom cursor: a tight dot + a trailing ring with lag.
// The ring scales up and the dot hides when hovering anything clickable,
// giving a clear "this is interactive" signal without relying on the
// browser's default pointer.
//
// IMPORTANT: the dot/ring are always rendered (starting invisible), never
// conditionally mounted. If they were only rendered after "enabled" flips
// true, the refs would still be null the moment this effect tries to use
// them (same render pass), and GSAP would silently no-op against null —
// which is exactly what caused the cursor to get stuck at (0,0) before.
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useLayoutEffect(() => {
    // Only run on devices with a real mouse/trackpad (skip touch entirely)
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    document.documentElement.classList.add("custom-cursor-active");

    // Defensive guard: refs should always be real nodes at this point since
    // they're rendered unconditionally below, but bail cleanly instead of
    // throwing if a stale hot-reload or edge case ever leaves them null.
    if (!dotRef.current || !ringRef.current) {
      document.documentElement.classList.remove("custom-cursor-active");
      return;
    }

    // Refs are guaranteed to be real DOM nodes here, since the JSX below
    // renders them unconditionally on every render, including the first.
    gsap.set([dotRef.current, ringRef.current], {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      opacity: 1,
    });

    const quickDotX = gsap.quickTo(dotRef.current, "x", {
      duration: 0.15,
      ease: "power3",
    });
    const quickDotY = gsap.quickTo(dotRef.current, "y", {
      duration: 0.15,
      ease: "power3",
    });
    const quickRingX = gsap.quickTo(ringRef.current, "x", {
      duration: 0.45,
      ease: "power3",
    });
    const quickRingY = gsap.quickTo(ringRef.current, "y", {
      duration: 0.45,
      ease: "power3",
    });

    const handleMouseMove = (e) => {
      quickDotX(e.clientX);
      quickDotY(e.clientY);
      quickRingX(e.clientX);
      quickRingY(e.clientY);
    };

    // event delegation: any link, button, or element flagged with
    // data-cursor-hover triggers the "interactive" cursor state
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
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;
    if (!dotRef.current || !ringRef.current) return;

    gsap.to(ringRef.current, {
      scale: isHovering ? 1.8 : 1,
      backgroundColor: isHovering ? "rgba(0,0,0,0.06)" : "transparent",
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
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[1000] h-2 w-2 rounded-full bg-black opacity-0"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[1000] h-9 w-9 rounded-full border border-black/40 opacity-0"
      />
    </>
  );
};

export default CustomCursor;