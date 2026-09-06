import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import heroVideo from "../assets/hero.mp4";

const simulationVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const simulationFragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uPrevious;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform vec2 uResolution;

  void main() {
    vec2 texel = 1.0 / uResolution;

    vec4 state = texture2D(uPrevious, vUv);

    float height = state.r;
    float velocity = state.g;

    float left = texture2D(uPrevious, vUv + vec2(-texel.x, 0.0)).r;
    float right = texture2D(uPrevious, vUv + vec2(texel.x, 0.0)).r;
    float up = texture2D(uPrevious, vUv + vec2(0.0, texel.y)).r;
    float down = texture2D(uPrevious, vUv + vec2(0.0, -texel.y)).r;

    float laplacian =
      left +
      right +
      up +
      down -
      height * 4.0;

    velocity += laplacian * 0.28;
    velocity *= 0.985;

    height += velocity;

    float distanceToMouse = distance(vUv, uMouse);

    float brush = 1.0 - smoothstep(
      0.0,
      0.055,
      distanceToMouse
    );

    brush *= brush;

    height += brush * uMouseStrength;

    height *= 0.998;

    gl_FragColor = vec4(height, velocity, 0.0, 1.0);
  }
`;

const liquidVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const liquidFragmentShader = `
  precision highp float;

  varying vec2 vUv;

  uniform sampler2D uVideo;
  uniform sampler2D uRipple;

  uniform vec2 uVideoResolution;
  uniform vec2 uContainerResolution;

  uniform float uDistortion;
  uniform float uTime;

  vec2 coverUV(
    vec2 uv,
    vec2 textureSize,
    vec2 containerSize
  ) {
    float textureAspect = textureSize.x / textureSize.y;
    float containerAspect = containerSize.x / containerSize.y;

    vec2 newUV = uv;

    if (containerAspect > textureAspect) {
      float scale = textureAspect / containerAspect;
      newUV.y = uv.y * scale + (1.0 - scale) * 0.5;
    } else {
      float scale = containerAspect / textureAspect;
      newUV.x = uv.x * scale + (1.0 - scale) * 0.5;
    }

    return newUV;
  }

  void main() {
    vec2 uv = vUv;

    vec4 rippleData = texture2D(uRipple, uv);

    float height = rippleData.r;

    float texel = 1.0 / 512.0;

    float hLeft =
      texture2D(
        uRipple,
        uv + vec2(-texel, 0.0)
      ).r;

    float hRight =
      texture2D(
        uRipple,
        uv + vec2(texel, 0.0)
      ).r;

    float hUp =
      texture2D(
        uRipple,
        uv + vec2(0.0, texel)
      ).r;

    float hDown =
      texture2D(
        uRipple,
        uv + vec2(0.0, -texel)
      ).r;

    vec2 gradient = vec2(
      hRight - hLeft,
      hUp - hDown
    );

    vec2 distortedUV =
      uv +
      gradient * uDistortion;

    vec2 videoUV = coverUV(
      distortedUV,
      uVideoResolution,
      uContainerResolution
    );

    videoUV = clamp(videoUV, 0.001, 0.999);

    vec4 videoColor =
      texture2D(uVideo, videoUV);

    gl_FragColor = videoColor;
  }
