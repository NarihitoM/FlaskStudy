import axios from "axios";
import type { Array, Quizset } from "@/types/response";

{/*User api host */}
const url = "https://flask-db-gamma.vercel.app";

export async function signup(username: string, useremail: string, userpassword: string) {
    const response = await axios.post(`${url}/api/signup`, {
        username: username,
        useremail: useremail,
        userpassword: userpassword
    });
    return response.data;
}

export async function login(useremail: string, userpassword: string) {
    const response = await axios.post(`${url}/api/login`, {
        useremail: useremail,
        userpassword: userpassword,
    });
    return response.data;
}

export async function form(name: string, email: string, message: string) {
    const response = await axios.post(`${url}/message/api/form`, {
        username: name,
        useremail: email,
        usermessage: message,
    })
    return response.data;
}

export async function getprofile(token: any) {
    const response = await axios.get(`${url}/api/getprofile`,
        {
            headers:
            {
                Authorization: `${token}`
            }
        }
    )
    return response.data;
}

export async function filestore(id: string, result: Array) {
    const response = await axios.post(`${url}/store/study`, {
        id: id,
        data: result
    })
    return response.data
}

export async function getstore(token: any) {
    const response = await axios.get(`${url}/store/storage`, {
        headers: {
            Authorization: `${token}`
        }
    })
    return response.data;
}

export async function deletetitle(index: number, token: string) {

    const response = await axios.delete(`${url}/store/delete`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            index: index
        }
    });
    return response.data;
}

export async function getflashcard(title: string, token: string) {
    const response = await axios.get(`${url}/store/fetchflash`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: {
            title: title
        }
    })
    return response.data;
}

export async function storehistory(id: string, data: Quizset | null, status: string, score: string) {
    const response = await axios.post(`${url}/store/store`, {
        userid: id,
        data: data,
        status: status,
        score: score
    });
    return response.data;
}

export async function gethistory(token: string) {
    const response = await axios.get(`${url}/store/getstore`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

export async function deletehistory(token: string, index: string) {
    const response = await axios.delete(`${url}/store/deletestore`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        ,
        data: {
            index: index
        }
    })
    return response.data
}