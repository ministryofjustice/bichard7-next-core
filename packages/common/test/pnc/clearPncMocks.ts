import axios from "axios"

export const clearPncMocks = () => axios.delete("http://localhost:3000/mocks")
