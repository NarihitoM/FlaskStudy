import { BadgeQuestionMarkIcon } from "lucide-react";

type FAQ ={
    id : number,
    icon : any,
    question : string,
    answer : string
}
const faq : FAQ[] = [
    {
       id : 1,
       icon : BadgeQuestionMarkIcon,
       question : "What is Flasks Study?",
       answer : "Flasks Study is an all-in-one learning platform that helps students study efficiently using flashcards, memory tools, organized notes, and an AI-powered assistant."
    },
    {
       id: 2,
       icon : BadgeQuestionMarkIcon,
       question : "How do flashcards work?",
       answer : "You can create, customize, and review flashcards to memorize key concepts quickly. Spaced repetition helps you retain information effectively over time."
    },
    {
       id : 3,
       icon : BadgeQuestionMarkIcon,
       question : "How does the AI study assistant help me learn?",
       answer : "The AI assistant provides explanations, summaries, and personalized study tips, making learning faster and more effective."
    }
]

export default faq;