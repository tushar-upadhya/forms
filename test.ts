/* eslint-disable @typescript-eslint/no-explicit-any */
type Context = Record<string, any>;

function evaluateCondition(conditionStr: string, context: Context): boolean {
    try {
        const keys = Object.keys(context);
        const values = Object.values(context);

        const fn = new Function(...keys, `return (${conditionStr});`);
        return fn(...values);
    } catch (error) {
        console.error("Error evaluating condition:", error);
        return false;
    }
}

const testCases = [
    {
        description: "Numeric comparison",
        context: JSON.parse(`{ "x": 10, "y": 20 }`),
        condition: "x < y && x + y === 30",
    },
    {
        description: "String comparison",
        context: JSON.parse(`{ "name": "Alice", "role": "admin" }`),
        condition: `name === "Alice" && role !== "user"`,
    },
    {
        description: "Boolean logic",
        context: JSON.parse(`{ "isActive": true, "isVerified": false }`),
        condition: "isActive && !isVerified",
    },
    {
        description: "Regex match with string",
        context: JSON.parse(`{ "email": "test@example.com" }`),
        condition: `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)`,
    },
    {
        description: "Complex math and boolean",
        context: JSON.parse(`{ "a": 3, "b": 4, "flag": true }`),
        condition: "(a ** 2 + b ** 2 === 25) && flag === true",
    },
    {
        description: "Regex for string prefix",
        context: JSON.parse(`{ "username": "admin123" }`),
        condition: `/^admin/.test(username)`,
    },
];

// Run test cases
testCases.forEach(({ description, context, condition }, index) => {
    const result = evaluateCondition(condition, context);
    console.log(`[${index + 1}] ${description} => ${result}`);
});
