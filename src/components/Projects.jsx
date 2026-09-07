import React, { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import placeholderImage from "../assets/placeHolder.png";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: "01",
    title: "Deepfake Detection",
    category: "AI / ML",
    year: "2025",
    tags: ["Python", "TensorFlow", "OpenCV"],
    image: placeholderImage,
    link: "#",
  },
  {
    id: "02",
    title: "Student Analytics",
    category: "Full Stack / AI",
    year: "2025",
    tags: ["React", "Node.js", "MongoDB"],
    image: placeholderImage,
    link: "#",
  },
  {
    id: "03",
    title: "NFT Marketplace",
    category: "Web3 / Frontend",
    year: "2024",
    tags: ["React", "Solidity", "Ethers.js"],
    image: placeholderImage,
    link: "#",
  },
  {
    id: "04",
    title: "Liquid Portfolio",
    category: "Creative Dev",
    year: "2026",
    tags: ["Three.js", "GSAP", "WebGL"],
    image: placeholderImage,
    link: "#",
  },
];

const ProjectRow = ({ project, index, onHover, onLeave, rowRef }) => {
  const arrowRef = useRef(null);
  const titleRef = useRef(null);

  const handleMouseEnter = () => {
    onHover(project, index);
    gsap.to(titleRef.current, {
      x: 16,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.to(arrowRef.current, {
      x: 8,
      rotate: 45,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    onLeave();
    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.to(arrowRef.current, {
      x: 0,
      rotate: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <a
      href={project.link}
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col gap-2 border-b border-black/15 py-8 md:flex-row md:items-center md:justify-between md:py-10"
    >
      <div className="flex items-baseline gap-4 md:gap-10">
        <span className="text-sm text-black/40 md:text-base">
          {project.id}
        </span>
        <h3
          ref={titleRef}
          className="text-[9vw] font-black uppercase leading-none tracking--0.05em md:text-[4.5vw]"
        >
          {project.title}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-6 pl-14 md:pl-0">
        <div className="flex flex-col text-sm text-black/50 md:items-end md:text-base">
          <span>{project.category}</span>
          <span className="flex flex-wrap gap-x-2 md:justify-end">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
        </div>
        <span className="text-sm text-black/40 md:text-base">
          {project.year}
        </span>
        <span
          ref={arrowRef}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 text-lg md:h-12 md:w-12"
        >
          →
        </span>
      </div>
    </a>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const previewRef = useRef(null);
  const previewImgWrapRef = useRef(null);
  const rowRefs = useRef([]);
  const activeImageRef = useRef(null);

  const quickX = useRef(null);
  const quickY = useRef(null);

  const [activeProject, setActiveProject] = useState(null);

  useLayoutEffect(() => {
    quickX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.6,
      ease: "power3",
    });
    quickY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.6,
      ease: "power3",
    });
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { clipPath: "inset(0 0 100% 0)", y: 30 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    quickX.current(e.clientX - rect.left);
    quickY.current(e.clientY - rect.top);
  };

  const handleHover = (project) => {
    setActiveProject(project);

    if (project.image !== activeImageRef.current) {
      activeImageRef.current = project.image;
      gsap.fromTo(
        previewImgWrapRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
    }

    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    activeImageRef.current = null;
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <section
  id="projects"
  ref={sectionRef}
  onMouseMove={handleMouseMove}
  className="relative w-full overflow-hidden px-6 py-24 md:px-12 lg:px-20"
>
  <div className="mb-12 w-full">
    <h1
      ref={headingRef}
      className="
        text-left
        text-[8vw]
        font-black
        uppercase
        leading-[0.85]
        tracking-[-0.08em]
        text-black
      "
    >
      Selected Work
    </h1>
  </div>

  <div className="w-full border-t border-black/15">
    {projectsData.map((project, i) => (
      <ProjectRow
        key={project.id}
        project={project}
        index={i}
        onHover={handleHover}
        onLeave={handleLeave}
        rowRef={(el) => (rowRefs.current[i] = el)}
      />
    ))}
  </div>

      <div
        ref={previewRef}
        className="pointer-events-none absolute left-0 top-0 z-40 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 md:block"
        style={{ transform: "scale(0.85)" }}
      >
        <div
          ref={previewImgWrapRef}
          className="h-64 w-96 overflow-hidden rounded-md shadow-2xl"
        >
          {activeProject && (
            <img
              src={activeProject.image}
              alt={activeProject.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;