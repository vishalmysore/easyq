export interface AuthorArticle {
  title: string;
  date: string;
  source: string;  // Medium, LinkedIn, Dev.to, etc.
  quizTakers: number;
  averageScore: number;
  readiness: string;  // "Draft", "Published", "Needs Improvement"
}
