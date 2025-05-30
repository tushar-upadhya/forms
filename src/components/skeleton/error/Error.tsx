interface ErrorProps {
    message: string;
}

export default function Error({ message }: ErrorProps) {
    return (
        <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 text-red-500 text-xs sm:text-sm md:text-base">
            Failed to load form schema: {message}
        </div>
    );
}
