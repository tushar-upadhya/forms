import type { FormSchema, FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

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
        console.error("Invalid schema: Schema is missing or has no sections.");
        return { data: {} };
    }

    // Map field names to question IDs from schema
    const questionIdMap: Record<string, string> = {};
    const requiredQuestions: Set<string> = new Set();
    const labelToIdMap: Record<string, string> = {}; // For debugging

    schema.versions[0].sections.forEach((section) => {
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            if (question._id) {
                questionIdMap[fieldName] = question._id;
                labelToIdMap[question.label] = question._id; // Track label to ID mapping
            }
            if (question.is_required && question._id) {
                requiredQuestions.add(question._id);
            }
        });
    });

    console.log("Question ID Map:", questionIdMap);
    console.log("Required Question IDs:", Array.from(requiredQuestions));
    console.log("Label to ID Mapping:", labelToIdMap);

    // Build the data object with question_id as keys
    const dataPayload: Record<string, string | string[] | null> = {};

    Object.entries(data).forEach(([key, value]) => {
        const questionId = questionIdMap[key];
        if (
            questionId &&
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : value !== "")
        ) {
            dataPayload[questionId] = Array.isArray(value)
                ? value
                : value || null;
        } else if (!questionId) {
            console.warn(`No question_id found for field: ${key}`);
        }
    });

    // Check for missing required fields
    const missingRequired = Array.from(requiredQuestions).filter(
        (qId) => !(qId in dataPayload)
    );
    if (missingRequired.length > 0) {
        console.error(
            "Missing required fields with question IDs:",
            missingRequired
        );
        throw new Error(
            `Missing required fields: ${missingRequired.join(", ")}`
        );
    }

    console.log("Transformed payload:", { data: dataPayload });
    return { data: dataPayload };
};

export function useSubmitForm(
    formId: string = "dc8e18b4-b0ad-4b76-a4c5-cd340f84d494",
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
            console.log("Submitting form data:", data);
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("Access token not found in sessionStorage.");
            }

            const apiUrl = `https://rpcapplication.aiims.edu/form/api/v1/form/${formId}/responses`;

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
                const axiosError = error as AxiosError<{
                    message?: string;
                    details?: { id: string; error: string }[];
                }>;
                console.error("Full API error response:", {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data,
                    headers: axiosError.response?.headers,
                    message: axiosError.message,
                });
                throw axiosError; // Let the error propagate to the onError callback
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
