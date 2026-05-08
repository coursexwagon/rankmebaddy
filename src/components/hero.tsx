"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

/* ─── 3D Globe — Colorless wireframe (original look) ─────────── */
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const wireGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 3);
    return new THREE.EdgesGeometry(geo);
  }, []);

  // Latitude rings (like the original SVG)
  const rings = useMemo(() => {
    const r = [];
    const latitudes = [-40, -20, 0, 20, 40];
    latitudes.forEach((lat) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const ringRadius = 2.2 * Math.sin(phi);
      const y = 2.2 * Math.cos(phi);
      r.push({ radius: ringRadius, y });
    });
    return r;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
    if (wireRef.current) wireRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group>
      {/* Dark fill sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#0A0A0B" transparent opacity={0.95} />
      </mesh>

      {/* Wireframe icosahedron */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial color="#FAFAFA" transparent opacity={0.07} />
      </lineSegments>

      {/* Latitude rings */}
      {rings.map((ring, i) => (
        <mesh key={i} rotation-x={0}>
          <ringGeometry args={[ring.radius - 0.01, ring.radius, 64]} />
          <meshBasicMaterial
            color="#FAFAFA"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Prime meridian ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[2.19, 2.2, 64]} />
        <meshBasicMaterial
          color="#FAFAFA"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── Floating Particles ─────────────────────────────────────── */
function FloatingParticles() {
  const particles = [
    { x: "10%", y: "20%", size: 3, delay: 0, duration: 18 },
    { x: "85%", y: "15%", size: 2, delay: 2, duration: 22 },
    { x: "70%", y: "70%", size: 2.5, delay: 4, duration: 20 },
    { x: "20%", y: "75%", size: 2, delay: 1, duration: 24 },
    { x: "50%", y: "10%", size: 1.5, delay: 3, duration: 16 },
    { x: "90%", y: "45%", size: 2, delay: 5, duration: 19 },
    { x: "5%", y: "50%", size: 1.5, delay: 2.5, duration: 21 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#6EE7B7]"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -8, 5, 0],
            opacity: [0.15, 0.35, 0.2, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Underline Span ─────────────────────────────────────────── */
function UnderlinedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full overflow-visible"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        style={{ height: "0.12em" }}
      >
        <motion.path
          d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5"
          stroke="#6EE7B7"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Grid Lines Background ──────────────────────────────────── */
function GridLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: globe moves slower than text
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 md:pt-44"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <GridLines />
      <FloatingParticles />

      {/* 3D Globe — parallax layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ y: globeY, opacity: globeOpacity }}
      >
        <div className="h-[500px] w-[500px] sm:h-[600px] sm:w-[600px] md:h-[700px] md:w-[700px]">
          <Canvas
            camera={{ position: [0, 0, 5.5], fov: 45 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.1} />
            <Globe />
          </Canvas>
        </div>
      </motion.div>

      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[600px] w-[600px] rounded-full sm:h-[700px] sm:w-[700px]"
          style={{
            background:
              "radial-gradient(circle, rgba(250,250,250,0.02) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0B]/60 to-transparent" />

      {/* Text — parallax layer */}
      <motion.div className="relative z-10 mx-auto max-w-3xl" style={{ y: textY }}>
        {/* Headline */}
        <motion.h1
          className="font-heading text-center text-4xl font-bold leading-[1.08] tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <UnderlinedWord>Rank</UnderlinedWord> everywhere.
          <br />
          <UnderlinedWord>Autonomously</UnderlinedWord>.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-[#A1A1AA] sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Your AI SEO partner. Tell it what to rank — it handles the rest across
          Google, YouTube, Amazon, TikTok, and AI Search.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="#pricing"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-all"
          >
            <span className="absolute inset-0 rounded-full bg-[#6EE7B7] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20" />
            <span className="absolute inset-[1px] rounded-full bg-[#0A0A0B]" />
            <span className="absolute inset-0 rounded-full border border-[#6EE7B7]/30 transition-colors duration-500 group-hover:border-[#6EE7B7]/60" />
            <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-[#6EE7B7]/50 rounded-tl-full transition-colors group-hover:border-[#6EE7B7]" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-[#6EE7B7]/50 rounded-tr-full transition-colors group-hover:border-[#6EE7B7]" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#6EE7B7]/50 rounded-bl-full transition-colors group-hover:border-[#6EE7B7]" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#6EE7B7]/50 rounded-br-full transition-colors group-hover:border-[#6EE7B7]" />
            <span className="relative z-10 flex items-center gap-2.5 text-[#FAFAFA]">
              Start ranking free
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </span>
          </a>

          <a
            href="#proof"
            className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-transparent px-6 py-3.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#FAFAFA]"
          >
            See results
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-5 text-center text-xs text-[#52525B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Free to start · No credit card · Results in 2 weeks
        </motion.p>

        {/* Platform row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {["Google", "YouTube", "Amazon", "TikTok", "AI Search"].map(
            (name) => (
              <span
                key={name}
                className="text-xs font-medium tracking-wide text-[#52525B]"
              >
                {name}
              </span>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
