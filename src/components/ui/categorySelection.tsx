// Importações necessárias
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Importação do Image
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Category } from '@/app/types';
import confetti from 'canvas-confetti';

interface CategorySelectionProps {
  categories: Category[];
  onStartQuiz: (categoryId: string) => void;
}

export function CategorySelection({
  categories,
  onStartQuiz,
}: CategorySelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStartQuiz = () => {
    if (selectedCategory) {
      onStartQuiz(selectedCategory.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    setIsDialogOpen(false);
  };

  if (!categories || categories.length === 0) {
    return <p className="text-center">Carregando categorias...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                {category.name}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedCategory(category)}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Iniciar Quiz
                  </Button>
                </DialogTrigger>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
                <AnimatePresence>
                  {isDialogOpen && (
                    <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-md dark:bg-gray-800/80">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-primary">
                            Pronto para a aventura?
                          </DialogTitle>
                          <DialogDescription className="text-lg">
                            Você está prestes a iniciar um quiz incrível sobre{' '}
                            <span className="font-bold text-accent">
                              {selectedCategory?.name}
                            </span>
                            !
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 flex flex-col items-center">
                          <Image
                            src="/geo-mascote-transparente.svg"
                            alt="Quiz Mascot"
                            width={128}
                            height={128}
                            className="w-32 h-32 mb-4 animate-bounce"
                          />
                          <p className="text-center mb-4">
                            Nosso mascote está animado para ver como você se
                            sai!
                          </p>
                          <div className="flex justify-center space-x-4 w-full">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              className="w-1/3"
                            >
                              Ainda não
                            </Button>
                            <Button
                              onClick={handleStartQuiz}
                              className="w-2/3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                            >
                              Vamos nessa!
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </DialogContent>
                  )}
                </AnimatePresence>
              </Dialog>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
