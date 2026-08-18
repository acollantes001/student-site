import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface TeacherRecord {
  teacherId: number;
  teacherName: string;
  subject: string;
  mobileNo: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.scss',
})

export class Teacher implements OnInit {
  ngOnInit(): void {
    this.getAllTeacher();
  }

  private cdr = inject(ChangeDetectorRef);

  http = inject(HttpClient);

  teacherList: TeacherRecord[] = [];

  currentTeacher: TeacherRecord = this.createEmptyTeacher();

  formTitle = 'Add Teacher';

  public onSubmit(): void {
    this.http.post<TeacherRecord[]>('https://localhost:7248/api/teachers', this.currentTeacher).subscribe({
      next: (result: any) => {
        this.getAllTeacher();
      },
      error: (err) => {
        console.error('Error adding teacher records:', err);
      }
    });
  }

  private getAllTeacher() {
    this.http.get<TeacherRecord[]>('https://localhost:7248/api/teachers').subscribe({
      next: (result: any) => {
        this.teacherList = result;
        try { this.cdr.detectChanges(); } catch (e) { console.warn('cdr.detectChanges failed', e); }
      },
      error: (err) => {
        console.error('Error fetching teacher records:', err);
      }
    });
  }
  
  private createEmptyTeacher(): TeacherRecord {
    return {
      teacherId: 0,
      teacherName: '',
      subject: '',
      mobileNo: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
  }

  public resetForm(): void {
    this.currentTeacher = this.createEmptyTeacher();
    this.formTitle = 'Add Teacher';
  }
}


