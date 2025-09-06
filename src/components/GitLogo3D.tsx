import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function GitLogoMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Main Git Logo Shape */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color={hovered ? "#00D4FF" : "#0099CC"}
            emissive={hovered ? "#002244" : "#001122"}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Orbiting Nodes (representing commits) */}
        <group>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 4,
                Math.sin((i / 6) * Math.PI * 2) * 0.5,
                Math.sin((i / 6) * Math.PI * 2) * 4,
              ]}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#00FF7F"
                emissive="#003300"
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* Connecting Lines (branches) */}
        <group>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={`line-${i}`}
                position={[
                  Math.cos(angle) * 2,
                  Math.sin(angle) * 0.25,
                  Math.sin(angle) * 2,
                ]}
                rotation={[0, angle, 0]}
              >
                <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
                <meshStandardMaterial
                  color="#FF6600"
                  emissive="#221100"
                  metalness={0.8}
                  roughness={0.1}
                />
              </mesh>
            );
          })}
        </group>

        {/* Particle Effects */}
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh
              key={`particle-${i}`}
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial 
                color="#00D4FF"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

interface GitLogo3DProps {
  className?: string;
}

export const GitLogo3D: React.FC<GitLogo3DProps> = ({ className = "" }) => {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={1} 
          color="#00D4FF" 
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color="#FF6600" 
        />
        
        {/* 3D Logo */}
        <GitLogoMesh />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};