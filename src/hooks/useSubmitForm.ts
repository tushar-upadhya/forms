import type { FormValues } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface SubmitFormResponse {
    message: string;
    responseId?: string;
}

export function useSubmitForm(
    formId: string,
    onSuccess?: (data: SubmitFormResponse) => void,
    onError?: (error: AxiosError<{ message?: string }>) => void
) {
    return useMutation<
        SubmitFormResponse,
        AxiosError<{ message?: string }>,
        FormValues
    >({
        mutationFn: async (data: FormValues) => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("Access token not found in sessionStorage.");
            }

            const apiUrl = `https://rpcapplication.aiims.edu/form/api/v1/form/${formId}/responses`;

            try {
                const response = await axios.post(apiUrl, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const errorMsg = axiosError.response
                    ? `Submission Error: ${axiosError.response.status} - ${
                          axiosError.response.data?.message ||
                          axiosError.message
                      }`
                    : `Network Error: ${axiosError.message}`;
                throw new Error(errorMsg);
            }
        },
        onSuccess: (data) => {
            console.log("Form submission successful:", data);
            onSuccess?.(data);
        },
        onError: (error) => {
            console.error("Form submission failed:", error.message);
            onError?.(error);
        },
    });
}
