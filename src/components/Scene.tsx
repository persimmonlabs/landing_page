"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function Persimmon() {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Calculate scroll progress (0 to 1)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Camera Movement
        // Start Z: 8, End Z: 2.5
        const targetZ = 8 - (8 - 2.5) * progress;
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);

        // Breathing Effect
        // As user approaches (progress increases), breathing magnitude increases slightly
        const baseScale = 1;
        const breathingMag = 0.05 + (progress * 0.05); // 0.05 to 0.1
        const scale = baseScale + Math.sin(time * 0.5) * breathingMag;

        if (outerRef.current) {
            outerRef.current.rotation.y += 0.0005; // Slightly faster than 0.0001 to be visible
            outerRef.current.rotation.z += 0.0002;
            outerRef.current.scale.set(scale, scale, scale);
        }

        if (innerRef.current) {
            innerRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group>
            {/* Outer Sphere */}
            <mesh ref={outerRef}>
                <sphereGeometry args={[0.8, 128, 128]} />
                <meshPhongMaterial
                    color="#EC5800"
                    emissive="#2a0a00"
                    wireframe={true}
                    opacity={0.2}
                    transparent={true}
                />
            </mesh>

            {/* Inner Core */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[0.3, 64, 64]} />
                <meshBasicMaterial color="#EC5800" />
            </mesh>
        </group>
    );
}

function Starfield() {
    const ref = useRef<THREE.Points>(null);

    const [positions] = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            const r = 10 + Math.random() * 30; // Radius between 10 and 40
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return [positions];
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 100;
            ref.current.rotation.y -= delta / 150;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#EAEAEA"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <color attach="background" args={["#050505"]} />
                <fog attach="fog" args={["#050505", 5, 15]} /> {/* Adjusted fog for visibility */}

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Persimmon />
                <Starfield />
            </Canvas>
        </div>
    );
}
