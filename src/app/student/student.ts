import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface StudentRecord {
  studentId: number;
  studName: string;
  mobileNo: string;
  email: string;
  city: string;
  state: string;
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
}

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.scss'],
})

export class Student implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllStudent();
  }

  studentList: StudentRecord[] = [];

  getAllStudent() {
    this.http.get<StudentRecord[]>('https://localhost:7248/api/studentMaster').subscribe({
      next: (result: any) => {
        this.studentList = result;
        try { this.cdr.detectChanges(); } catch (e) { console.warn('cdr.detectChanges failed', e); }
      },
      error: (err) => {
        console.error('Error fetching student records:', err);
      }
    });
  }

  formTitle = 'Add Student';

  currentStudent: StudentRecord = this.createEmptyStudent();

  onSubmit(): void {
    if (this.currentStudent.studentId && this.currentStudent.studentId > 0) {
      this.http.put<StudentRecord>(`https://localhost:7248/api/studentMaster/${this.currentStudent.studentId}`, this.currentStudent).subscribe({
        next: () => {
          this.getAllStudent();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating student record:', err);
        }
      });
    } else {
      this.http.post<StudentRecord[]>('https://localhost:7248/api/studentMaster', this.currentStudent).subscribe({
        next: (result: any) => {
          this.getAllStudent();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error adding student records:', err);
        }
      });
    }
  }

  editStudent(studentId: number): void {
    const student = this.studentList.find(s => s.studentId === studentId);
    if (!student) return;
    this.formTitle = 'Edit Student';
    this.currentStudent = { ...student };
  }

  deleteStudent(studentId: number): void {
    const confirmed = confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    this.http.delete<StudentRecord>(`https://localhost:7248/api/studentMaster/${studentId}`).subscribe({
      next: () => {
        this.getAllStudent();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error deleting student record:', err);
      }
    });
  }

  resetForm(): void {
    this.currentStudent = this.createEmptyStudent();
    this.formTitle = 'Add Student';
  }

  private createEmptyStudent(): StudentRecord {
    return {
      studentId: 0,
      studName: '',
      mobileNo: '',
      email: '',
      city: '',
      state: '',
      pinCode: '',
      addressLine1: '',
      addressLine2: '',
    };
  }
}
