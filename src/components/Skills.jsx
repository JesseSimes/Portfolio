import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillsData = [
  {
    id: "01",
    title: "Design",
    summary: "Interfaces that feel intentional.",
    details: [
      "UI / UX Design",
      "Design Systems",
      "Motion & Micro-interactions",
      "Figma / Prototyping",
    ],
  },
  {
    id: "02",
    title: "Development",
    summary: "Full-stack builds, front to back.",
    details: [
      "React / Next.js",
      "Node.js / Express",
      "Three.js / WebGL",
      "GSAP Animation",
    ],
  },
  {
    id: "03",
    title: "SEO",
    summary: "Built to be found, not just seen.",
    details: [
      "Technical SEO Audits",
      "Performance Optimization",
      "Semantic Markup",
      "Analytics & Search Console",
    ],
  },
];

const SkillRow = ({ skill, isOpen, onToggle, rowRef }) => {
  const arrowRef = useRef(null);
  const paddingRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(arrowRef.current, {
      rotate: isOpen ? -45 : 45,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(paddingRef.current, {
      paddingLeft: 24,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(arrowRef.current, {
      rotate: isOpen ? 45 : 0,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(paddingRef.current, {
      paddingLeft: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <div ref={rowRef} className="border-b border-black/15">
      <button
        ref={paddingRef}
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex w-full items-center justify-between py-8 text-left md:py-10"
      >
        <div className="flex items-baseline gap-4 md:gap-10">
          <span className="text-sm text-black/40 md:text-base">
            {skill.id}
          </span>
          <h3 className="text-[9vw] font-black uppercase leading-none tracking- [-0.05em] md:text-[5vw]">
            {skill.title}
          </h3>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden text-base text-black/50 md:block">
            {skill.summary}
          </span>
          <span
            ref={arrowRef}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 text-xl md:h-12 md:w-12"
          >
            +
          </span>
        </div>
      </button>

      <div
        className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-wrap gap-x-10 gap-y-3 pb-10 pl-0 md:pl-24">
            {skill.details.map((item) => (
              <span key={item} className="text-base text-black/70 md:text-lg">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const progressRef = useRef(null);
  const rowRefs = useRef([]);

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // heading slides + fades in as the section enters view
      gsap.from(headingRef.current, {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // each row reveals with a clip-path wipe + slight rise, staggered
      rowRefs.current.forEach((row, i) => {
        if (!row) return;

        gsap.fromTo(
          row,
          {
            clipPath: "inset(0 0 100% 0)",
            y: 40,
          },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // thin progress line that fills as you scroll through the whole section
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full px-6 py-20 md:px-12 lg:px-20"
    >

      <div className="mb-12 flex w-full justify-end">
        <h1
            ref={headingRef}
            className="
            text-[8vw]
            font-black
            uppercase
            leading-[0.85]
            tracking-[-0.08em]
            text-black"
        >
            Skills</h1>
      </div>

      <div className="w-full border-t border-black/15">
        {skillsData.map((skill, i) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            isOpen={openId === skill.id}
            onToggle={() => handleToggle(skill.id)}
            rowRef={(el) => (rowRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
};

export default Skills;