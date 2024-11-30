import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import Image from 'next/image'

interface ResultsProps {
  correctAnswers: number
  totalQuestions: number
  onReviewQuiz: () => void
  onTryAgain: () => void
  onChooseNewQuiz: () => void
}

export function Results({ 
  correctAnswers, 
  totalQuestions, 
  onReviewQuiz, 
  onTryAgain, 
  onChooseNewQuiz 
}: ResultsProps) {
  const incorrectAnswers = totalQuestions - correctAnswers
  const data = [
    { name: "Corretas", value: correctAnswers },
    { name: "Incorretas", value: incorrectAnswers },
  ]

  const COLORS = ['#4CAF50', '#F44336']

  const performancePercentage = (correctAnswers / totalQuestions) * 100
  const mascotImage = performancePercentage >= 70 ? "geo-mascote-transparente.svg" : "/geo-mascote-transparente.svg"
  const mascotAlt = performancePercentage >= 70 ? "Geo feliz" : "Geo encorajador"

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Resultados do Quiz</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center w-full">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex justify-center">
            <Image
              src={mascotImage}
              alt={mascotAlt}
              width={200}
              height={200}
              className="animate-bounce"
            />
          </div>
        </div>
        <p className="text-2xl font-bold text-center">
          Você acertou {correctAnswers} de {totalQuestions} questões!
        </p>
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <Button onClick={onReviewQuiz} className="w-full sm:w-auto">
            Revisar Quiz
          </Button>
          <Button onClick={onTryAgain} className="w-full sm:w-auto">
            Tentar Novamente
          </Button>
          <Button onClick={onChooseNewQuiz} className="w-full sm:w-auto">
            Escolher Novo Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}