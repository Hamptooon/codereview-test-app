import { TestResults } from "@/types";

export const runTests = (code: string): TestResults => {
    const tests = [
        {
            name: "Проверка синтаксиса",
            run: () => {
                try {
                    const openBraces = (code.match(/\{/g) || []).length;
                    const closeBraces = (code.match(/\}/g) || []).length;
                    const openParens = (code.match(/\(/g) || []).length;
                    const closeParens = (code.match(/\)/g) || []).length;
                    const openBrackets = (code.match(/\[/g) || []).length;
                    const closeBrackets = (code.match(/\]/g) || []).length;

                    if (
                        openBraces !== closeBraces ||
                        openParens !== closeParens ||
                        openBrackets !== closeBrackets
                    ) {
                        throw new Error("Несбалансированные скобки");
                    }
                    return true;
                } catch (error) {
                    throw error;
                }
            },
        },
        {
            name: "Проверка наличия в коде мест для потенциальных утечек памяти",
            run: () => {
                if (
                    code.includes("addEventListener") &&
                    !code.includes("removeEventListener")
                ) {
                    throw new Error(
                        "Возможная утечка памяти: добавление слушателя события без удаления"
                    );
                }
                return true;
            },
        },
        {
            name: "Проверка обработки ошибок",
            run: () => {
                if (
                    code.includes("throw") &&
                    !code.includes("try") &&
                    !code.includes("catch")
                ) {
                    throw new Error(
                        "Исключения выбрасываются, но не обрабатываются"
                    );
                }
                return true;
            },
        },
        {
            name: "Проверка использования устаревшего API",
            run: () => {
                const deprecatedApis = [
                    "document.write",
                    "onmouseover",
                    "onmouseenter",
                    "onmouseleave",
                    "onload",
                    "eval(",
                    "String.prototype.substr",
                ];

                for (const api of deprecatedApis) {
                    if (code.includes(api)) {
                        throw new Error(`Используется устаревший API: ${api}`);
                    }
                }
                return true;
            },
        },
    ];

    if (
        code.includes("React") ||
        code.includes("react") ||
        code.includes("useState") ||
        code.includes("<div>")
    ) {
        tests.push(
            {
                name: "Проверка правильного использования хуков React",
                run: () => {
                    if (
                        code.includes("useState") ||
                        code.includes("useEffect") ||
                        code.includes("useContext")
                    ) {
                        if (code.match(/if\s*\(.*\)\s*{[^}]*use[A-Z]/)) {
                            throw new Error(
                                "Хуки React не должны использоваться внутри условных выражений"
                            );
                        }
                        if (code.match(/for\s*\(.*\)\s*{[^}]*use[A-Z]/)) {
                            throw new Error(
                                "Хуки React не должны использоваться внутри циклов"
                            );
                        }
                    }
                    return true;
                },
            },
            {
                name: "Проверка управляемых компонентов React",
                run: () => {
                    if (
                        code.includes("input") &&
                        code.includes("value=") &&
                        !code.includes("onChange=")
                    ) {
                        throw new Error(
                            "Обнаружен неуправляемый input: отсутствует обработчик onChange"
                        );
                    }
                    return true;
                },
            }
        );
    }

    const testResults: TestResults = {
        passed: true,
        passedCount: 0,
        totalCount: tests.length,
        details: [],
    };

    for (const test of tests) {
        try {
            const result = test.run();
            testResults.details.push({
                name: test.name,
                passed: result,
                error: null,
            });
            testResults.passedCount++;
        } catch (error) {
            testResults.passed = false;
            testResults.details.push({
                name: test.name,
                passed: false,
                error: error.message,
            });
        }
    }

    return testResults;
};
