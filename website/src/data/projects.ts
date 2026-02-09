export interface Project {
  id: string;
  title: string;
  location: string;
  area: string;
  category: string;
  image: string;
  description?: string;
}

export const projects: Project[] = [
  {
    id: "residencia-moderna",
    title: "Residência Moderna",
    location: "Indaiatuba, SP",
    area: "250m²",
    category: "Casa Térrea",
    image: "/projects/project-1.webp",
    description: "Projeto contemporâneo com linhas retas e integração total entre os ambientes. A residência conta com amplas áreas de convivência, iluminação natural abundante e acabamentos de alto padrão.",
  },
  {
    id: "casa-contemporanea",
    title: "Casa Contemporânea",
    location: "Jundiaí, SP",
    area: "320m²",
    category: "Sobrado",
    image: "/projects/project-2.webp",
    description: "Sobrado elegante com design arrojado, combinando materiais nobres como madeira e vidro. Os dois pavimentos foram projetados para maximizar o conforto e a privacidade da família.",
  },
  {
    id: "projeto-personalizado",
    title: "Projeto Personalizado",
    location: "Indaiatuba, SP",
    area: "280m²",
    category: "Casa Térrea",
    image: "/projects/project-3.webp",
    description: "Residência desenvolvida sob medida para atender às necessidades específicas dos moradores. Cada ambiente foi pensado para proporcionar funcionalidade e bem-estar.",
  },
  {
    id: "residencia-premium",
    title: "Residência Premium",
    location: "Jundiaí, SP",
    area: "400m²",
    category: "Sobrado",
    image: "/projects/project-4.webp",
    description: "Imponente sobrado com acabamentos premium e arquitetura sofisticada. A residência oferece amplos espaços de lazer, suítes confortáveis e áreas gourmet completas.",
  },
  {
    id: "casa-elegante",
    title: "Casa Elegante",
    location: "Indaiatuba, SP",
    area: "220m²",
    category: "Casa Térrea",
    image: "/projects/project-5.webp",
    description: "Casa térrea com design elegante e atemporal. O projeto prioriza a conexão com áreas externas e jardins, criando um ambiente de paz e tranquilidade.",
  },
  {
    id: "projeto-exclusivo",
    title: "Projeto Exclusivo",
    location: "Jundiaí, SP",
    area: "350m²",
    category: "Sobrado",
    image: "/projects/project-6.webp",
    description: "Projeto exclusivo com arquitetura única e personalizada. Cada detalhe foi cuidadosamente planejado para criar uma residência que reflete o estilo de vida dos moradores.",
  },
];
