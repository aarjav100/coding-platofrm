import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface ExecutionResult {
    output: string;
    error: string | null;
    executionTime: string;
    isError: boolean;
}

export const executeCode = async (language: string, code: string, input?: string): Promise<ExecutionResult> => {
    try {
        const response = await axios.post(`${API_URL}/execute`, {
            language,
            code,
            input
        });

        return {
            output: response.data.output,
            error: response.data.error,
            executionTime: response.data.executionTime,
            isError: !!response.data.error
        };
    } catch (error: any) {
        return {
            output: '',
            error: error.response?.data?.message || error.message || 'Execution failed',
            executionTime: '0.00',
            isError: true
        };
    }
};
