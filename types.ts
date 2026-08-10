type InputValidator = (input: string) => boolean;

type ValidationResult = {
    isValid: boolean;
    errorMessage?: string;
};

const validateInput: InputValidator = (input) => {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
        return false;
    }
    const validPattern = /^[a-zA-Z0-9_]+$/;
    return validPattern.test(trimmedInput);
};

const processInputs = (inputs: string[]) => {
    const results: ValidationResult[] = inputs.map(input => {
        if (!validateInput(input)) {
            return { isValid: false, errorMessage: 'Invalid input: ' + input };
        }
        return { isValid: true };
    });
    return results;
};

export { InputValidator, ValidationResult, validateInput, processInputs };