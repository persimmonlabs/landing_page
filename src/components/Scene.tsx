"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import Persimmon from "@/components/three/Persimmon";
import Starfield from "@/components/three/Starfield";
import OrbitingElement from "@/components/three/OrbitingElement";
import { getSphereColor, isSectionVisible } from "@/components/three/useScrollProgress";
import { founder, works } from "@/data/works";
import Image from "next/image";

function SceneContent() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            setScrollProgress(Math.min(Math.max(scrollY / maxScroll, 0), 1));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { color, emissive } = getSphereColor(scrollProgress);
    const showPortrait = isSectionVisible(scrollProgress, "origins");
    const showWorks = isSectionVisible(scrollProgress, "works");

    return (
        <>
            <color attach="background" args={["#050505"]} />
            <fog attach="fog" args={["#050505", 5, 15]} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Persimmon color={color} emissive={emissive} />
            <Starfield />

            {/* Portrait floating near sphere during Origins section */}
            <OrbitingElement
                radius={1.2}
                angle={Math.PI * 0.15}
                yOffset={0.4}
                opacity={showPortrait ? 1 : 0}
                scale={showPortrait ? 1 : 0.5}
                floatIntensity={0.03}
                startBehind={true}
            >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden opacity-90 hover:opacity-100 transition-opacity border border-persimmon/20">
                    <Image
                        src={founder.portrait}
                        alt={founder.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                    />
                </div>
            </OrbitingElement>

            {/* Imensiah logo floating near sphere during Works section */}
            {works.map((work, index) => (
                <OrbitingElement
                    key={work.id}
                    radius={1.3}
                    angle={Math.PI * (0.1 + index * 0.2)}
                    yOffset={-0.3}
                    opacity={showWorks ? 1 : 0}
                    scale={showWorks ? 1 : 0.5}
                    floatIntensity={0.025}
                    startBehind={true}
                >
                    <div className="w-28 h-14 md:w-36 md:h-18 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                        <Image
                            src={work.logo}
                            alt={work.name}
                            width={144}
                            height={72}
                            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(236,88,0,0.3)]"
                        />
                    </div>
                </OrbitingElement>
            ))}
        </>
    );
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <SceneContent />
            </Canvas>
        </div>
    );
}
