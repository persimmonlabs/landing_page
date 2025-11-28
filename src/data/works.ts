export interface Work {
    id: string;
    name: string;
    tagline: string;
    logo: string;
    url?: string;
}

export const works: Work[] = [
    {
        id: "imensiah",
        name: "Imensiah",
        tagline: "Strategic intelligence platform",
        logo: "/works/imensiah-logo.svg",
        url: "#",
    },
];

export interface Founder {
    name: string;
    title: string;
    quote: string;
    portrait: string;
    website: string;
}

export const founder: Founder = {
    name: "Renato DAP",
    title: "Engineer & Creator",
    quote: "I create systems\nwith rhythm and logic.",
    portrait: "/founder/renato-portrait.png",
    website: "https://renatodap.me",
};
