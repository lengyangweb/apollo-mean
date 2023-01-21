import { Component, OnInit } from '@angular/core';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';

@Component({
  selector: 'app-logn',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  displaySignUpForm: boolean = false;

  constructor() {}

  ngOnInit() {}

  displaySignUp(): void {
    this.displaySignUpForm = this.displaySignUpForm ? true : false;
  }

}
