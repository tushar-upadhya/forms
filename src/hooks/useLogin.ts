import type { LoginPayload } from "@/lib/types";
import { setAccessToken } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const url = `${BASE_URL}/auth/login`;

interface LoginResponse {
    access_token: string;
}

export function useLogin(
    onSuccess?: (data: LoginResponse) => void,
    onError?: (error: AxiosError<{ message?: string }>) => void
) {
    const dispatch = useDispatch();

    return useMutation<
        LoginResponse,
        AxiosError<{ message?: string }>,
        LoginPayload
    >({
        mutationFn: async (data: LoginPayload) => {
            const response = await axios.post(url, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.access_token) {
                sessionStorage.setItem("accessToken", data.access_token);
                dispatch(setAccessToken(data.access_token));
                console.log("Login successful, token stored");
            }
            onSuccess?.(data);
        },
        onError: (error) => {
            console.error(
                "Login failed:",
                error.response?.data?.message || error.message
            );
            onError?.(error);
        },
    });
}
