import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teacher } from './teacher';

describe('Teacher', () => {
  let component: Teacher;
  let fixture: ComponentFixture<Teacher>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Teacher, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Teacher);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a POST request when the form is submitted', () => {
    const form = fixture.nativeElement.querySelector('form');

    form.dispatchEvent(new Event('submit'));

    const req = httpMock.expectOne('https://localhost:7248/api/teacherMaster');
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });
});
