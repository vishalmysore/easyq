export interface ArticleToReadAgain {
  link: string;
  specificReason: string;
}

export interface ArticleDetails {
  testName: string;
  score: number;
  dateTaken: string;
  mainTopics: string;
  url: string;
}

export interface UserPerformanceData {
  topSkills: string[];
  bottomSkills: string[];
  overallScore: number;
  improvements: string[];
  articlesToReadAgain: ArticleToReadAgain[];
  textSummary: string;
  userId: string;
  emailId: string;
  avatar: string;
  verified: boolean;
  articles: ArticleDetails[];
}
