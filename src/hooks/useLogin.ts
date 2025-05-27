import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const LOGIN_API_URL = "https://rpcapplication.aiims.edu/form/api/v1/auth/login";

interface LoginCredentials {
    email: string;
    password: string;
}

export const useLogin = (onSuccessCallback?: () => void) => {
    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || `Login failed: ${response.status}`
                );
            }
            return response.json();
        },
        onSuccess: (data) => {
            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }
            toast.success("Login successful!", {
                position: "top-right",
                duration: 3000,
            });
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (err: Error) => {
            toast.error(`Login failed: ${err.message}`, {
                position: "top-right",
                duration: 5000,
            });
        },
    });
};
