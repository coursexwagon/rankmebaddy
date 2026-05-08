"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Accent: #6EE7B7 (emerald-300)

/* ─── 3D Globe Component ────────────────────────────────────── */
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create wireframe sphere geometry
  const wireGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 3);
    const edges = new THREE.EdgesGeometry(geo);
    return edges;
  }, []);

  // City dots — random points on sphere surface
  const { dotPositions, dotColors } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const accentColor = new THREE.Color("#6EE7B7");
    const dimColor = new THREE.Color("#3F3F46");

    for (let i = 0; i < 60; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 2.22;
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      // ~20% of dots are accent color, rest are dim
      const isAccent = Math.random() < 0.2;
      const c = isAccent ? accentColor : dimColor;
      colors.push(c.r, c.g, c.b);
    }
    return {
      dotPositions: new Float32Array(positions),
      dotColors: new Float32Array(colors),
    };
  }, []);

  // Connection arcs between random points
  const arcPositions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 12; i++) {
      const phi1 = Math.acos(2 * Math.random() - 1);
      const theta1 = 2 * Math.PI * Math.random();
      const phi2 = Math.acos(2 * Math.random() - 1);
      const theta2 = 2 * Math.PI * Math.random();
      const r = 2.22;
      const p1 = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      );
      const p2 = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      );
      const mid = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(r * 1.3);
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(20);
      points.forEach((pt) => pos.push(pt.x, pt.y, pt.z));
    }
    return new Float32Array(pos);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.08;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Inner sphere — subtle dark fill */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#0A0A0B" transparent opacity={0.9} />
      </mesh>

      {/* Wireframe overlay */}
      <lineSegments ref={wireRef} geometry={wireGeo}>
        <lineBasicMaterial color="#27272A" transparent opacity={0.35} />
      </lineSegments>

      {/* City dots */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dotPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[dotColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Connection arcs */}
      <lineSegments rotation={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[arcPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6EE7B7" transparent opacity={0.12} />
      </lineSegments>

      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[2.6, 2.65, 64]} />
        <meshBasicMaterial
          color="#6EE7B7"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmospheric halo */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#6EE7B7"
          transparent
          opacity={0.015}
          side={THREE.BackSide}
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
  return (
    <section
      className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 md:pt-44"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <GridLines />
      <FloatingParticles />

      {/* 3D Globe — positioned behind the text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
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
      </div>

      {/* Radial glow behind globe */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[600px] w-[600px] rounded-full sm:h-[700px] sm:w-[700px]"
          style={{
            background:
              "radial-gradient(circle, rgba(110,231,183,0.06) 0%, rgba(110,231,183,0.02) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0B]/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl">
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

        {/* CTA — Creative morphing border button */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Primary CTA — animated border gradient */}
          <a
            href="#solution"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-all"
          >
            {/* Animated gradient border */}
            <span className="absolute inset-0 rounded-full bg-[#6EE7B7] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20" />
            <span className="absolute inset-[1px] rounded-full bg-[#0A0A0B]" />
            <span className="absolute inset-0 rounded-full border border-[#6EE7B7]/30 transition-colors duration-500 group-hover:border-[#6EE7B7]/60" />
            {/* Corner accents */}
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

          {/* Secondary CTA */}
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
      </div>
    </section>
  );
}
