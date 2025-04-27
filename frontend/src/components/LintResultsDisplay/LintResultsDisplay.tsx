import React from "react";
import * as eslint from "eslint-linter-browserify";
import * as styles from "./LintResultsDisplay.module.scss";

interface LintResultsDisplayProps {
    lintMessages: eslint.Linter.LintMessage[];
}

export const LintResultsDisplay: React.FC<LintResultsDisplayProps> = ({
    lintMessages,
}) => {
    return (
        <div className={styles.lintResultsContainer}>
            {lintMessages.length > 0 ? (
                lintMessages.map((message, index) => (
                    <div key={index} className={styles.message}>
                        <p>
                            <strong>Ошибка:</strong> {message.message}
                        </p>
                        <p>
                            <strong>Правило:</strong> {message.ruleId}
                        </p>
                        <p>
                            <strong>Строка:</strong> {message.line},{" "}
                            <strong>Колонка:</strong> {message.column}
                        </p>
                    </div>
                ))
            ) : (
                <p className={styles.successMessage}>Нет ошибок стиля кода</p>
            )}
        </div>
    );
};
