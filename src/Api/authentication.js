import axios from "axios";
import { DOMAIN } from "./config";

export const registerApi = async (bodyObject) => {
    try {
        const response = await axios.post(`${DOMAIN}/users`, bodyObject, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return [response.data, ''];
    } catch (error) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.errors?.email?.[0] || errorData?.message || "Email is already taken";
        return ['', errorMessage];
    }
};





export const loginApi = async (bodyObject) => {
    try {
        const response = await axios.post(`${DOMAIN}/users/sign_in`, bodyObject, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const token = response.headers['authorization'];
        return [response.data, token, ''];
    } catch (error) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.errors?.email?.[0] || errorData?.message || "Wrong email or password";
        return ['', errorMessage];
    }
};






export const logoutApi = async (jwtToken) => {
    try {
        const response = await axios.delete(`${DOMAIN}/users/sign_out`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: jwtToken,
            },
        });
        if (response.status === 200) {
            return ['Logout successful', ''];
        } else {
            return ['', 'Logout failed'];
        }
    } catch (error) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || "Error occurred while logging out";
        return ['', errorMessage];  // Return error message
    }
};
