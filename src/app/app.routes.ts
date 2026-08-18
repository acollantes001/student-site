import { Routes } from '@angular/router';
import { Student } from './student/student';
import { Teacher } from './teacher/teacher';
import { ReactiveForm } from './reactive-form/reactive-form';

export const routes: Routes = [
	{ path: '', redirectTo: 'reactiveForm', pathMatch: 'full' },
	{ path: 'student', component: Student },
	{ path: 'teacher', component: Teacher },
	{ path: 'reactiveForm', component: ReactiveForm}
];
