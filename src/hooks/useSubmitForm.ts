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

interface QuestionInfo {
    id: string;
    sectionId: string;
    is_repeatable_question: boolean;
}

interface SectionInfo {
    is_repeatable_section: boolean;
}

const transformPayload = (
    data: FormValues,
    schema: FormSchema | null
): { data: Record<string, any> } | { error: string } => {
    if (!schema || !schema.versions?.[0]?.sections?.length) {
        console.error("Invalid or empty schema provided");
        return { error: "Invalid or empty schema provided" };
    }

    const questionIdMap: Record<string, QuestionInfo> = {};
    const requiredQuestions: Set<string> = new Set();
    const sectionMap: Record<string, SectionInfo> = {};

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
            const normalizedLabel = fieldName.replace(
                /patient_|^patient/gi,
                ""
            );

            const questionInfo: QuestionInfo = {
                id: question.id,
                sectionId: section.id!,
                is_repeatable_question:
                    question.is_repeatable_question ?? false,
            };

            questionIdMap[fieldName] = questionInfo;
            questionIdMap[question.id] = questionInfo;
            questionIdMap[normalizedLabel] = questionInfo;

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

        const {
            id: questionId,
            sectionId,
            is_repeatable_question,
        } = questionInfo;
        const section = sectionMap[sectionId];

        if (!section) {
            console.warn(`No section found for sectionId: ${sectionId}`);
            return;
        }

        if (!dataPayload[sectionId]) {
            dataPayload[sectionId] = section.is_repeatable_section ? [] : {};
        }

        const finalValue =
            questionId === "dc05ed5d-00a8-433c-a276-fd6e2021a20a"
                ? Array.isArray(value)
                    ? value
                    : [value]
                : fieldName.includes("age")
                ? Number(value)
                : is_repeatable_question
                ? Array.isArray(value)
                    ? value
                    : [value]
                : value;

        if (section.is_repeatable_section) {
            while (dataPayload[sectionId].length <= (index ?? 0)) {
                dataPayload[sectionId].push({});
            }
            const targetIndex = index ?? 0;
            if (!dataPayload[sectionId][targetIndex]) {
                dataPayload[sectionId][targetIndex] = {};
            }
            dataPayload[sectionId][targetIndex][questionId] = finalValue;
        } else {
            dataPayload[sectionId][questionId] = finalValue;
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
                        entry[qId] !== "" &&
                        !(Array.isArray(entry[qId]) && entry[qId].length === 0)
                    ) {
                        isPresent = true;
                    }
                });
            } else if (
                qId in sectionData &&
                sectionData[qId] !== undefined &&
                sectionData[qId] !== "" &&
                !(
                    Array.isArray(sectionData[qId]) &&
                    sectionData[qId].length === 0
                )
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
            if (!schema || !schema.versions?.[0]?.sections?.length) {
                throw new Error("Invalid or empty form schema");
            }

            const accessToken = sessionStorage.getItem("accessToken");
            if (!accessToken) {
                throw new Error("No access token found.");
            }

            const apiUrl = `/form/api/v1/form/${formId}/responses`;
            const transformedData = transformPayload(data, schema);

            if ("error" in transformedData) {
                throw new Error(transformedData.error);
            }

            console.log(
                "📤 Transformed Payload:",
                JSON.stringify(transformedData, null, 2)
            );

            if ("data" in transformedData) {
                const sectionIds = Object.keys(transformedData.data);
                console.log("✅ Section IDs in payload:", sectionIds);
                sectionIds.forEach((sec) => {
                    console.log(
                        `➡ Section ${sec} content:`,
                        transformedData.data[sec]
                    );
                });
            }

            try {
                const response = await axios.post(apiUrl, transformedData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                // console.log("✅ API response:", response.data);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // console.error(
                    //     "❌ Axios Error Response:",
                    //     error.response?.data || "No response data"
                    // );
                    // console.error("❌ Axios Status:", error.response?.status);
                    // console.error("❌ Axios Headers:", error.response?.headers);
                    throw new Error(
                        error.response?.data?.message || "Server error occurred"
                    );
                } else {
                    // console.error("❌ Unknown Submission Error:", error);
                    throw new Error("Unknown error occurred");
                }
            }
        },
        onSuccess,
        onError,
    });
}
