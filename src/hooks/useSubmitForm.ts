/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFieldName, type FormSchema, type FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

const DEFAULT_FORM_ID = import.meta.env.VITE_FORM_ID;

interface SubmitFormResponse {
    message: string;
    data?: any;
}

const transformPayload = (
    data: FormValues,
    schema: FormSchema | null
): { data: Record<string, any> } | { error: string } => {
    if (!schema || !schema.versions || !schema.versions[0]?.sections) {
        console.error("Invalid schema provided");
        return { error: "Invalid schema provided" };
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
            questionIdMap[fieldName] = {
                id: question.id,
                sectionId: section.id,
            };
            questionIdMap[question.id] = {
                id: question.id,
                sectionId: section.id,
            };
            const normalizedLabel = fieldName.replace(
                /patient_|^patient/gi,
                ""
            );
            questionIdMap[normalizedLabel] = {
                id: question.id,
                sectionId: section.id,
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
        if (!isPresent) {
            missingRequired.push(qId);
        }
    });

    if (missingRequired.length > 0) {
        console.error("Missing required fields:", missingRequired.join(", "));
        return {
            error: `Missing required fields: ${missingRequired.join(", ")}`,
        };
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

            const apiUrl = `/form/api/v1/form/${formId}/responses`; // Use relative URL for proxy
            const transformedData = transformPayload(data, schema);

            if ("error" in transformedData) {
                throw new Error(transformedData.error);
            }

            console.log("Submitting transformedData:", transformedData);
            console.log("Access Token:", accessToken);

            try {
                const response = await axios.post(apiUrl, transformedData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                console.error("Submission error:", error);
                throw error;
            }
        },
        onSuccess,
        onError,
    });
}
