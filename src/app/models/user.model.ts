import { ArticleDetails } from './user-performance-data.model';


export interface User {
  userId: string;
  emailId: string | null;
  name: string;
  avatar: string;
  expertTopics: string[];
  achievements: string[];
  isPermanent: boolean;
  articles: ArticleDetails[];
}
