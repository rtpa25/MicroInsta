import { Error } from '../types/error';

export const toErrorMap = (errors: Error[]) => {
    const errorMap: Record<string, string> = {};
    errors.forEach(({ message, field }) => {
        errorMap[field || ''] = message;
    });
    return errorMap;
};
