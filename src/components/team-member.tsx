import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamMemberProps {
  name: string
  image: string
  education: string
  occupation: string
  research: string
  bio: string
  lattes: string
}

export function TeamMember({ name, image, education, occupation, research, bio, lattes }: TeamMemberProps) {
  return (
    <Card className="mb-12 overflow-hidden">
      <CardHeader className="bg-sky-600 text-white p-6">
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Image
              src={image}
              alt={`Foto de ${name}`}
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-auto shadow-md"
            />
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <p><strong className="text-sky-600">Formação:</strong> {education}</p>
            <p><strong className="text-sky-600">Ocupação:</strong> {occupation}</p>
            <p><strong className="text-sky-600">Áreas de Pesquisa:</strong> {research}</p>
            <p className="text-gray-700">{bio}</p>
            <Button asChild className="mt-4 bg-sky-600 hover:bg-sky-700">
              <a href={lattes} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                Ver Currículo Lattes
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

