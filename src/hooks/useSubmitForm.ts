/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFieldName, type FormSchema, type FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_FORM_ID = import.meta.env.VITE_FORM_ID;

interface SubmitFormResponse {
    message: string;
    data?: any;
}

const transformPayload = (
    data: FormValues,
    schema: FormSchema | null
): { data: Record<string, any> } => {
    if (!schema || !schema.versions || !schema.versions[0]?.sections) {
        console.error("Invalid schema provided");
        return { data: {} };
    }

    const questionIdMap: Record<string, string> = {};
    const requiredQuestions: Set<string> = new Set();

    schema.versions[0].sections.forEach((section) => {
        section.questions.forEach((question) => {
            if (!question.id) return;
            const fieldName = getFieldName(question.label);
            questionIdMap[fieldName] = question.id;
            questionIdMap[question.id] = question.id;
            const normalizedLabel = fieldName.replace(
                /patient_|^patient/gi,
                ""
            );
            questionIdMap[normalizedLabel] = question.id;
            if (question.is_required) {
                requiredQuestions.add(question.id);
            }
        });
    });

    console.log("Question ID Map:", questionIdMap);
    console.log("Required:", Array.from(requiredQuestions));
    console.log("Input Data:", data);

    const dataPayload: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
        const normalizedKey = getFieldName(key);
        const questionId = questionIdMap[normalizedKey] || questionIdMap[key];
        if (
            questionId &&
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : value !== "")
        ) {
            const finalValue = normalizedKey.includes("age")
                ? Number(value)
                : value;
            dataPayload[questionId] = Array.isArray(finalValue)
                ? finalValue
                : finalValue;
        }
    });

    console.log("Transformed Payload:", dataPayload);

    const missingRequired = Array.from(requiredQuestions).filter(
        (qId) => !(qId in dataPayload)
    );
    if (missingRequired.length > 0) {
        console.error("Missing required fields:", missingRequired.join(", "));
        throw new Error(
            `Missing required fields: ${missingRequired.join(", ")}`
        );
    }

    return { data: dataPayload };
};

export function useSubmitForm(
    formId: string = DEFAULT_FORM_ID,
    onSuccess?: (data: SubmitFormResponse) => void,
    onError?: (error: AxiosError<any>) => void
) {
    const schema = useSelector((state: RootState) => state.formSchema.schema);

    return useMutation<SubmitFormResponse, AxiosError<any>, FormValues>({
        mutationFn: async (data: FormValues) => {
            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No access token found.");
            }

            const apiUrl = `${BASE_URL}/form/api/v1/form/${formId}/responses`;
            const transformedData = transformPayload(data, schema);

            console.log("Submitting to:", apiUrl);
            console.log("Payload:", transformedData);

            try {
                const response = await axios.post(apiUrl, transformedData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                console.error(
                    "API error:",
                    error,
                    (error as AxiosError).response?.data
                );
                throw error;
            }
        },
        onSuccess,
        onError,
    });
}
