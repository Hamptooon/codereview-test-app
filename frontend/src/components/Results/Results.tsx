import React from "react";
import * as eslint from "eslint-linter-browserify";
import * as styles from "./Results.module.scss";
import { TestResults } from "@/types";
import { AiResponseDisplay } from "../AiResponseDisplay";
import { LintResultsDisplay } from "../LintResultsDisplay";
import { TestResultsDisplay } from "../TestResultsDisplay";

interface ResultsProps {
    aiResponse: string;
    lintMessages: eslint.Linter.LintMessage[];
    testResults: TestResults | null;
}

export const Results: React.FC<ResultsProps> = ({
    aiResponse,
    lintMessages,
    testResults,
}) => {
    return (
        <div className={styles.results}>
            <h2>Результаты AI ревью:</h2>
            <AiResponseDisplay aiResponse={aiResponse} />

            <h3>Статический анализ AI кода (ESLint):</h3>
            <LintResultsDisplay lintMessages={lintMessages} />

            <h3>Результаты дополнительных тестов:</h3>
            <TestResultsDisplay testResults={testResults} />
        </div>
    );
};
