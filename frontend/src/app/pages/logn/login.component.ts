import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logn',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  displaySignUpForm: boolean = false;
  loginForm!: FormGroup;

  constructor(private _auth: AuthService) {}

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(['', [Validators.required]]),
      email: new FormControl(['', [Validators.required, Validators.email]]),
      password: new FormControl(['', Validators.required])
    });
  }

  displaySignUp(): void {
    this.displaySignUpForm = this.displaySignUpForm ? true : false;
  }

  login() {
    this._auth.login({})
    .then(({ error, data, loading }: any) => {
      console.log(data);
    })
  }

}
