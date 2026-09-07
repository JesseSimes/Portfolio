import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Wraps the light-background sections (everything between the hero and Contact)
// and subtly drifts the background color as the user scrolls through them.
// Keeps the "cream" family but nudges warmth/tone, so sections feel like they
// belong to one continuous surface instead of a flat repeated color.
const ScrollTint = ({ children }) => {
  const wrapRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      tl.to(wrapRef.current, { backgroundColor: "#FBE4C4", duration: 1 })
        .to(wrapRef.current, { backgroundColor: "#F0C9A0", duration: 1 })
        .to(wrapRef.current, { backgroundColor: "#EAD9C4", duration: 1 })
        .to(wrapRef.current, { backgroundColor: "#D8C3A5", duration: 1 });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} style={{ backgroundColor: "#FBE4C4" }}>
      {children}
    </div>
  );
};

export default ScrollTint;