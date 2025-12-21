import { BookOpen, Brain, BadgeQuestionMark,TestTube,Notebook} from "lucide-react";

type Items = {
    icon : any,
    title : string,
    summary : string,
}

const dashboarditems : Items[] =
[
   {
        icon: BookOpen,
        title: "Flashcards",
        summary: "We rovide fast creation and review—master key concepts with active recall.",
    },
    {
        icon: BadgeQuestionMark,
        title: "MCQ",
        summary: "We provide Mutiple choice for active learning.",
    },
    {
        icon: Notebook,
        title: "Summary",
        summary: "We provide summary details about the user's study materials.",
    },
    {
        icon: TestTube,
        title: "Quiz",
        summary: "We provide quiz for users to test how they are proficient.",
    },
    {
        icon: Brain,
        title: "Ai assistance",
        summary: "We provide questions,mcq and flashcards with our Ai model.",
    }
]
    


export default dashboarditems;