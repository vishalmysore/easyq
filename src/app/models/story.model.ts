import { Question } from './question.model';

export interface Story {
  storyId: string;
  storyText: string;
  storyType: string;
  userId: string;
  title: string;
  questions: Question[]; // Add a list of questions to the story
}
