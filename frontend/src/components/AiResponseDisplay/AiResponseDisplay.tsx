import React from "react";
import * as styles from "./AiResponse.module.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface AiResponseDisplayProps {
    aiResponse: string;
}

export const AiResponseDisplay: React.FC<AiResponseDisplayProps> = ({
    aiResponse,
}) => {
    const formatAiResponse = (response: string) => {
        const parts = response.split(/```(?:javascript|js)?/);

        if (parts.length >= 3) {
            return (
                <>
                    <div className={styles.aiCommentary}>{parts[0].trim()}</div>

                    <div className={styles.codeBlockContainer}>
                        <SyntaxHighlighter
                            language="javascript"
                            style={dracula}
                            className={styles.syntaxHighlighter}
                        >
                            {parts[1].trim()}
                        </SyntaxHighlighter>
                    </div>

                    {parts[2] && (
                        <div className={styles.aiCommentary}>
                            {parts[2].trim()}
                        </div>
                    )}
                </>
            );
        }

        return <div className={styles.aiCommentary}>{response}</div>;
    };

    return (
        <div className={styles.aiResponseContainer}>
            {formatAiResponse(aiResponse)}
        </div>
    );
};
