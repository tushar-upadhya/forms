/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginPayload } from "@/lib/types";
import { setAccessToken } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";

export function useLogin(
    onSuccess?: (data: any) => void,
    onError?: (error: any) => void
) {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async (data: LoginPayload) => {
            const response = await axios.post(
                "https://rpcapplication.aiims.edu/form/api/v1/auth/login",
                data
            );
            return response.data;
        },
        onSuccess: (data) => {
            if (data.access_token) {
                dispatch(setAccessToken(data.access_token));
            }
            onSuccess?.(data);
        },
        onError,
    });
}
