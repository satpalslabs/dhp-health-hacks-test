import { cn } from "@/lib/utils";
import { Quiz as QuizType } from "@/types";
import React from "react";

const Quiz = ({
  quiz,
  className = "",
}: {
  quiz: QuizType;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `bg-background p-6 flex flex-col gap-6 font-inter w-[372px] rounded-xl ${className}`
      )}
      style={{
        boxShadow: "var(--mobile-card-shadow)",
      }}
    >
      <div className="flex flex-col">
        <p className="font-medium text-center leading-6">{quiz.question}</p>

        {quiz.type == "multi-select" && (
          <p className="font-medium text-center leading-6">
            {"(You can select more than one answer)"}
          </p>
        )}
      </div>
      <>{renderAnswers(quiz)}</>
    </div>
  );
};

export default Quiz;

const renderAnswers = (quiz: QuizType) => {
  const questionTypeMap = {
    "multi-select": <Answers quiz={quiz} />,
    "single-select": <Answers quiz={quiz} />,
    pair: <Pairs quiz={quiz} />,
  };
  return questionTypeMap[quiz.type];
};

// Answers for Single/multi selection Quizzes
const Answers = ({ quiz }: { quiz: QuizType }) => (
  <div className="flex flex-col gap-3 font-medium ">
    {quiz.answers.map((ans, ix) => (
      <p
        className={`text-center py-2 px-2 leading-6 rounded-full border ${
          "is_correct_answer" in ans && ans.is_correct_answer
            ? "border-primary"
            : "border-border"
        }`}
        key={ix}
      >
        {ans.answer}
      </p>
    ))}
  </div>
);

// Pairs for pair-type quiz
const Pairs = ({ quiz }: { quiz: QuizType }) => {
  const array: string[] = [];
  return (
    <div className="flex flex-col gap-3 font-medium ">
      {quiz.answers.map((ans) => {
        array.push(ans.answer);
        return (
          <div className="grid grid-cols-2 w-full gap-3" key={ans.id}>
            <p
              className={`text-center py-2 leading-6 rounded-full flex items-center justify-center px-2 border `}
            >
              {ans.answer}
            </p>
            <p
              className={`text-center py-2 leading-6 rounded-full flex items-center justify-center px-2 border `}
            >
              {"match" in ans ? ans.match : "No match available"}
            </p>
          </div>
        );
      })}
    </div>
  );
};
