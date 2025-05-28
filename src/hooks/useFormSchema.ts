/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormSchema, Question, Section } from "@/lib/types";
import { setFormSchema } from "@/store/slices/formSchemaSlice";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

interface JWTPayload {
    formID?: string;
    username?: string;
    sub?: string;
    [key: string]: any;
}

interface ApiQuestion {
    id: string;
    text: string;
    field_type: string;
    is_required: boolean;
    is_disabled: boolean;
    options?: {
        id: string;
        option_value: string;
        option_label: string;
        is_disabled: boolean;
        is_default?: boolean;
        order?: number;
    }[];
    created_at?: string;
    default_value?: string | null;
    help_text?: string | null;
    meta_data?: Record<string, any>;
    order?: number | null;
    validation_rules?: any;
}

interface ApiSection {
    title: string;
    questions: ApiQuestion[];
    view: string;
    is_disabled?: boolean;
    is_repeatable?: boolean;
    meta_data?: Record<string, any>;
    order?: number;
    created_at?: string;
}

interface ApiFormSchema {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    description: string;
    is_public: boolean;
    status: string;
    slug: string;
    editors: string[];
    submitters: string[];
    tags: string[];
    versions: {
        created_at: string;
        sections: ApiSection[];
    }[];
}

const decodeJWT = (token: string): JWTPayload | null => {
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

const mapFieldType = (apiType: string): Question["field_type"] => {
    switch (apiType) {
        case "text":
            return "input";
        case "textarea":
            return "textarea";
        case "radio":
            return "radio";
        case "select":
            return "select";
        case "checkbox":
            return "checkbox";
        default:
            return "input";
    }
};

const mapQuestion = (apiQuestion: ApiQuestion): Question => ({
    _id: apiQuestion.id,
    label: apiQuestion.text,
    field_type: mapFieldType(apiQuestion.field_type),
    is_required: apiQuestion.is_required,
    is_disabled: apiQuestion.is_disabled,
    options: apiQuestion.options?.map((opt) => ({
        _id: opt.id,
        option_value: opt.option_value,
        option_label: opt.option_label,
        is_disabled: opt.is_disabled,
        is_default: opt.is_default,
        order: opt.order,
    })),
    created_at: apiQuestion.created_at,
    default_value: apiQuestion.default_value,
    help_text: apiQuestion.help_text,
    meta_data: apiQuestion.meta_data,
    order: apiQuestion.order,
    validation_rules: apiQuestion.validation_rules,
});

const mapSection = (apiSection: ApiSection): Section => ({
    title: apiSection.title,
    questions: apiSection.questions.map(mapQuestion),
    ui:
        apiSection.view === "simple"
            ? "grid"
            : (apiSection.view as Section["ui"]),
    is_disabled: apiSection.is_disabled,
    is_repeatable: apiSection.is_repeatable,
    meta_data: apiSection.meta_data,
    order: apiSection.order,
    created_at: apiSection.created_at,
});

const mapSchema = (apiSchema: ApiFormSchema): FormSchema => ({
    id: apiSchema.id,
    title: apiSchema.title,
    created_at: apiSchema.created_at,
    updated_at: apiSchema.updated_at,
    created_by: apiSchema.created_by,
    description: apiSchema.description,
    is_public: apiSchema.is_public,
    status: apiSchema.status,
    slug: apiSchema.slug,
    editors: apiSchema.editors,
    submitters: apiSchema.submitters,
    tags: apiSchema.tags,
    versions: apiSchema.versions.map((version) => ({
        created_at: version.created_at,
        sections: version.sections.map(mapSection),
    })),
});

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

            const decodedToken = decodeJWT(accessToken);
            if (!decodedToken) {
                const errorMsg = "Invalid JWT token";
                console.error(errorMsg);
                throw new Error(errorMsg);
            }

            const formID =
                decodedToken.formID ||
                decodedToken.username ||
                decodedToken.sub;
            if (!formID) {
                const errorMsg = "No formID found in JWT token";
                console.error(errorMsg);
                throw new Error(errorMsg);
            }

            const apiUrl = `https://rpcapplication.aiims.edu/form/api/v1/form/${formID}`;

            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const apiSchema: ApiFormSchema = response.data;
                console.log("API Response:", apiSchema);

                if (
                    !apiSchema ||
                    !apiSchema.versions ||
                    !apiSchema.versions.length ||
                    !apiSchema.versions[0].sections ||
                    !apiSchema.versions[0].sections.length
                ) {
                    const errorMsg = "Invalid or empty form schema received";
                    console.error(errorMsg, apiSchema);
                    throw new Error(errorMsg);
                }

                const schema = mapSchema(apiSchema);
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
        enabled: !!accessToken,
    });
};
