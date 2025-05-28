/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema } from "@/lib/types";
import mockSchema from "@/mock/mock.json";
import { setFormSchema } from "@/store/slices/formSchemaSlice";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

// Decode JWT to extract payload
const decodeJWT = (token: string): { [key: string]: any } | null => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

// Check if token is expired
const isTokenExpired = (decoded: { exp?: number }): boolean => {
    if (!decoded?.exp) return true;
    return Date.now() >= decoded.exp * 1000;
};

export const useFormSchema = () => {
    const dispatch = useDispatch();
    const accessToken = sessionStorage.getItem("accessToken");

    return useQuery<FormSchema, Error>({
        queryKey: ["formSchema"],
        queryFn: async () => {
            if (!accessToken) {
                console.warn(
                    "No access token available, falling back to mock schema"
                );
                dispatch(setFormSchema(mockSchema as unknown as FormSchema));
                return mockSchema as unknown as FormSchema;
            }

            // Decode JWT to extract formID
            const decodedToken = decodeJWT(accessToken);
            if (!decodedToken) {
                console.warn("Invalid JWT token, falling back to mock schema");
                dispatch(setFormSchema(mockSchema as unknown as FormSchema));
                return mockSchema as unknown as FormSchema;
            }

            if (isTokenExpired(decodedToken)) {
                console.warn(
                    "Access token expired, falling back to mock schema"
                );
                // Optionally: Implement refresh token logic here
                dispatch(setFormSchema(mockSchema as unknown as FormSchema));
                return mockSchema as unknown as FormSchema;
            }

            // Use hardcoded formID or extract from token if available
            const formID =
                decodedToken.formID || "dc8e18b4-b0ad-4b76-a4c5-cd340f84d494";
            const apiUrl = `https://rpcapplication.aiims.edu/form/api/v1/form/${formID}`;

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const schema = response.data;
                if (!schema || !schema.versions || !schema.versions.length) {
                    console.warn(
                        "Invalid or empty form schema, falling back to mock"
                    );
                    dispatch(
                        setFormSchema(mockSchema as unknown as FormSchema)
                    );
                    return mockSchema as unknown as FormSchema;
                }
                dispatch(setFormSchema(schema));
                return schema;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string }>;
                const errorMsg = axiosError.response
                    ? `API Error: ${axiosError.response.status} - ${
                          axiosError.response.data?.message ||
                          axiosError.message
                      }`
                    : `Network Error: ${axiosError.message}`;
                console.error(errorMsg, axiosError);
                console.warn("API request failed, falling back to mock schema");
                dispatch(setFormSchema(mockSchema as unknown as FormSchema));
                return mockSchema as unknown as FormSchema;
            }
        },
        enabled: true,
        retry: (failureCount, error) => {
            if (error.message.includes("401")) return false;
            return failureCount < 2;
        },
    });
};
