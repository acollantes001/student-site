import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

@Component({
  selector: 'app-reactive-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.scss',
})
export class ReactiveForm implements OnInit {
  userForm: FormGroup;
  users: any[] = [];
  private http = inject(HttpClient);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userId: [0],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      employed: ['', Validators.required],
      companyDetails: this.fb.group({
        companyName: [''],
        companyAddress: [''],
      }),
    });

    this.userForm.get('employed')!.valueChanges.subscribe((employed) => this.toggleCompanyValidators(employed));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http
      .get<any[]>(API_URL)
      .pipe(
        tap((response) => console.log('GET Response:', response)),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        }),
      )
      .subscribe((users) => (this.users = users));
  }

  isInvalid(path: string): boolean {
    const control = this.userForm.get(path);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  hasError(path: string, errorName: string): boolean {
    return this.isInvalid(path) && !!this.userForm.get(path)?.errors?.[errorName];
  }

  private toggleCompanyValidators(employed: string): void {
    const companyName = this.userForm.get('companyDetails.companyName');
    const companyAddress = this.userForm.get('companyDetails.companyAddress');

    if (employed === 'true') {
      companyName?.setValidators(Validators.required);
      companyAddress?.setValidators(Validators.required);
    } else {
      companyName?.clearValidators();
      companyAddress?.clearValidators();
      companyName?.setValue('');
      companyAddress?.setValue('');
    }
    companyName?.updateValueAndValidity();
    companyAddress?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      alert('Form is invalid. Please correct the errors and try again.');
      return;
    }

    if (confirm('Are you sure you want to submit the form?')) {
      const formData = this.userForm.value;
      this.http.post(API_URL, formData).subscribe({
        next: (response) => {
          console.log('Response:', response);
        },
        error: (error) => {
          console.error('Error submitting form:', error);
        },
      });
    }
  }
}
