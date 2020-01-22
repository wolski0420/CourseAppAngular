import { CourseCl } from '../coursecl';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesdataService } from '../coursesdata.service';
import { Location } from '@angular/common';
import { StarRatingComponent } from 'ng-starrating';
import { AuthService } from '../auth.service';
import { RateUser } from '../rateuser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  private course: CourseCl;
  private courseKey: string;
  private uid: string;
  private userCourseRating: number;
  private isFirstRating: boolean;
  private isUserSignedToCourse: boolean;
  private hasCourseFreePlaces: boolean;
  private isUserAdmin: boolean;
  private courseChangeVisibility: boolean;

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesdataService,
    private location: Location,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.uid = this.auth.getUID();
    this.getCourse();
    this.getUserRating();
    this.checkIfAdmin();
    this.courseChangeVisibility = false;
  }

  /**
   *  funkcje init
   */

  getCourse(): string {
    this.courseKey = this.route.snapshot.paramMap.get('$key');
    this.courseService.getCourseFromDataBase(this.courseKey).snapshotChanges().subscribe(courseSnapshot => {
      const crs = courseSnapshot.payload.toJSON();
      const loadValue = 'key';
      crs[loadValue] = courseSnapshot.key;
      this.course = crs as CourseCl;

      if (this.course.signedStudents >= this.course.students) {
        this.hasCourseFreePlaces = false;
      } else {
        this.hasCourseFreePlaces = true;
      }
    });
    return this.courseKey;
  }

  getUserRating(): void {
    this.courseService.getCourseFromUserDataBase(this.uid, this.courseKey).snapshotChanges().subscribe(rateSnapshot => {
      let userRate = rateSnapshot.payload.toJSON();

      if (userRate == null) {
        this.isFirstRating = true;
        this.isUserSignedToCourse = false;
        this.userCourseRating = 0;
      } else {
        this.isFirstRating = false;
        this.isUserSignedToCourse = true;
        userRate = userRate as RateUser;
        const pathUserRating = 'userRating';
        this.userCourseRating = userRate[pathUserRating];

        if (this.userCourseRating === 0) {
          this.isFirstRating = true;
        }
      }
    });
  }

  checkIfAdmin(): void {
    this.auth.getUserData().snapshotChanges().subscribe(userSnapshot => {
      const roles = 'roles';
      const admin = 'admin';
      this.isUserAdmin = userSnapshot.payload.toJSON()[roles][admin];
    });
  }

  /**
   *  funkcje z komponentu
   */

  addRate($event: {oldValue: number, newValue: number, starRating: StarRatingComponent}, course: CourseCl): void {
    const refToUser = this.auth.firebase.database.ref(`/users/` + this.uid);
    refToUser.child(`/userCourses/` + this.courseKey + `/userRating`).set($event.newValue);

    if (this.isFirstRating) {
      this.isFirstRating = false;

      if (course.ratenumber === 0) {
        course.ratenumber ++;
        course.rating = $event.newValue;
      } else {
        course.ratenumber ++;
        course.rating = (course.rating * ( ( course.ratenumber - 1 ) / course.ratenumber ) + ( $event.newValue / course.ratenumber ));
      }

    } else {
      course.rating = (course.rating * course.ratenumber - $event.oldValue + $event.newValue) / course.ratenumber;
    }

    this.courseService.updateCourseInDataBase(this.courseKey, this.course.rating, this.course.ratenumber);
  }

  signFor(): void {
    if (!this.isUserSignedToCourse && this.course.signedStudents < this.course.students) {
      const refToUser = this.auth.firebase.database.ref(`/users/` + this.uid);
      refToUser.child(`/userCourses/` + this.courseKey + `/userRating`).set(0);

      if (!this.isUserSignedToCourse) {
        this.course.signedStudents++;
        this.courseService.signStudentToCourseInDataBase(this.courseKey, this.course.signedStudents);
      }

      this.isUserSignedToCourse = true;
    }
  }

  comeBack(): void {
    this.location.back();
  }

  courseChanges(): void{
    if (this.isUserAdmin) {
      this.courseChangeVisibility = !this.courseChangeVisibility;
    }
  }

  /**
   * funkcje zmiany kursu dla admina
   */

  changeCourseName(newName: string): void {
    this.course.name = newName;
    this.courseService.changeCourseNameInDataBase(this.courseKey, newName);
  }

  changeCourseECTS(newECTS: number): void {
    this.course.ects = newECTS;
    this.courseService.changeCourseECTSInDataBase(this.courseKey, newECTS);
  }

  changeCourseSemester(newSemester: number): void {
    this.course.semester = newSemester;
    this.courseService.changeCourseSemesterInDataBase(this.courseKey, newSemester);
  }

  changeCourseLecture(): void {
    this.course.lecture = !this.course.lecture;
    this.courseService.changeCourseLectureInDataBase(this.courseKey, this.course.lecture);
  }

  changeCourseEx(): void {
    this.course.ex = !this.course.ex;
    this.courseService.changeCourseExInDataBase(this.courseKey, this.course.ex);
  }

  changeCourseLabs(): void {
    this.course.labs = !this.course.labs;
    this.courseService.changeCourseLabsInDataBase(this.courseKey, this.course.labs);
  }

  changeCourseProj(): void {
    this.course.proj = !this.course.proj;
    this.courseService.changeCourseProjInDataBase(this.courseKey, this.course.proj);
  }

  changeCourseStudents(newStudentsNumber: number): void {
    this.course.students = newStudentsNumber;
    this.courseService.changeCourseStudentsInDataBase(this.courseKey, this.course.students);
  }
}
