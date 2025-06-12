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
    responseId?: string;
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

    const questionIdMap: Record<string, { id: string; sectionId: string }> = {};
    const requiredQuestions: Set<string> = new Set();
    const sectionMap: Record<string, { is_repeatable_section: boolean }> = {};

    schema.versions[0].sections.forEach((section) => {
        if (!section.id) {
            console.warn("Section missing ID:", section);
            return;
        }
        sectionMap[section.id] = {
            is_repeatable_section: section.is_repeatable_section ?? false,
        };
        section.questions.forEach((question) => {
            if (!question.id) {
                console.warn(
                    "Question missing ID in section",
                    section.id,
                    question
                );
                return;
            }
            const fieldName = getFieldName(question.label);
            if (!section.id) {
                throw new Error("Section ID is undefined");
            }
            questionIdMap[fieldName] = {
                id: question.id,
                sectionId: section.id as string,
            };
            questionIdMap[question.id] = {
                id: question.id,
                sectionId: section.id as string,
            };
            const normalizedLabel = fieldName.replace(
                /patient_|^patient/gi,
                ""
            );
            questionIdMap[normalizedLabel] = {
                id: question.id,
                sectionId: section.id as string,
            };
            if (question.is_required) {
                requiredQuestions.add(question.id);
            }
        });
    });

    const dataPayload: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
        if (
            value === undefined ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "string" && value === "")
        ) {
            return;
        }

        const match = key.match(/^(.+)_(\d+)$/);
        let fieldName = getFieldName(key);
        let index: number | null = null;

        if (match) {
            fieldName = match[1];
            index = parseInt(match[2], 10);
        }

        const questionInfo = questionIdMap[fieldName] || questionIdMap[key];
        if (!questionInfo) {
            console.warn(`No question ID found for field: ${key}`);
            return;
        }

        const { id: questionId, sectionId } = questionInfo;
        const section = sectionMap[sectionId];

        if (!section) {
            console.warn(`No section found for sectionId: ${sectionId}`);
            return;
        }

        if (!dataPayload[sectionId]) {
            dataPayload[sectionId] = section.is_repeatable_section ? [] : {};
        }

        const finalValue = fieldName.includes("age") ? Number(value) : value;

        if (section.is_repeatable_section) {
            while (dataPayload[sectionId].length <= (index ?? 0)) {
                dataPayload[sectionId].push({});
            }
            const targetIndex = index ?? 0;
            dataPayload[sectionId][targetIndex][questionId] = Array.isArray(
                finalValue
            )
                ? finalValue
                : finalValue;
        } else {
            dataPayload[sectionId][questionId] = Array.isArray(finalValue)
                ? finalValue
                : finalValue;
        }
    });

    const missingRequired: string[] = [];
    Array.from(requiredQuestions).forEach((qId) => {
        let isPresent = false;
        Object.values(dataPayload).forEach((sectionData) => {
            if (Array.isArray(sectionData)) {
                sectionData.forEach((entry) => {
                    if (
                        qId in entry &&
                        entry[qId] !== undefined &&
                        entry[qId] !== ""
                    ) {
                        isPresent = true;
                    }
                });
            } else if (
                qId in sectionData &&
                sectionData[qId] !== undefined &&
                sectionData[qId] !== ""
            ) {
                isPresent = true;
            }
        });
        if (!isPresent) missingRequired.push(qId);
    });

    if (missingRequired.length > 0) {
        console.error("Missing required fields:", missingRequired.join(", "));
        throw new Error(
            `Missing required fields: ${missingRequired.join(", ")}`
        );
    }

    console.log("Transformed Payload:", JSON.stringify(dataPayload, null, 2));
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
            console.log("Submitting transformedData:", transformedData);

            const response = await axios.post(apiUrl, transformedData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        },
        onSuccess,
        onError,
    });
}
