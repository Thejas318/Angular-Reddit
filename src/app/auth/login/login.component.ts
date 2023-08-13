import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequestPayload } from './login-request-payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  loginForm!: FormGroup;
  isError: boolean | undefined;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string = '';

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router
    ){

    this.loginRequestPayload = {
      userName: '',
      passWord: ''

    }
  }
  ngOnInit(): void {

    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });

    this.activatedRoute.queryParams
    .subscribe(params => {
      if(params['registered'] !== undefined && params['registered'] === 'true') {
        this.toaster.success('SignUp Successfull');
        this.registerSuccessMessage = 'Please Check your inbox for activation email '
        + 'activate your account before you Login!';
      }
    })

  }

  onSubmit() {

    this.loginRequestPayload.userName = this.loginForm.get('userName')?.value;
    this.loginRequestPayload.passWord = this.loginForm.get('passWord')?.value;

    console.log("username", this.loginRequestPayload.userName);
    this.authService.logIn(this.loginRequestPayload).subscribe( data => {
      if (data) {
        this.isError = false;
        this.router.navigateByUrl('/');
        this.toaster.success('Login Successful');
      } else {
        this.isError = true;
      }     
     })
    };
}
