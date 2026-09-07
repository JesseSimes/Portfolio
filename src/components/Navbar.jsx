import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";

const navItems = [
  { label: "Skills", id: "services" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const MagneticLink = ({ label, onClick }) => {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const underlineRef = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  useLayoutEffect(() => {
    quickX.current = gsap.quickTo(textRef.current, "x", {
      duration: 0.3,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(textRef.current, "y", {
      duration: 0.3,
      ease: "power3",
    });
  }, []);

  const handleMouseMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    quickX.current(relX * 0.35);
    quickY.current(relY * 0.5);

    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    quickX.current(0);
    quickY.current(0);
    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  return (
    <button
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor-hover
      className="relative px-1 py-2 text-sm tracking-wide"
    >
      <span ref={textRef} className="inline-block">
        {label}
      </span>
      <span
        ref={underlineRef}
        className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-current"
      />
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? "rgba(11,11,12,0.75)" : "rgba(11,11,12,0)",
      backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
      color: scrolled ? "#ffffff" : "#ffffff",
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(navRef.current, {
      paddingTop: scrolled ? "0.75rem" : "1.25rem",
      paddingBottom: scrolled ? "0.75rem" : "1.25rem",
      duration: 0.5,
      ease: "power2.out",
    });
  }, [scrolled]);

  const handleNavClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={navRef}
      className="fixed top-0 z-[900] flex w-full items-center justify-between px-6 py-5 text-white md:px-12 lg:px-20"
    >
      <button
        data-cursor-hover
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="text-sm font-black uppercase tracking-[0.15em]"
      >
        Jesse
      </button>
      <div className="flex items-center gap-2 md:gap-6">
        {navItems.map((item) => (
          <MagneticLink
            key={item.id}
            label={item.label}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;