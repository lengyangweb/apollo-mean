import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logn',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  displaySignUpForm: boolean = false;
  loginForm!: FormGroup;

  constructor(private _auth: AuthService, private _fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  displaySignUp(): void {
    this.displaySignUpForm = this.displaySignUpForm ? true : false;
  }

  login() {
    this._auth.login(this.loginForm.value)
    .then(({ error, data, loading }: any) => {

      // if data is defined and has field signIn and loading is false
      if (data && data.hasOwnProperty('signIn') && !loading) {

        console.log(data);

      }

    })
  }

}
