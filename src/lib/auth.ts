
export const settoken = (token: string) => {
    return localStorage.setItem("token", token)
}

export const gettoken = () => {
    return localStorage.getItem("token");
}

export const removetoken = () => {
    return localStorage.removeItem("token");
}