/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface LoginPayload {
    email: string;
    password: string;
}

export function useLogin(
    onSuccess?: () => void,
    onError?: (error: any) => void
) {
    return useMutation({
        mutationFn: async (data: LoginPayload) => {
            const response = await axios.post("/form/api/v1/auth/login", data);
            return response.data;
        },
        onSuccess,
        onError,
    });
}
