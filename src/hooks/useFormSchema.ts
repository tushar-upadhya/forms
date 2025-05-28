/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormSchema } from "@/lib/types";
import { setFormSchema } from "@/store/slices/formSchemaSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";

export const useFormSchema = () => {
    const dispatch = useDispatch();
    const accessToken = sessionStorage.getItem("accessToken");

    return useQuery<FormSchema, Error>({
        queryKey: ["formSchema"],
        queryFn: async () => {
            if (!accessToken) {
                const errorMsg = "No access token available";
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
            try {
                const response = await axios.get(
                    "https://rpcapplication.aiims.edu/form/api/v1/form/",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const schema = response.data;
                console.log("API Response:", schema);
                if (!schema || !schema.versions || !schema.versions.length) {
                    const errorMsg = "Invalid or empty form schema received";
                    console.error(errorMsg, schema);
                    throw new Error(errorMsg);
                }
                dispatch(setFormSchema(schema));
                return schema;
            } catch (error: any) {
                const errorMsg = error.response
                    ? `API Error: ${error.response.status} - ${
                          error.response.data?.message || error.message
                      }`
                    : `Network Error: ${error.message}`;
                console.error(errorMsg, error);
                throw new Error(errorMsg);
            }
        },
        enabled: !!accessToken,
    });
};
