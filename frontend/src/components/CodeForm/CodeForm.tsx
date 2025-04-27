import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import * as styles from "./CodeForm.module.scss";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { CodeSelector } from "../CodeSelector";

interface CodeFormProps {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    selectedExample: number;
    handleExampleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isLoading: boolean;
    codeExamples: Array<{ name: string; code: string }>;
}

export const CodeForm: React.FC<CodeFormProps> = ({
    code,
    setCode,
    selectedExample,
    handleExampleChange,
    handleSubmit,
    isLoading,
    codeExamples,
}) => {
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <CodeSelector
                selectedExample={selectedExample}
                handleExampleChange={handleExampleChange}
                codeExamples={codeExamples}
            />

            <CodeMirror
                value={code}
                options={{
                    mode: "javascript",
                    theme: "material",
                    lineNumbers: true,
                    indentUnit: 2,
                    tabSize: 2,
                }}
                onBeforeChange={(_editor, _data, value) => {
                    setCode(value);
                }}
                className={styles.editor}
            />

            <button
                type="submit"
                className={styles.button}
                disabled={isLoading}
            >
                {isLoading ? "Обработка..." : "Отправить"}
            </button>
        </form>
    );
};
