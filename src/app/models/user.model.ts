export interface User {
  userId: string;
  emailId: string | null;
  name: string;
  avatar: string;
  expertTopics: string[];
  achievements: string[];
  isPermanent: boolean;
}
