import { TeamMember } from '@/components/team-member'

const teamMembers = [
    {
        name: 'Izabela Dolores Cebin Bassani',
        image: '/Izabela.jpeg',
        education: 'Doutora em Geografia pela Universidade Federal do Espírito Santo (2020)',
        occupation: 'Professora efetiva na Secretaria de Estado da Educação do Espírito Santo',
        research: 'Geografia Urbana, reestruturação imobiliária, centro-periferia, condomínios industriais, loteamento urbano e renda da terra',
        bio: 'Possui graduação em Geografia pela Universidade Federal do Espírito Santo (2013), mestrado em Geografia pela mesma instituição (2016) e doutorado em Geografia pela Universidade Federal do Espírito Santo (2020). Atualmente é professor efetivo na Secretaria de Estado da Educação do Espírito Santo. Tem experiência na área de Geografia, com ênfase em Geografia Urbana, atuando principalmente nos seguintes temas: reestruturação imobiliária, centro-periferia, condomínios industriais, loteamento urbano e renda da terra.',
        lattes: 'http://lattes.cnpq.br/1234567890',
    },
    {
        name: 'Rafael Santos da Luz Monteiro',
        image: '/Rafa.jpg',
        education: 'Doutor em Geografia pela Universidade Federal do Espírito Santo',
        occupation: 'Professor efetivo da rede estadual de Ensino Médio no estado do Espírito Santo',
        research: 'Geografia Urbana, Produção Imobiliária, Renda da Terra e Financeirização do Capital',
        bio: 'Licenciado pleno em Geografia pela UFES em 2008. Professor do quadro efetivo da rede estadual de Ensino Médio no estado do Espírito Santo desde agosto de 2009. Mestre em Geografia pelo PPGG/UFES. Doutor em Geografia na área de Produção Imobiliária pelo PPGG/UFES. Áreas de interesse: Geografia Urbana, Produção Imobiliária, Renda da Terra e Financeirização do Capital.',
        lattes: 'http://lattes.cnpq.br/0987654321',
    },
    {
        name: 'Ana Carolina Cebin Pereira',
        image: '/Ana.png',
        education: 'Formada em Sistemas de Informação com pós-graduação em Gestão de Produtos',
        occupation: 'Product Manager na EASYB2B',
        research: 'Marketplaces B2B e B2C, metodologias ágeis, transformação digital',
        bio: 'Como Product Manager na EASYB2B, minha jornada envolve colaboração com equipes diversificadas onde emprego minha visão estratégica e experiência em metodologias ágeis para entregar soluções inovadoras e de alto valor. Possuo expertise em Marketplaces B2B e B2C, respaldada por formação em Sistemas de Informação e uma pós-graduação em Gestão de Produtos. Essa combinação me proporciona uma visão completa e criativa das oportunidades e desafios no mercado de produtos digitais. Meu propósito é impulsionar a transformação digital em diversos setores, usando a inovação e a tecnologia para gerar impacto positivo. Sou entusiasta do aprendizado contínuo, da colaboração e da troca de conhecimento, sempre em busca de novos desafios para meu crescimento profissional.',
        lattes: 'https://www.linkedin.com/in/ana-carolina-cebin-pereira-223883169/',
    },
]

export default function About() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8 text-primary">Sobre o Projeto</h1>
            <p className="mb-12 text-lg leading-relaxed">
                A geodinâmica aparece como uma abordagem essencial para o desenvolvimento de habilidades e competências requeridas em avaliações externas, especialmente no contexto educacional atual, que valoriza a integração de tecnologias e metodologias ativas. Essas práticas pedagógicas, ao aliarem conteúdos complexos com o uso de ferramentas tecnológicas, promovem um aprendizado mais dinâmico e contextualizado, estimulando a autonomia e o pensamento crítico dos estudantes.
            </p>
            <h2 className="text-3xl font-bold mb-6 text-primary">Responsáveis pelo Projeto</h2>
            {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
            ))}
        </div>
    )
}