`;

function LiquidSurface({ mouse, velocity }) {
  const materialRef = useRef();
  const simulationMaterialRef = useRef();

  const { gl, viewport, size } = useThree();

  const video = useMemo(() => {
    const element = document.createElement("video");

    element.src = heroVideo;
    element.loop = true;
    element.muted = true;
    element.playsInline = true;
    element.autoplay = true;

    element.setAttribute("playsinline", "");
    element.setAttribute("webkit-playsinline", "");

    element.play().catch(() => {});

    return element;
  }, []);

  const videoTexture = useMemo(() => {
    const texture = new THREE.VideoTexture(video);

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
  }, [video]);

  const rippleTargets = useMemo(() => {
    const settings = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    const targetA = new THREE.WebGLRenderTarget(
      512,
      512,
      settings
    );

    const targetB = new THREE.WebGLRenderTarget(
      512,
      512,
      settings
    );

    targetA.texture.wrapS = THREE.ClampToEdgeWrapping;
    targetA.texture.wrapT = THREE.ClampToEdgeWrapping;

    targetB.texture.wrapS = THREE.ClampToEdgeWrapping;
    targetB.texture.wrapT = THREE.ClampToEdgeWrapping;

    return {
      read: targetA,
      write: targetB,
    };
  }, []);

  const simulationScene = useMemo(
    () => new THREE.Scene(),
    []
  );

  const simulationCamera = useMemo(() => {
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1
    );

    camera.position.z = 1;

    return camera;
  }, []);

  const simulationMesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: {
        uPrevious: {
          value: rippleTargets.read.texture,
        },
        uMouse: {
          value: new THREE.Vector2(-10, -10),
        },
        uMouseStrength: {
          value: 0,
        },
        uResolution: {
          value: new THREE.Vector2(512, 512),
        },
      },
    });

    simulationMaterialRef.current = material;

    const mesh = new THREE.Mesh(
      geometry,
      material
    );

    simulationScene.add(mesh);

    return mesh;
  }, [
    rippleTargets,
    simulationScene,
  ]);

  const liquidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: liquidVertexShader,
      fragmentShader: liquidFragmentShader,
      uniforms: {
        uVideo: {
          value: videoTexture,
        },
        uRipple: {
          value: rippleTargets.read.texture,
        },
        uVideoResolution: {
          value: new THREE.Vector2(1920, 1080),
        },
        uContainerResolution: {
          value: new THREE.Vector2(
            size.width,
            size.height
          ),
        },
        uDistortion: {
          value: 0.14,
        },
        uTime: {
          value: 0,
        },
      },
    });
  }, [
    videoTexture,
    rippleTargets,
  ]);

  useEffect(() => {
    materialRef.current = liquidMaterial;

    return () => {
      simulationMesh.geometry.dispose();
      simulationMaterialRef.current?.dispose();
      liquidMaterial.dispose();

      rippleTargets.read.dispose();
      rippleTargets.write.dispose();

      videoTexture.dispose();

      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [
    liquidMaterial,
    simulationMesh,
    rippleTargets,
    videoTexture,
    video,
  ]);

  useFrame((state) => {
    const simulationMaterial =
      simulationMaterialRef.current;

    if (!simulationMaterial) return;

    simulationMaterial.uniforms.uMouse.value.set(
      mouse.current.x,
      mouse.current.y
    );

    simulationMaterial.uniforms.uMouseStrength.value =
      velocity.current * 0.75;

    simulationMaterial.uniforms.uPrevious.value =
      rippleTargets.read.texture;

    gl.setRenderTarget(
      rippleTargets.write
    );

    gl.render(
      simulationScene,
      simulationCamera
    );

    gl.setRenderTarget(null);

    const temp = rippleTargets.read;

    rippleTargets.read =
      rippleTargets.write;

    rippleTargets.write = temp;

    liquidMaterial.uniforms.uRipple.value =
      rippleTargets.read.texture;

    velocity.current *= 0.90;

    liquidMaterial.uniforms.uContainerResolution.value.set(
      size.width,
      size.height
    );

    liquidMaterial.uniforms.uTime.value =
      state.clock.elapsedTime;

    if (
      video.videoWidth &&
      video.videoHeight
    ) {
      liquidMaterial.uniforms.uVideoResolution.value.set(
        video.videoWidth,
        video.videoHeight
      );
    }
  });

  return (
    <mesh
      scale={[
        viewport.width,
        viewport.height,
        1,
      ]}
    >
      <planeGeometry args={[1, 1]} />

      <primitive
        object={liquidMaterial}
        attach="material"
      />
    </mesh>
  );
}

export default function LiquidHero() {
  const mouse = useRef({
    x: 0.5,
    y: 0.5,
  });

  const targetMouse = useRef({
    x: 0.5,
    y: 0.5,
  });

  const velocity = useRef(0);

  const lastPosition = useRef({
    x: 0.5,
    y: 0.5,
  });

  const handleMouseMove = (event) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      1 -
      (event.clientY - rect.top) /
      rect.height;

    const dx =
      x - lastPosition.current.x;

    const dy =
      y - lastPosition.current.y;

    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );

    const movement =
      Math.min(
        distance * 18,
        1.0
      );

    velocity.current =
      Math.min(
        velocity.current + movement,
        1.5
      );

    lastPosition.current = {
      x,
      y,
    };

    targetMouse.current = {
      x,
      y,
    };
  };

  const handleMouseLeave = () => {
    velocity.current *= 0.4;
  };

  return (
    <section
      className="relative isolate w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          orthographic
          camera={{
            zoom: 1,
            position: [0, 0, 1],
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <SmoothMouse
            mouse={mouse}
            targetMouse={targetMouse}
          />

          <LiquidSurface
            mouse={mouse}
            velocity={velocity}
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className="absolute left-8 md:left-16 bottom-12 md:bottom-16">
          <p className="mb-4 text-xs md:text-sm uppercase tracking-[0.35em] text-white/60">
            Creative Developer
          </p>

          <h1 className="text-white text-6xl md:text-8xl lg:text-[9rem] leading-[0.82] tracking-[-0.06em] font-medium drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
            Jesse
            <br />
            Simes<span className="text-white/40">.</span>
          </h1>
        </div>

        <div className="absolute right-8 md:right-16 bottom-12 md:bottom-16 max-w-xs">
          <p className="text-sm md:text-base leading-relaxed text-white/60">
            I design and build interactive digital
            experiences with code, motion and
            visual storytelling.
          </p>
        </div>
      </div>
    </section>
  );
}

function SmoothMouse({
  mouse,
  targetMouse,
}) {
  useFrame(() => {
    mouse.current.x +=
      (
        targetMouse.current.x -
        mouse.current.x
      ) * 0.12;

    mouse.current.y +=
      (
        targetMouse.current.y -
        mouse.current.y
      ) * 0.12;
  });

  return null;
}