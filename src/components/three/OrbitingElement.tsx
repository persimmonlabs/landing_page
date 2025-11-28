"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface OrbitingElementProps {
    /** Distance from center */
    radius?: number;
    /** Fixed angle position in radians */
    angle?: number;
    /** Vertical offset from center */
    yOffset?: number;
    /** Opacity (0-1) */
    opacity?: number;
    /** Scale multiplier */
    scale?: number;
    /** Subtle floating motion intensity */
    floatIntensity?: number;
    /** Start from behind sphere */
    startBehind?: boolean;
    /** CSS class for the container */
    className?: string;
    children: React.ReactNode;
}

export default function OrbitingElement({
    radius = 1.5,
    angle = 0,
    yOffset = 0,
    opacity = 1,
    scale = 1,
    floatIntensity = 0.05,
    startBehind = true,
    className = "",
    children,
}: OrbitingElementProps) {
    const groupRef = useRef<THREE.Group>(null);
    const timeRef = useRef(Math.random() * 100);

    useFrame((_, delta) => {
        if (groupRef.current) {
            timeRef.current += delta;

            // Fixed position with subtle floating
            const baseX = Math.cos(angle) * radius;
            const baseZ = startBehind ? -Math.abs(Math.sin(angle) * radius) - 0.5 : Math.sin(angle) * radius;

            // Gentle floating motion
            const floatX = Math.sin(timeRef.current * 0.5) * floatIntensity;
            const floatY = Math.cos(timeRef.current * 0.7) * floatIntensity;
            const floatZ = Math.sin(timeRef.current * 0.3) * floatIntensity * 0.5;

            groupRef.current.position.x = baseX + floatX;
            groupRef.current.position.y = yOffset + floatY;
            groupRef.current.position.z = baseZ + floatZ;
        }
    });

    return (
        <group ref={groupRef}>
            <Html
                center
                style={{
                    opacity,
                    transform: `scale(${scale})`,
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                    pointerEvents: opacity > 0.5 ? "auto" : "none",
                }}
                className={className}
            >
                {children}
            </Html>
        </group>
    );
}
