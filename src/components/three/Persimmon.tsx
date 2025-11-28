"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PersimmonProps {
    color?: string;
    emissive?: string;
    breathingIntensity?: number;
    rotationSpeed?: number;
}

export default function Persimmon({
    color = "#EC5800",
    emissive = "#2a0a00",
    breathingIntensity = 0.05,
    rotationSpeed = 0.0005,
}: PersimmonProps) {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshPhongMaterial>(null);
    const innerMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Calculate scroll progress
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

        // Camera movement
        const targetZ = 8 - (8 - 2.5) * progress;
        state.camera.position.z = THREE.MathUtils.lerp(
            state.camera.position.z,
            targetZ,
            0.1
        );

        // Breathing effect
        const baseScale = 1;
        const breathingMag = breathingIntensity + progress * breathingIntensity;
        const scale = baseScale + Math.sin(time * 0.5) * breathingMag;

        if (outerRef.current) {
            outerRef.current.rotation.y += rotationSpeed;
            outerRef.current.rotation.z += rotationSpeed * 0.4;
            outerRef.current.scale.set(scale, scale, scale);
        }

        if (innerRef.current) {
            innerRef.current.scale.set(scale, scale, scale);
        }

        // Update colors (for dynamic color changes)
        if (materialRef.current) {
            materialRef.current.color.lerp(new THREE.Color(color), 0.05);
            materialRef.current.emissive.lerp(new THREE.Color(emissive), 0.05);
        }

        if (innerMaterialRef.current) {
            innerMaterialRef.current.color.lerp(new THREE.Color(color), 0.05);
        }
    });

    return (
        <group>
            {/* Outer Wireframe Sphere */}
            <mesh ref={outerRef}>
                <sphereGeometry args={[0.8, 128, 128]} />
                <meshPhongMaterial
                    ref={materialRef}
                    color={color}
                    emissive={emissive}
                    wireframe={true}
                    opacity={0.2}
                    transparent={true}
                />
            </mesh>

            {/* Inner Core */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[0.3, 64, 64]} />
                <meshBasicMaterial ref={innerMaterialRef} color={color} />
            </mesh>
        </group>
    );
}
