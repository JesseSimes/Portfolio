import React from "react";
import profileImage from "../assets/profile_1.jpg";

const About = () => {
  return (
    <section className="w-full px-6 py-20 md:px-12 lg:px-20">

      <div className="mb-16">
        <h1
          className="
            text-right
            text-[8vw]
            font-black
            uppercase
            leading-[0.5]
            tracking-[-0.08em]
          "
        >
          About Me
        </h1>
      </div>
      <div className="grid w-full grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-20">

        <div className="flex flex-col justify-center">

          <h2 className="mb-10 font-serif text-5xl md:text-6xl">
            Info
          </h2>

          <div className="max-w-xl">
            <p className="text-lg leading-relaxed md:text-xl">
              I'm a creative developer focused on building
              digital experiences that combine design,
              technology and interaction.
            </p>

            <p className="mt-8 text-lg leading-relaxed md:text-xl">
              I enjoy turning ideas into functional,
              visually interesting experiences on the web.
            </p>
          </div>

        </div>
        <div className="w-full">
          <img
            src={profileImage}
            alt="Portrait"
            className="
              h-100vh
              w-full
              object-cover
              object-center
            "
          />
        </div>

      </div>

    </section>
  );
};

export default About;