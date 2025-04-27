import React, { useState } from "react";
import * as eslint from "eslint-linter-browserify";
import * as styles from "./App.module.scss";
import { mockOpenAI } from "@/mocks/mockOpenAI";
import { runTests } from "@/services/testService";
import { TestResults } from "@/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CodeForm } from "@/components/CodeForm";
import { Results } from "@/components/Results";

const codeExamples = [
    {
        name: "Пример 1: Базовый JavaScript",
        code: `// Простой пример с проблемами стиля
var foo = "bar";
if (foo === "bar") {
  console.log(foo);
}
function doSomething() {
  var x = 10;
  return x * 2;
}
doSomething();`,
    },
    {
        name: "Пример 2: Ошибки ESLint",
        code: `// C ошибками в ESLint
var foo = 42
var Bar = "Hello World";
let unusedVar;

function test( ) 
{
console.log(foo)
console.log(Bar);
console.log(unusedVar);;
}

if(foo == '42') {
console.log('Loose equality!');
}

const obj = {name:"ChatGPT",age:5,};

function doSomething() {
  return 
  {
    success: true
  };
}

switch(foo) {
  case 1:
    console.log('One');
    break;
  case 2:
    console.log('Two');
    break;
}

test( );
`,
    },
];

const App: React.FC = () => {
    const linter = new eslint.Linter();
    const [code, setCode] = useState<string>(codeExamples[0].code);
    const [aiResponse, setAiResponse] = useState<string>("");
    const [lintMessages, setLintMessages] = useState<
        eslint.Linter.LintMessage[]
    >([]);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedExample, setSelectedExample] = useState<number>(0);

    const handleExampleChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const index = parseInt(event.target.value);
        setSelectedExample(index);
        setCode(codeExamples[index].code);
        setAiResponse("");
        setLintMessages([]);
        setTestResults(null);
    };

    const extractCodeFromAiResponse = (response: string): string => {
        const codeMatch = response.match(
            /```(?:javascript|js)?\s*([\s\S]*?)\s*```/
        );
        return codeMatch ? codeMatch[1] : response;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const aiResult = await mockOpenAI.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a code review assistant.",
                    },
                    { role: "user", content: code },
                ],
            });

            const reviewedCode = aiResult.choices[0].message.content;
            setAiResponse(reviewedCode);

            const extractedCode = extractCodeFromAiResponse(reviewedCode);

            const messages = linter.verify(extractedCode, {
                rules: {
                    semi: ["error", "always"],
                    quotes: ["error", "double"],
                    "no-unused-vars": ["error"],
                    eqeqeq: ["error", "always"],
                    "no-extra-semi": ["error"],
                    "no-var": ["error"],
                    "prefer-const": ["error"],
                    indent: ["error", 2],
                    "brace-style": ["error", "1tbs"],
                    "space-before-function-paren": ["error", "never"],
                    "keyword-spacing": ["error", { before: true, after: true }],
                    "no-unreachable": ["error"],
                    "default-case": ["error"],
                },
            });
            setLintMessages(messages);

            const testResults = runTests(extractedCode);
            setTestResults(testResults);
        } catch (error) {
            console.error("Error:", error);
            setAiResponse(
                "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.app}>
            <Header />

            <main className={styles.main}>
                <CodeForm
                    code={code}
                    setCode={setCode}
                    selectedExample={selectedExample}
                    handleExampleChange={handleExampleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    codeExamples={codeExamples}
                />

                {isLoading && (
                    <div className={styles.spinnerContainer}>
                        <div className={styles.spinner}></div>
                    </div>
                )}

                {aiResponse && !isLoading && (
                    <Results
                        aiResponse={aiResponse}
                        lintMessages={lintMessages}
                        testResults={testResults}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default App;
