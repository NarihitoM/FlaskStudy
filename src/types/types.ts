export interface Response  {
    question: string,
    choices: string[],
    answer: string,
}
export interface Flashcards {
    front: string,
    back: string,
}

export interface Array  {
    title: string,
    response: Response[],
    flashcard: Flashcards[],
    summary : string,
}

export interface SStorage  {
    _id: string,
    studies : Array[],
}

interface Data  {
    question : string,
    choices : string[],
    answer : string
}
export interface Quizset  {
    title : string,
    quiz : Data[]
}

export interface QuizData  {
    title : string,
    quiz : Data[],
    status : string,
    score : string,
}
