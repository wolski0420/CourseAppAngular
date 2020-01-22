import { HomeComponent } from './home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { ListofcoursesComponent } from './listofcourses/listofcourses.component';
import { NavComponent } from './nav/nav.component';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CreateCourseComponent } from './create-course/create-course.component';
import { RatingModule } from 'ng-starrating';
import { SearchCourseComponent } from './search-course/search-course.component';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { SearchPipeByName } from './search-pipes.pipe';
import { SearchPipeByECTS } from './search-pipes.pipe';
import { SearchPipeByStudents } from './search-pipes.pipe';
import { SearchPipeByMinRating } from './search-pipes.pipe';
import { SearchPipeByMaxRating } from './search-pipes.pipe';
import { PaginationPipe } from './search-pipes.pipe';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {PagenotfoundComponent} from './pagenotfound/pagenotfound.component';
import { FooterComponent } from './footer/footer.component'

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    ListofcoursesComponent,
    NavComponent,
    HomeComponent,
    CreateCourseComponent,
    SearchCourseComponent,
    SearchPipeByName,
    SearchPipeByECTS,
    SearchPipeByStudents,
    SearchPipeByMinRating,
    SearchPipeByMaxRating,
    PaginationPipe,
    LoginComponent,
    PagenotfoundComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RatingModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
