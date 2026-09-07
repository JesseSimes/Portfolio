import React from "react";

// Fixed, full-viewport film-grain texture. Sits above everything,
// but is fully click/scroll-through thanks to pointer-events-none.
// The noise is a tiny inline SVG (feTurbulence), tiled as a background-image,
// so there's zero extra asset to load and it's essentially free at runtime.
const noiseSvg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' />
      <feColorMatrix type='saturate' values='0' />
      <feComponentTransfer>
        <feFuncA type='linear' slope='1.6' intercept='0' />
      </feComponentTransfer>
    </filter>
    <rect width='100%' height='100%' filter='url(%23n)' />
  </svg>
`;

const encodedSvg = encodeURIComponent(noiseSvg.trim());

const GrainOverlay = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "120px 120px",
        opacity: 0.16,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export default GrainOverlay;