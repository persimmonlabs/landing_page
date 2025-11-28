"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

interface StarfieldProps {
    count?: number;
    color?: string;
    size?: number;
    minRadius?: number;
    maxRadius?: number;
}

export default function Starfield({
    count = 2000,
    color = "#EAEAEA",
    size = 0.02,
    minRadius = 10,
    maxRadius = 40,
}: StarfieldProps) {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = minRadius + Math.random() * (maxRadius - minRadius);
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count, minRadius, maxRadius]);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 100;
            ref.current.rotation.y -= delta / 150;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points
                ref={ref}
                positions={positions}
                stride={3}
                frustumCulled={false}
            >
                <PointMaterial
                    transparent
                    color={color}
                    size={size}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
