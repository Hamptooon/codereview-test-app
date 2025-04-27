import React from "react";
import * as styles from "./TestResultsDisplay.module.scss";
import { TestResults } from "@/types";

interface TestResultsDisplayProps {
    testResults: TestResults | null;
}

export const TestResultsDisplay: React.FC<TestResultsDisplayProps> = ({
    testResults,
}) => {
    if (!testResults) return null;

    return (
        <div className={styles.testResults}>
            <p className={styles.testSummary}>
                Пройдено тестов:{" "}
                <strong>
                    {testResults.passedCount}/{testResults.totalCount}
                </strong>
            </p>
            {testResults.details.map((test, index) => (
                <div
                    key={index}
                    className={`${styles.testDetail} ${
                        test.passed ? styles.testPassed : styles.testFailed
                    }`}
                >
                    <p>
                        <strong>{test.name}:</strong>
                        {test.passed ? (
                            <span className={styles.passIcon}> ✓</span>
                        ) : (
                            <span className={styles.failIcon}>
                                {" "}
                                ✗ {test.error}
                            </span>
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
};
