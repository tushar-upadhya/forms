import type { FormSchema } from "@/lib/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FormSchemaState {
    schema: FormSchema | null;
    error: string | null;
}

const initialState: FormSchemaState = {
    schema: null,
    error: null,
};

const formSchemaSlice = createSlice({
    name: "formSchema",
    initialState,
    reducers: {
        setFormSchema: (state, action: PayloadAction<FormSchema>) => {
            state.schema = action.payload;
            state.error = null;
        },
        setFormSchemaError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.schema = null;
        },
    },
});

export const { setFormSchema, setFormSchemaError } = formSchemaSlice.actions;
export default formSchemaSlice.reducer;
