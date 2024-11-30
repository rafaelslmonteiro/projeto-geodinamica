// components/ui/review.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/app/types';
import { renderRichText } from '@/lib/utils'; // Ajuste o caminho conforme necessário

interface ReviewProps {
  questions: Question[];
  answers: Record<string, string>;
  onBackToCategories: () => void;
}

export function Review({ questions, answers, onBackToCategories }: ReviewProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>Questão {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className="font-medium"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {renderRichText(question.body, question.assets)}
            </div>
            <p>
              Sua resposta:{' '}
              {question.options.find(opt => opt.id === answers[question.id])?.text || 'Não respondida'}
            </p>
            <p
              className={
                answers[question.id] === question.correctOptionId
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'
              }
            >
              {answers[question.id] === question.correctOptionId ? 'Correta' : 'Incorreta'}
            </p>
            <div className="mt-2">
              <strong>Explicação:</strong>
              <p>{question.explanation}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={onBackToCategories}>Voltar às Categorias</Button>
    </div>
  );
}
