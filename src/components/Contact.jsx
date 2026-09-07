import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const headingWords = "Let's Talk".split(" ");

const links = [
  { id: "01", label: "GitHub", href: "https://github.com/JesseSimes" },
  { id: "02", label: "LinkedIn", href: "https://linkedin.com/in/jesse-simes" },
  { id: "03", label: "WhatsApp", href: "https://wa.me/+919508294189" },
];

const MagneticEmail = ({ email }) => {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const quickX = useRef(null);
  const quickY = useRef(null);

  useLayoutEffect(() => {
    quickX.current = gsap.quickTo(textRef.current, "x", {
      duration: 0.4,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(textRef.current, "y", {
      duration: 0.4,
      ease: "power3",
    });
  }, []);

  const handleMouseMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    quickX.current(relX * 0.25);
    quickY.current(relY * 0.4);
  };

  const handleMouseLeave = () => {
    quickX.current(0);
    quickY.current(0);
  };

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (older browser / permissions) — fail silently
    }
  };

  return (
    <button
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-cursor-hover
      className="group relative inline-block text-left"
    >
      <span
        ref={textRef}
        className="inline-block text-[9vw] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-white/70 sm:text-[6vw]"
      >
        {email}
      </span>
      <span
        className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-medium text-black transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
        }`}
      >
        Copied to clipboard
      </span>
    </button>
  );
};

const LinkRow = ({ item, rowRef }) => {
  const arrowRef = useRef(null);
  const textRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(textRef.current, { x: 16, duration: 0.4, ease: "power3.out" });
    gsap.to(arrowRef.current, {
      x: 8,
      rotate: 45,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(textRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
    gsap.to(arrowRef.current, {
      x: 0,
      rotate: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={rowRef}
      data-cursor-hover
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-between border-b border-white/15 py-6 text-white"
    >
      <div className="flex items-baseline gap-6">
        <span className="text-sm text-white/40">{item.id}</span>
        <span
          ref={textRef}
          className="text-2xl font-bold uppercase tracking-tight md:text-3xl"
        >
          {item.label}
        </span>
      </div>
      <span
        ref={arrowRef}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-base"
      >
        →
      </span>
    </a>
  );
};

const Contact = () => {
  const sectionRef = useRef(null);
  const wordRefs = useRef([]);
  const paraRef = useRef(null);
  const rowRefs = useRef([]);
  const [time, setTime] = useState("");

  useLayoutEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date());
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordRefs.current,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        paraRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { clipPath: "inset(0 0 100% 0)", y: 24 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.1 + i * 0.08,
            scrollTrigger: {
              trigger: row,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0B0B0C] px-6 py-28 md:px-12 lg:px-20"
    >
      <div className="mb-4 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-white/40">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        Available for work
      </div>

      <h2 className="mb-8 overflow-hidden font-serif text-4xl leading-[0.95] text-white md:text-6xl lg:text-7xl">
        {headingWords.map((word, i) => (
          <span key={i} className="mr-4 inline-block overflow-hidden align-bottom">
            <span
              ref={(el) => (wordRefs.current[i] = el)}
              className="inline-block"
            >
              {word}
            </span>
          </span>
        ))}
      </h2>

      <p
        ref={paraRef}
        className="mb-16 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
      >
        Got a project in mind, or just want to say hi? My inbox is always
        open — click below to copy my email.
      </p>

      <div className="mb-20">
        <MagneticEmail email="jessesimes18@gmail.com" />
      </div>

      <div className="border-t border-white/15">
        {links.map((item, i) => (
          <LinkRow
            key={item.id}
            item={item}
            rowRef={(el) => (rowRefs.current[i] = el)}
          />
        ))}
      </div>

      <div className="mt-20 flex flex-col gap-2 border-t border-white/15 pt-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
        <span>Based in India — {time || "--:--"} local time</span>
        <span>© {new Date().getFullYear()} Jesse Simes. Built with React, GSAP & Three.js.</span>
      </div>
    </section>
  );
};

export default Contact;