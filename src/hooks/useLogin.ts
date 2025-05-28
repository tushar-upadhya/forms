import type { LoginPayload } from "@/lib/types";
import { setAccessToken } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

interface LoginResponse {
    access_token: string;
}

const url = "https://rpcapplication.aiims.edu/form/api/v1/auth/login";

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
            // console.log("Login request:", {
            //     url: url,
            //     data,
            // });
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
