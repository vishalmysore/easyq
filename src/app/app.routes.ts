import { Routes } from '@angular/router';
import {QuizResultsComponent} from './quiz-results/quiz-results.component';
import { UsergenComponent } from './usergen/usergen.component';
import { UserDetailsComponent } from './user-details/user-details-component';

export const routes: Routes = [
  { path: 'quiz-results', component: QuizResultsComponent },
  { path: 'user-gen', component: UsergenComponent },
  { path: 'user-details', component: UserDetailsComponent }
];


