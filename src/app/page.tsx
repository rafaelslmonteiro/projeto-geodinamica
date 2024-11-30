"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Book, Menu } from 'lucide-react'
import { CategorySelection } from '@/components/ui/categorySelection'
import { Quiz } from '@/components/ui/quiz'
import { Results } from '@/components/ui/results'
import { Review } from '@/components/ui/review'
import { fetchCategories, fetchQuestions } from '@/app/api'
import { Category, Question } from '@/app/types'

const geodynamicsTheme = {
  "--primary": "rgb(139, 48, 140)",
  "--primary-foreground": "rgb(255, 255, 255)",
  "--secondary": "rgb(29, 44, 64)",
  "--accent": "rgb(37, 184, 217)",
  "--warning": "rgb(242, 166, 73)",
  "--destructive": "rgb(217, 48, 48)",
  "--background": "rgb(255, 255, 255)",
  "--foreground": "rgb(29, 44, 64)"
} as const

export default function GeodynamicsPlatform() {
  const [stage, setStage] = useState("category")
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        const fetchedCategories = await fetchCategories()
        if (fetchedCategories.length === 0) {
          setError('No categories found. Please try again later.')
        } else {
          setCategories(fetchedCategories)
          setError(null)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Failed to load categories. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    loadCategories()
  }, [])

  const startQuiz = async (categoryId: string) => {
    try {
      setSelectedCategory(categoryId)
      setIsLoading(true) // Adicionado para mostrar carregamento durante a busca das perguntas
      const fetchedQuestions = await fetchQuestions(categoryId)
      if (fetchedQuestions.length === 0) {
        setError('No questions found for this category. Please try another category.')
        setStage("category")
      } else {
        console.log(fetchedQuestions)
        setQuestions(fetchedQuestions)
        setStage("quiz")
        setError(null)
      }
    } catch (err) {
      console.error('Error starting quiz:', err)
      setError('Failed to load questions. Please try again later.')
      setStage("category")
    } finally {
      setIsLoading(false) // Certifique-se de parar o carregamento após a busca
    }
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].id]: answer })
    setSelectedAnswer(answer)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers[questions[currentQuestionIndex + 1].id] || null)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[questions[currentQuestionIndex - 1].id] || null)
    }
  }

  const finishQuiz = () => {
    setStage("results")
  }

  const resetQuizState = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedAnswer(null)
    setQuestions([])
  }

  const calculateResults = () => {
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) correct++
    })
    return correct
  }

  useEffect(() => {
    const root = document.documentElement
    Object.entries(geodynamicsTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#8B308C] text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="logo-geodinamica.svg"
                alt="Logo Geodinâmica"
                width={48}
                height={48}
                className="rounded-md"
              />
              <span className="text-xl font-bold">Geodinâmica</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/learn" className="hover:underline">
                Aprender
              </Link>
              <Link href="/about" className="hover:underline">
                Sobre
              </Link>
              <Link href="/contact" className="hover:underline">
                Contato
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Bem-vindo à Geodinâmica</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : (
          <>
            {stage === "category" && <CategorySelection categories={categories} onStartQuiz={startQuiz} />}
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
                assets={questions[currentQuestionIndex].assets} // Passando os assets para o componente Quiz
              />
            )}
            {stage === "results" && (
              <Results
                correctAnswers={calculateResults()}
                totalQuestions={questions.length}
                onReviewQuiz={() => setStage("review")}
                onTryAgain={() => {
                  resetQuizState()
                  startQuiz(selectedCategory!)
                }}
                onChooseNewQuiz={() => {
                  resetQuizState()
                  setStage("category");
                }}
              />
            )}
            {stage === "review" && (
              <Review
                questions={questions}
                answers={answers}
                onBackToCategories={() => {
                  setStage("category")
                  resetQuizState()
                }}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-muted">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Book className="h-6 w-6" />
              <span className="text-sm font-semibold">© 2024 Geodinâmica. Todos os direitos reservados.</span>
            </div>
            <nav className="flex space-x-4">
              <Link href="/privacy" className="text-sm hover:underline">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="text-sm hover:underline">
                Termos de Serviço
              </Link>
              <Link href="/faq" className="text-sm hover:underline">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
