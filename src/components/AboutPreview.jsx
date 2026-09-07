import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImage from "../assets/profile_1.JPG";

gsap.registerPlugin(ScrollTrigger);

const points = [
  {
    title: "Individual",
    desc: "Every design is created from scratch, tailored precisely to your brand.",
  },
  {
    title: "Details",
    desc: "Thoughtful animations, smooth transitions, precise typography.",
  },
  {
    title: "Fixed price",
    desc: "You know from the start what the project will cost.",
  },
  {
    title: "Feedback",
    desc: "Revisions are an integral part of the process. Until everything is just right.",
  },
  {
    title: "Communication",
    desc: "Simple and straightforward via Email or WhatsApp.",
  },
  {
    title: "Simple",
    desc: "You can easily update your new website yourself after launch.",
  },
  {
    title: "Support",
    desc: "Still here for you even after launch.",
  },
];

const headingWords = "Hey — I'm Jesse".split(" ");

const TrustRow = ({ point, index, rowRef, onFocus }) => {
  const cardRef = useRef(null);
  const quickRotateX = useRef(null);
  const quickRotateY = useRef(null);

  useLayoutEffect(() => {
    quickRotateX.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: 0.5,
      ease: "power3",
    });
    quickRotateY.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: 0.5,
      ease: "power3",
    });
  }, []);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quickRotateY.current(px * 10);
    quickRotateX.current(py * -10);
  };

  const handleMouseLeave = () => {
    quickRotateX.current(0);
    quickRotateY.current(0);
  };

  return (
    <div
      ref={rowRef}
      className="border-b border-black/15 py-8"
      style={{ perspective: 800 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => onFocus(index)}
        className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="text-sm text-black/40 md:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="min-w-[10rem] text-2xl font-bold uppercase tracking-tight md:text-3xl">
          {point.title}
        </h3>
        <p className="max-w-md text-black/60 leading-relaxed">
          {point.desc}
        </p>
      </div>
    </div>
  );
};

const AboutPreview = () => {
  const sectionRef = useRef(null);
  const watermarkRef = useRef(null);
  const photoWrapRef = useRef(null);
  const photoImgRef = useRef(null);
  const wordRefs = useRef([]);
  const paraRef = useRef(null);
  const rowRefs = useRef([]);
  const counterRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // giant background watermark drifts upward slower than scroll, for depth
      gsap.to(watermarkRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // photo: curtain wipe reveal, then a slow continuous parallax drift
      gsap.fromTo(
        photoWrapRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: photoWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(photoImgRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // heading words rise in one at a time
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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // paragraph rises + fades as a block, slightly delayed after heading
      gsap.fromTo(
        paraRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // trust rows wipe in with stagger
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
            delay: i * 0.06,
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // each row also updates the live counter as it crosses center screen
        ScrollTrigger.create({
          trigger: row,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActiveIndex(i);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-28 md:px-12 lg:px-20"
    >
      {/* oversized watermark, purely decorative, drifts on scroll for depth */}
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-[-0.05em] text-black/[0.04] md:text-[16vw]"
      >
        About Me
      </div>

      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <div
          ref={photoWrapRef}
          className="relative aspect-square w-full overflow-hidden"
        >
          <img
            ref={photoImgRef}
            src={profileImage}
            alt="Jesse portrait"
            className="h-[130%] w-full object-cover object-center"
            style={{ marginTop: "-15%" }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="mb-8 font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[1.05] tracking-[-0.045em]">
          {headingWords.map((word, i) => (
            <span
            key={i}
            className={`inline-block overflow-hidden align-bottom pb-2 ${
            word === "—" ? "mx-2 md:mx-3" : "mr-2 md:mr-3"}`}>
              <span
              ref={(el) => (wordRefs.current[i] = el)}
              className="inline-block">
              {word}
              </span>
            </span>))}
          </h2>

          <p
          ref={paraRef}
          className="max-w-xl text-lg leading-relaxed text-black/70 md:text-xl">
          A good website is more than a pretty appearance. It creates
          clarity, builds trust, and attracts new customers. That's
          exactly my goal in every project.</p>
        </div>
      </div>

      <div className="mt-20 flex items-start gap-6 border-t border-black/15 pt-16 md:gap-14">
        {/* live counter, ticks as rows cross the center of the viewport */}
        <div
          ref={counterRef}
          className="hidden shrink-0 flex-col items-center gap-1 pt-2 text-sm text-black/40 md:flex"
        >
          <span className="text-2xl font-black text-black">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="h-10 w-px bg-black/20" />
          <span>{String(points.length).padStart(2, "0")}</span>
        </div>

        <div className="w-full">
          {points.map((point, i) => (
            <TrustRow
              key={point.title}
              point={point}
              index={i}
              rowRef={(el) => (rowRefs.current[i] = el)}
              onFocus={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;