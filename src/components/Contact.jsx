import React from "react";
import contactImage from "../assets/mountains.png";

const Contact = () => {
  return (
    <section className="flex h-30vh w-full flex-col bg-gray-800 text-white">
      <div className="flex h-30vh shrink-0 flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">
          Contact
        </h1>

        <p className="mt-2 text-lg">
          Email: example@example.com
        </p>

        <p className="mt-2 text-lg">
          Phone: (123) 456-7890
        </p>

        <p className="mt-2 text-lg">
          Address: 123 Main St, Anytown, USA
        </p>
      </div>

    </section>
  );
};

export default Contact;