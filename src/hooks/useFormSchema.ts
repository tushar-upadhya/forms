/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormSchema } from "@/lib/types";
import { setFormSchema } from "@/store/slices/formSchemaSlice";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

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
                throw new Error("Access token not found in sessionStorage.");
            }

            const decodedToken = decodeJWT(accessToken);
            if (!decodedToken) {
                throw new Error("Invalid JWT token.");
            }

            if (isTokenExpired(decodedToken)) {
                throw new Error("Access token is expired.");
            }

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
                    throw new Error(
                        "Received empty or invalid schema from API."
                    );
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
                throw new Error(errorMsg);
            }
        },
        enabled: true,
        retry: (failureCount, error) => {
            if (
                error.message.includes("401") ||
                error.message.includes("expired")
            )
                return false;
            return failureCount < 2;
        },
    });
};
