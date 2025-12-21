export type Response = {
    question: string,
    choices: string[],
    answer: string,
}
export type Flashcards = {
    front: string,
    back: string,
}

export type Array = {
    title: string,
    response: Response[],
    flashcard: Flashcards[],
    summary : string,
}

export type SStorage = {
    _id: string,
    studies : Array[],
}

type Data = {
    question : string,
    choices : string[],
    answer : string
}
export type Quizset = {
    title : string,
    quiz : Data[]
}

export type QuizData = {
    title : string,
    quiz : Data[],
    status : string,
    score : string,
}
