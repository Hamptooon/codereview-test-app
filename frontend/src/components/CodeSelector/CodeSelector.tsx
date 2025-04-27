import React from "react";
import * as styles from "./CodeSelector.module.scss";
interface CodeSelectorProps {
    selectedExample: number;
    handleExampleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    codeExamples: Array<{ name: string; code: string }>;
}

export const CodeSelector: React.FC<CodeSelectorProps> = ({
    selectedExample,
    handleExampleChange,
    codeExamples,
}) => {
    return (
        <div className={styles.selectorContainer}>
            <label htmlFor="examples" className={styles.selectorLabel}>
                Выберите пример кода:
            </label>
            <select
                id="examples"
                value={selectedExample}
                onChange={handleExampleChange}
                className={styles.selector}
            >
                {codeExamples.map((example, index) => (
                    <option key={index} value={index}>
                        {example.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
