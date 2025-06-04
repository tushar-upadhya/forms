import type { FormSchema, FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_FORM_ID = import.meta.env.VITE_FORM_ID;

interface SubmitFormResponse {
    message: string;
    data?: Record<string, string | string[] | null>;
}

const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

const transformPayload = (
    data: FormValues,
    schema: FormSchema | null
): { data: Record<string, string | string[] | null> } => {
    if (!schema || !schema.versions || !schema.versions[0]?.sections) {
        return { data: {} };
    }

    const questionIdMap: Record<string, string> = {};
    const requiredQuestions: Set<string> = new Set();

    schema.versions[0].sections.forEach((section) => {
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            if (question.id) {
                questionIdMap[fieldName] = question.id;
            }
            if (question.is_required && question.id) {
                requiredQuestions.add(question.id);
            }
        });
    });

    const dataPayload: Record<string, string | string[] | null> = {};
    Object.entries(data).forEach(([key, value]) => {
        const normalizedKey = key.toLowerCase();
        const questionId = questionIdMap[normalizedKey];
        if (
            questionId &&
            value !== undefined &&
            value !== null &&
            (Array.isArray(value) ? value.length > 0 : value !== "")
        ) {
            dataPayload[questionId] = Array.isArray(value)
                ? value
                : String(value);
        }
    });

    const missingRequired = Array.from(requiredQuestions).filter(
        (qId) => !(qId in dataPayload)
    );
    if (missingRequired.length > 0) {
        throw new Error(
            `Missing required fields: ${missingRequired.join(", ")}`
        );
    }

    return { data: dataPayload };
};

export function useSubmitForm(
    formId: string = DEFAULT_FORM_ID,
    onSuccess?: (data: SubmitFormResponse) => void,
    onError?: (
        error: AxiosError<{
            message?: string;
            details?: { id: string; error: string }[];
        }>
    ) => void
) {
    const schema = useSelector((state: RootState) => state.formSchema.schema);

    return useMutation<
        SubmitFormResponse,
        AxiosError<{
            message?: string;
            details?: { id: string; error: string }[];
        }>,
        FormValues
    >({
        mutationFn: async (data: FormValues) => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("Access token not found in sessionStorage.");
            }

            const apiUrl = `${BASE_URL}/form/${formId}/responses`;
            const transformedData = transformPayload(data, schema);

            try {
                const response = await axios.post(apiUrl, transformedData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                throw error as AxiosError;
            }
        },
        onSuccess,
        onError,
    });
}
