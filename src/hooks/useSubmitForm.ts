/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormSchema, FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

interface SubmitFormResponse {
    message: string;
    responseId?: string;
}

const getFieldName = (label: string) =>
    label.toLowerCase().replace(/\s+/g, "_");

const transformPayload = (
    data: FormValues,
    schema: FormSchema | null
): { responses: Array<{ question_id: string; value: any }> } => {
    if (!schema || !schema.versions || !schema.versions[0]?.sections) {
        console.error(
            "Schema is invalid or missing for payload transformation"
        );
        return { responses: [] };
    }

    const questionIdMap: Record<string, string> = {};
    const requiredQuestions: Set<string> = new Set();
    schema.versions[0].sections.forEach((section) => {
        section.questions.forEach((question) => {
            const fieldName = getFieldName(question.label);
            if (question._id) {
                questionIdMap[fieldName] = question._id;
            }
            //  else {
            //     console.warn(`Question "${question.label}" is missing _id`);
            // }
            if (question.is_required && question._id) {
                requiredQuestions.add(question._id);
            }
        });
    });

    const responses = Object.entries(data)
        .filter(
            ([, value]) =>
                value !== undefined &&
                (Array.isArray(value) ? value.length > 0 : value !== "")
        )
        .map(([key, value]) => {
            const questionId = questionIdMap[key] || key;
            if (!questionIdMap[key]) {
                // console.warn(`No question_id found for field "${key}"`);
            }
            return {
                question_id: questionId,
                value: Array.isArray(value) ? value : value || null,
            };
        });

    // Check for missing required fields
    const missingRequired = Array.from(requiredQuestions).filter(
        (qId) => !responses.some((r) => r.question_id === qId)
    );
    if (missingRequired.length > 0) {
        // console.(
        //     "Missing required fields with question IDs:",
        //     missingRequired
        // );
    }

    console.log("responses:", responses);
    return { responses };
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
                const errorMsg = axiosError.response
                    ? `Submission Error: ${axiosError.response.status} - ${
                          axiosError.response.data?.message ||
                          "Request failed with status code " +
                              axiosError.response.status
                      }${
                          axiosError.response.data?.details
                              ? " Details: " +
                                JSON.stringify(axiosError.response.data.details)
                              : ""
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
