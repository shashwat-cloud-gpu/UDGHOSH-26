import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Simulated Live Data API
const MOCK_LIVE_DATA = [
  { id: 1, title: "Athletics Registration Full", color: "#ff4444", status: "CLOSED", url: "https://events.udghosh.org.in/" },
  { id: 2, title: "Basketball Finals", color: "#38bdf8", status: "ONGOING", url: "https://events.udghosh.org.in/" },
  { id: 3, title: "Chess Tournament", color: "#a855f7", status: "OPEN", url: "https://events.udghosh.org.in/" },
  { id: 4, title: "E-Sports: Valorant", color: "#facc15", status: "REGISTERING", url: "https://events.udghosh.org.in/" },
  { id: 5, title: "Swimming Heats", color: "#4ade80", status: "UPCOMING", url: "https://events.udghosh.org.in/" },
];

function LiveEventCores({ data, timeScaleRef }) {
  const meshRef = useRef();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Distribute cores inside the storm
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const corePositions = useMemo(() => {
    return data.map(() => {
      const r = Math.random() * 8 + 3;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8;
      return new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta) - 10);
    });
  }, [data]);

  const coreColors = useMemo(() => {
    const arr = new Float32Array(data.length * 3);
    const col = new THREE.Color();
    data.forEach((d, i) => {
      col.set(d.color);
      arr[i * 3 + 0] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    });
    return arr;
  }, [data]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Swirl the cores along with the storm, but slower
    corePositions.forEach((pos, i) => {
      const angle = Math.atan2(pos.z + 10, pos.x) + delta * timeScaleRef.current * 0.5;
      const r = Math.sqrt(pos.x * pos.x + (pos.z + 10) * (pos.z + 10));
      pos.x = r * Math.cos(angle);
      pos.z = r * Math.sin(angle) - 10;
      pos.y += Math.sin(time * 2 + i) * 0.02 * timeScaleRef.current; // bobbing
      
      dummy.position.copy(pos);
      // Pulsate scale slightly
      const s = 1.0 + Math.sin(time * 5 + i) * 0.2;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[null, null, data.length]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredIdx(e.instanceId);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredIdx(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.4, 16, 16]}>
          <instancedBufferAttribute attach="attributes-color" args={[coreColors, 3]} />
        </sphereGeometry>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>
      
      {/* HTML Tooltip for hovered core */}
      {hoveredIdx !== null && (
        <Html position={corePositions[hoveredIdx]} center zIndexRange={[100, 0]}>
          <div style={{
            background: "rgba(0,0,0,0.8)",
            border: `1px solid ${data[hoveredIdx].color}`,
            borderRadius: "8px",
            padding: "12px",
            color: "white",
            width: "max-content",
            pointerEvents: "auto",
            fontFamily: "sans-serif",
            backdropFilter: "blur(4px)",
            transform: "translateY(-40px)",
            boxShadow: `0 0 15px ${data[hoveredIdx].color}44`
          }}>
            <div style={{ fontSize: "0.7rem", color: data[hoveredIdx].color, fontWeight: "bold", letterSpacing: "1px" }}>
              {data[hoveredIdx].status}
            </div>
            <div style={{ fontSize: "1rem", margin: "4px 0 12px 0", fontWeight: "bold" }}>
              {data[hoveredIdx].title}
            </div>
            <a 
              href={data[hoveredIdx].url}
              style={{
                display: "inline-block", background: data[hoveredIdx].color,
                color: "#000", padding: "4px 12px", borderRadius: "4px",
                textDecoration: "none", fontSize: "0.8rem", fontWeight: "bold"
              }}
            >
              REGISTER
            </a>
          </div>
        </Html>
      )}
    </>
  );
}

function Particles({ timeScaleRef }) {
  const pointsRef = useRef();
  const particleCount = 8000;

  // Create initial random positions for particles
  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 20 + 2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 15;
      
      pos[i * 3 + 0] = r * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta) - 10;
    }
    return [pos];
  }, [particleCount]);

  const circleTex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const dt = delta * timeScaleRef.current;
    const pos = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2] + 10;

      const r = Math.sqrt(x*x + z*z);
      const angle = Math.atan2(z, x) + dt * 2.5 * (10 / (r + 1));
      
      let targetR = Math.max(0.5, r - dt * 5); 
      let newY = y + dt * 8;
      if (newY > 15) { newY = -15; targetR = Math.random() * 20 + 2; }

      pos[i3] = targetR * Math.cos(angle);
      pos[i3 + 1] = newY;
      pos[i3 + 2] = targetR * Math.sin(angle) - 10;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += dt * 0.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        color="#38BDF8" 
        transparent 
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={circleTex}
        alphaTest={0.01}
      />
    </points>
  );
}

function Scene({ data }) {
  const timeScaleRef = useRef(1.0);
  const targetTimeScale = useRef(1.0);

  useFrame((_, delta) => {
    // Lerp time scale for smooth slowdown/speedup
    timeScaleRef.current = THREE.MathUtils.lerp(timeScaleRef.current, targetTimeScale.current, delta * 3);
  });

  return (
    <group 
      onPointerOver={() => { targetTimeScale.current = 0.05; }}
      onPointerOut={() => { targetTimeScale.current = 1.0; }}
    >
      <Particles timeScaleRef={timeScaleRef} />
      <LiveEventCores data={data} timeScaleRef={timeScaleRef} />
    </group>
  );
}

export default function GroundStormTransition({ onClose }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setData(MOCK_LIVE_DATA);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "auto", background: "rgba(0,0,0,0.85)" }}>
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: "absolute", top: "6rem", right: "3rem", zIndex: 200,
          background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
          color: "white", padding: "8px 24px", borderRadius: "4px",
          cursor: "pointer", fontFamily: "'Cinzel', serif", letterSpacing: "2px"
        }}
      >
        RETURN
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene data={data} />
      </Canvas>
    </div>
  );
}
