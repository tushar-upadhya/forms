/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormSchema } from "@/lib/types";
import { setFormSchema } from "@/store/slices/formSchemaSlice";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

//  decode token
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
        console.log("Failed to decode JWT:", error);
        return null;
    }
};

export const useFormSchema = () => {
    const dispatch = useDispatch();
    const accessToken = sessionStorage.getItem("accessToken");

    return useQuery<FormSchema, Error>({
        queryKey: ["formSchema"],
        queryFn: async () => {
            if (!accessToken) {
                const errorMsg = "No access token available";

                console.log(errorMsg);

                throw new Error(errorMsg);
            }

            const decodedToken = decodeJWT(accessToken);
            if (!decodedToken) {
                const errorMsg = "Invalid JWT token";

                console.log(errorMsg);

                throw new Error(errorMsg);
            }

            const formID = decodedToken.formID || decodedToken.username;
            if (!formID) {
                const errorMsg = "No formID found in JWT token";

                console.log(errorMsg);

                throw new Error(errorMsg);
            }

            const apiUrl = `https://rpcapplication.aiims.edu/form/api/v1/form/${formID}`;

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const schema = response.data;

                console.log("API Response:", schema);

                if (!schema || !schema.versions || !schema.versions.length) {
                    const errorMsg = "Invalid or empty form schema received";

                    console.log(errorMsg, schema);

                    throw new Error(errorMsg);
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

                console.log(errorMsg, axiosError);

                throw new Error(errorMsg);
            }
        },
        enabled: !!accessToken,
    });
};
