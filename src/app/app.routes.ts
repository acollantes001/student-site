import { Routes } from '@angular/router';
import { Student } from './student/student';

export const routes: Routes = [
	{ path: '', redirectTo: 'student', pathMatch: 'full' },
	{ path: 'student', component: Student }
];
