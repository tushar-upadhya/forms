import type { FormSchema } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FormSchemaState {
    schema: FormSchema | null;
    submissionStatus: {
        status: "idle" | "success" | "error";
        responseId?: string;
        message?: string;
    };
}

const initialState: FormSchemaState = {
    schema: null,
    submissionStatus: { status: "idle" },
};

const formSchemaSlice = createSlice({
    name: "formSchema",
    initialState,
    reducers: {
        setFormSchema(state, action: PayloadAction<FormSchema>) {
            state.schema = action.payload;
        },
        setFormSubmissionStatus(
            state,
            action: PayloadAction<{
                status: "success" | "error";
                responseId?: string;
                message?: string;
            }>
        ) {
            state.submissionStatus = action.payload;
        },
    },
});

export const { setFormSchema, setFormSubmissionStatus } =
    formSchemaSlice.actions;
export default formSchemaSlice.reducer;
