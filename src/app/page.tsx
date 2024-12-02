"use client";

import { useState, useEffect } from "react";
import { CategorySelection } from "@/components/ui/categorySelection";
import { Quiz } from "@/components/ui/quiz";
import { Results } from "@/components/ui/results";
import { Review } from "@/components/ui/review";
import { fetchCategories, fetchQuestions } from "@/app/api";
import { Category, Question } from "@/app/types";

const geodynamicsTheme = {
  "--primary": "rgb(139, 48, 140)",
  "--primary-foreground": "rgb(255, 255, 255)",
  "--secondary": "rgb(29, 44, 64)",
  "--accent": "rgb(37, 184, 217)",
  "--warning": "rgb(242, 166, 73)",
  "--destructive": "rgb(217, 48, 48)",
  "--background": "rgb(255, 255, 255)",
  "--foreground": "rgb(29, 44, 64)",
} as const;

export default function GeodynamicsPlatform() {
  const [stage, setStage] = useState("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await fetchCategories();
        if (fetchedCategories.length === 0) {
          setError("No categories found. Please try again later.");
        } else {
          setCategories(fetchedCategories);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const startQuiz = async (categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
      setIsLoading(true);
      const fetchedQuestions = await fetchQuestions(categoryId);
      if (fetchedQuestions.length === 0) {
        setError(
          "No questions found for this category. Please try another category."
        );
        setStage("category");
      } else {
        setQuestions(fetchedQuestions);
        setStage("quiz");
        setError(null);
      }
    } catch (err) {
      console.error("Error starting quiz:", err);
      setError("Failed to load questions. Please try again later.");
      setStage("category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: answer });
    setSelectedAnswer(answer);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(
        answers[questions[currentQuestionIndex + 1]?.id] || null
      );
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(
        answers[questions[currentQuestionIndex - 1]?.id] || null
      );
    }
  };

  const finishQuiz = () => {
    setStage("results");
  };

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedAnswer(null);
    setQuestions([]);
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    return correct;
  };

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(geodynamicsTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">
        Bem-vindo à Geodinâmica
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {isLoading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <>
          {stage === "category" && (
            <CategorySelection
              categories={categories}
              onStartQuiz={startQuiz}
            />
          )}
          {stage === "quiz" && questions[currentQuestionIndex] && (
            <Quiz
              question={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onAnswer={handleAnswer}
              onPrevious={goToPreviousQuestion}
              onNext={goToNextQuestion}
              onFinish={finishQuiz}
              assets={questions[currentQuestionIndex]?.assets}
            />
          )}
          {stage === "results" && (
            <Results
              correctAnswers={calculateResults()}
              totalQuestions={questions.length}
              onReviewQuiz={() => setStage("review")}
              onTryAgain={() => {
                resetQuizState();
                startQuiz(selectedCategory!);
              }}
              onChooseNewQuiz={() => {
                resetQuizState();
                setStage("category");
              }}
            />
          )}
          {stage === "review" && (
            <Review
              questions={questions}
              answers={answers}
              onBackToCategories={() => {
                setStage("category");
                resetQuizState();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
