# Guia de Design e Padrões do Blog — Plenus Obras

Referência obrigatória para criar ou editar qualquer página do blog.

---

## Estrutura obrigatória de toda página do blog

Toda página (listagem e artigo individual) **deve** conter, nesta ordem:

```
<Header />          ← Navegação global (fixo, com link "Blog")
<main>              ← Corpo do conteúdo
  ...
</main>
<Footer />          ← Rodapé global
<ChatBot />         ← Chatbot flutuante (dynamic import)
```

### Import do ChatBot

Sempre usar dynamic import para evitar carregamento desnecessário:

```tsx
import dynamic from "next/dynamic";
const ChatBot = dynamic(() => import("@/components/ChatBot"));
```

---

## Página de Listagem (`/blog`)

### Layout

- **Breadcrumb**: "Voltar para Home" com seta ← link para `/`
- **Subtítulo**: Label uppercase tracking-wide (`Artigos & Novidades`)
- **Título**: Playfair Display, `text-4xl md:text-6xl`
- **Descrição**: Inter, `text-lg text-[#525252]`
- **Grid de cards**: `grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`

### Card do artigo

```
┌─────────────────────────┐
│  Imagem (aspect 16/9)   │  ← hover: scale-105
├─────────────────────────┤
│  [Categoria]            │  ← badge vermelho (#c41e3a/10)
│  Título do Artigo       │  ← Playfair, hover: text-[#c41e3a]
│  Resumo do artigo em    │  ← Inter, text-[#525252], line-clamp-3
│  duas ou três linhas... │
│  15 dez 2025 · 5 min    │  ← text-[#737373], dot separator
└─────────────────────────┘
```

Estilo do card:
- `bg-white rounded-2xl border border-gray-100`
- Sombra suave com hover elevado (padrão About cards)
- `hover:-translate-y-1 transition-all duration-300`

---

## Página Individual do Artigo (`/blog/[slug]`)

### Layout

- **Breadcrumb**: "Voltar ao Blog" com seta ← link para `/blog`
- **Badge de categoria**: mesmo estilo da listagem
- **Título**: Playfair Display, `text-3xl md:text-5xl`
- **Meta**: data formatada pt-BR + tempo de leitura, separados por dot
- **Imagem de capa**: `max-w-4xl`, `aspect-[16/9]`, `rounded-2xl`
- **Corpo do artigo**: `max-w-3xl` centrado
- **Rodapé do artigo**: borda top + botões de ação

### Tipografia do conteúdo

| Elemento | Fonte           | Classe                                                     |
| -------- | --------------- | ---------------------------------------------------------- |
| `## h2`  | Playfair        | `text-2xl font-bold text-[#1a1a1a] mt-10 mb-4`            |
| `### h3` | Playfair        | `text-xl font-bold text-[#1a1a1a] mt-8 mb-3`              |
| `<p>`    | Inter (default) | `text-[#525252] leading-relaxed mb-4`                      |

### Botões obrigatórios no final de todo artigo

Todo artigo **deve** ter dois botões no final, abaixo de uma borda separadora:

1. **"Fale com a Plenus"** — CTA vermelho (`bg-[#c41e3a]`), leva para `/#contato`
2. **"Voltar ao Blog"** — Botão escuro (`bg-[#1a1a1a]`), leva para `/blog`

```tsx
<div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start gap-4">
  <Link href="/#contato" className="... bg-[#c41e3a] ...">
    Fale com a Plenus
  </Link>
  <Link href="/blog" className="... bg-[#1a1a1a] ...">
    ← Voltar ao Blog
  </Link>
</div>
```

---

## Cores

| Uso               | Cor         | Variável CSS         |
| ----------------- | ----------- | -------------------- |
| Primary / CTA     | `#c41e3a`   | `--plenus-red`       |
| Primary hover     | `#a01830`   | `--plenus-red-dark`  |
| Títulos           | `#1a1a1a`   |                      |
| Texto corpo       | `#525252`   | `--plenus-gray-600`  |
| Texto secundário  | `#737373`   | `--plenus-gray-500`  |
| Fundo claro       | `#fafafa`   | `--plenus-gray-50`   |
| Bordas            | `gray-100`  |                      |
| Badge bg          | `#c41e3a/10`|                      |

## Fontes

- **Títulos e headings**: `font-[var(--font-playfair)]` (Playfair Display)
- **Corpo e UI**: Inter (font padrão, sem classe extra)

## Animações

Usar Framer Motion com o padrão do site:

```tsx
// Entrada simples
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}

// Stagger em listas (cards)
transition={{ duration: 0.5, delay: index * 0.1 }}
```

## Containers

- **Seções gerais**: `max-w-7xl mx-auto px-6 lg:px-8`
- **Conteúdo de leitura**: `max-w-3xl mx-auto px-6 lg:px-8`
- **Imagem destaque**: `max-w-4xl mx-auto px-6 lg:px-8`
- **Padding de seção**: `py-16 lg:py-24`
- **Header top**: `pt-32 pb-16` (compensa header fixo)

---

## Dados dos artigos

Os artigos ficam em `src/lib/blog.ts`, hardcoded no array `blogPosts`.

Cada artigo segue o tipo `BlogPost`:

```ts
interface BlogPost {
  slug: string;       // URL-friendly, ex: "como-escolher-terreno"
  title: string;      // Título completo
  excerpt: string;    // Resumo para o card (1-2 frases)
  coverImage: string; // Caminho em /public/images/blog/
  date: string;       // Formato ISO: "2025-12-15"
  readTime: string;   // Ex: "5 min de leitura"
  category: string;   // Ex: "Dicas", "Construção", "Arquitetura"
  content: string;    // Markdown simples (## h2, ### h3, parágrafos)
}
```

### Para adicionar um novo artigo

1. Adicionar imagem em `public/images/blog/`
2. Adicionar objeto no array `blogPosts` em `src/lib/blog.ts`
3. A rota `/blog/[slug]` é gerada automaticamente via `generateStaticParams`

---

## SEO

- **Listagem**: metadata estática em `blog/page.tsx`
- **Artigo**: metadata dinâmica via `generateMetadata()` em `blog/[slug]/page.tsx`
- Sempre incluir `openGraph` com title, description e type
- Artigos usam `type: "article"` com `publishedTime`

---

## Checklist para novo artigo/página do blog

- [ ] Header global presente
- [ ] Footer global presente
- [ ] ChatBot presente (dynamic import)
- [ ] Botão "Fale com a Plenus" no final do artigo (link para `/#contato`)
- [ ] Botão "Voltar ao Blog" no final do artigo
- [ ] Breadcrumb funcional
- [ ] Metadata SEO configurada
- [ ] Animações Framer Motion aplicadas
- [ ] Responsivo (mobile, tablet, desktop)
