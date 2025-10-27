import axios from "axios"

export const loginUser = async (data) =>{
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/signin` , data)
    return res.data
}
export const signupUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/signup` , data)
    return res.data
}
export const updateser = async (id ,data) => {
    const res = await axios.put(`${import.meta.env.VITE_API_URL_BACKEND}/api/user/updateUser/${id}`, data)
    return res.data
}