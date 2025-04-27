export interface TestResult {
    name: string;
    passed: boolean;
    error: string | null;
}

export interface TestResults {
    passed: boolean;
    passedCount: number;
    totalCount: number;
    details: TestResult[];
}
