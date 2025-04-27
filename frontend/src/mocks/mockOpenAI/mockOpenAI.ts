interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

interface Completion {
    choices: { message: { role: "assistant"; content: string } }[];
}

const codeReviewResponses = [
    {
        pattern: /var\s+/,
        response: (code: string) =>
            `Ваш код можно улучшить:
  
  \`\`\`javascript
  ${code.replace(/var\s+([a-zA-Z0-9_]+)/g, "const $1")}
  \`\`\`
  
  Рекомендации:
  1. Используйте const вместо var для объявления переменных
  2. Это предотвращает случайное переопределение переменных
  3. Для изменяемых переменных используйте let`,
    },
    {
        pattern: /console\.log\(/,
        response: (code: string) =>
            `Ваш код содержит console.log, который следует убрать из продакшн кода:
  
  \`\`\`javascript
  ${code.replace(
      /console\.log\(([^)]+)\);/g,
      "// console.log($1); // Удалите для продакшена"
  )}
  \`\`\`
  
  Рекомендации:
  1. Удаляйте console.log из продакшн-кода
  2. Рассмотрите использование структурированного логирования`,
    },
    {
        pattern: /if\s*\([^)]*==(?!=)[^)]*\)/,
        response: (code: string) =>
            `В вашем коде используется нестрогое сравнение:
  
  \`\`\`javascript
  ${code.replace(/([^=!])===?([^=])/g, "$1===$2")}
  \`\`\`
  
  Рекомендации:
  1. Используйте === вместо == для избегания неожиданного приведения типов
  2. Строгое сравнение (===) предотвращает неявное приведение типов`,
    },
    {
        pattern: /function\s+([a-zA-Z0-9_]+)\s*\(\)/,
        response: (code: string) =>
            `Предлагаю использовать стрелочные функции:
  
  \`\`\`javascript
  ${code.replace(
      /function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g,
      "const $1 = ($2) =>"
  )}
  \`\`\`
  
  Рекомендации:
  1. Стрелочные функции имеют более короткий синтаксис
  2. Они не переопределяют контекст this
  3. Для простых функций стрелочные часто более читабельны`,
    },
    {
        pattern: /.*/,
        response: (code: string) =>
            `Ваш код выглядит хорошо, но есть некоторые рекомендации по стилю:
  
  \`\`\`javascript
  ${code}
  \`\`\`
  
  Рекомендации:
  1. Используйте const для переменных, которые не изменяются
  2. Используйте let для переменных, которые изменяются
  3. Избегайте использования var
  4. Добавьте больше комментариев для сложных участков кода`,
    },
];

export const mockOpenAI = {
    chat: {
        completions: {
            create: async ({
                model,
                messages,
            }: {
                model: string;
                messages: Message[];
            }): Promise<Completion> => {
                // Получаем последнее сообщение пользователя (код)
                const lastUserMessage = messages[messages.length - 1].content;

                // Проходим по шаблонам ответов и находим подходящий
                let response = "";
                for (const reviewPattern of codeReviewResponses) {
                    if (reviewPattern.pattern.test(lastUserMessage)) {
                        response = reviewPattern.response(lastUserMessage);
                        break;
                    }
                }

                // Если ни один шаблон не подошел, используем последний (универсальный)
                if (!response) {
                    response =
                        codeReviewResponses[
                            codeReviewResponses.length - 1
                        ].response(lastUserMessage);
                }

                // Имитация задержки сетевого запроса
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            choices: [
                                {
                                    message: {
                                        role: "assistant",
                                        content: response,
                                    },
                                },
                            ],
                        });
                    }, 1500);
                });
            },
        },
    },
};
