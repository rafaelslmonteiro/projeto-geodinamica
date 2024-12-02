import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Question, Asset } from "@/app/types";
import { renderRichText } from "@/lib/utils";

interface QuizProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  assets: Asset[];
}

export function Quiz({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onPrevious,
  onNext,
  onFinish,
  assets,
}: QuizProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-[#8B308C] text-white rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold">
            Questão {currentQuestionIndex + 1} de {totalQuestions}
          </CardTitle>
          <span className="text-sm">{Math.round(progress)}% completo</span>
        </div>
        <Progress
          value={progress}
          className="w-full bg-white/20"
          indicatorClassName="bg-[#F2A649]"
        />
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {renderRichText(question.body, assets)}
        </div>
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={onAnswer}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 rounded-lg border-2 p-4 transition-all duration-300 ${selectedAnswer === option.id
                  ? "border-[#25B8D9] bg-[#25B8D9]/10 shadow-md"
                  : "border-gray-200 hover:border-[#25B8D9]/50 hover:bg-[#25B8D9]/5"
                }`}
            >
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className={`border-2 ${selectedAnswer === option.id
                    ? "border-[#25B8D9] text-[#25B8D9]"
                    : "border-gray-300"
                  }`}
              />
              <Label
                htmlFor={option.id}
                className={`flex-grow cursor-pointer text-base ${selectedAnswer === option.id
                    ? "font-medium text-[#1D2C40]"
                    : "text-gray-700"
                  }`}
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between p-6 bg-gray-50 rounded-b-lg">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="border-[#8B308C] text-[#8B308C] hover:bg-[#8B308C] hover:text-white transition-colors"
        >
          Anterior
        </Button>
        <Button
          onClick={
            currentQuestionIndex === totalQuestions - 1 ? onFinish : onNext
          }
          disabled={!selectedAnswer}
          className="bg-[#25B8D9] hover:bg-[#1D2C40] text-white transition-colors"
        >
          {currentQuestionIndex === totalQuestions - 1
            ? "Finalizar"
            : "Próxima"}
        </Button>
      </CardFooter>
    </Card>
  );
}
