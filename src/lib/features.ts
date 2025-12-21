import { BookOpen, Zap, FileText, Brain } from "lucide-react";

type Feature = {
    icon: any,
    title: string,
    description: string,
}

const featureslist: Feature[] = [
    {
        icon: BookOpen,
        title: "Flashcards",
        description: "Fast creation and review—master key concepts with active recall.",
    },
    {
        icon: Zap,
        title: "Memory Tools",
        description: "Spaced repetition and mnemonic helpers to remember more, faster.",
    },
    {
        icon: FileText,
        title: "Notes",
        description: "Organize class notes and convert them into review-ready summaries.",
    },
    {
        icon: Brain,
        title: "Ai assistance",
        description: "Learn smarter and faster with our intelligent AI study partner for Effeciency.",
    }
]



export default featureslist;