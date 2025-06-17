/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFieldName, type FormSchema, type FormValues } from "@/lib/types";
import type { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
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

    // Build question ID and section map
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

    // Group data by section
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

        // Initialize section in payload
        if (!dataPayload[sectionId]) {
            dataPayload[sectionId] = section.is_repeatable_section ? [] : {};
        }

        const finalValue = fieldName.includes("age") ? Number(value) : value;

        if (section.is_repeatable_section) {
            // Ensure array index exists
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
            // Non-repeatable section
            if (questionIdMap[fieldName]?.id && index !== null) {
                // Handle repeatable questions
                if (!dataPayload[sectionId][questionId]) {
                    dataPayload[sectionId][questionId] = [];
                }
                while (dataPayload[sectionId][questionId].length <= index) {
                    dataPayload[sectionId][questionId].push(null);
                }
                dataPayload[sectionId][questionId][index] = Array.isArray(
                    finalValue
                )
                    ? finalValue
                    : finalValue;
            } else {
                dataPayload[sectionId][questionId] = Array.isArray(finalValue)
                    ? finalValue
                    : finalValue;
            }
        }
    });

    // Validate required fields
    const missingRequired: string[] = [];
    Array.from(requiredQuestions).forEach((qId) => {
        let isPresent = false;
        Object.values(dataPayload).forEach((sectionData) => {
            if (Array.isArray(sectionData)) {
                sectionData.forEach((entry) => {
                    if (
                        qId in entry &&
                        entry[qId] !== undefined &&
                        entry[qId] !== "" &&
                        (!Array.isArray(entry[qId]) || entry[qId].length > 0)
                    ) {
                        isPresent = true;
                    }
                });
            } else if (
                qId in sectionData &&
                sectionData[qId] !== undefined &&
                sectionData[qId] !== "" &&
                (!Array.isArray(sectionData[qId]) ||
                    sectionData[qId].length > 0)
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
            // Optional: Validate token format (e.g., JWT)
            if (!accessToken.match(/^[\w-]+\.[\w-]+\.[\w-]+$/)) {
                console.warn("Invalid token format");
                throw new Error("Invalid access token format.");
            }

            const apiUrl = `/form/api/v1/form/${formId}/responses`;
            console.log("Schema:", schema); // Debug schema
            const transformedData = transformPayload(data, schema);

            if ("error" in transformedData) {
                throw new Error(transformedData.error);
            }

            console.log("Submitting transformedData:", transformedData);

            try {
                const response = await axios.post(apiUrl, transformedData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(
                        "Server error response:",
                        error.response?.data
                    );
                    throw error;
                }
                throw error;
            }
        },
        onSuccess,
        onError: (error) => {
            console.error(
                "Submission error:",
                error.response?.data || error.message
            );
            if (onError) onError(error);
        },
    });
}
