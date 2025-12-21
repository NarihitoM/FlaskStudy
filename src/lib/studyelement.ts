import { BadgeQuestionMark, HomeIcon, IdCardLanyardIcon, LayoutDashboard, Notebook, TestTube } from "lucide-react"


const studyelement = (title: string) => [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    }, 
    {
        title: "Home",
        url: `/studydetail/${title}`,
        icon: HomeIcon,
    }
    , 
    {
        title: "Summary",
        url: `/studydetail/${title}/summary`,
        icon : Notebook,
    },
    {
        title : "Flashcard",
        url : `/studydetail/${title}/card`,
        icon : IdCardLanyardIcon,
    },
    {
        title : "MCQ",
        url : `/studydetail/${title}/mcq`,
        icon : BadgeQuestionMark,
    },
    {
        title : "Quiz",
        url : `/studydetail/${title}/quiz`,
        icon : TestTube
    }
]

export default studyelement
