import axios from "axios";

{/*Ai Api Host */}
const url = "https://flasks-ai.vercel.app";

export async function aiupload(data: FormData) {
    const response = await axios.post(`${url}/aiupload`, data
    );
    return response.data;
}

export async function aiquiz(title : string, number : string, difficult : string) {
    const response = await axios.post(`${url}/aiquiz`,{
        title : title,
        number : number,
        difficult : difficult
    })
    return response.data;
}