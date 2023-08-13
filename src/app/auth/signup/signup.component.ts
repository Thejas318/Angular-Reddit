import { Component, OnInit, Signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignuprequestPayload } from './signup-request-payload';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  signUpForm!: FormGroup;
  signUpRequestPayload: SignuprequestPayload;

  constructor(
    private authService: AuthService,
     private toaster: ToastrService,
     private router: Router ){
  
      this.signUpRequestPayload = {
      userName:'',
      email:'',
      passWord:''
    }
  }

  ngOnInit() {

    this.signUpForm = new FormGroup({

      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      userName: new FormControl('', Validators.required),
      passWord: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.signUpRequestPayload.email = this.signUpForm.get('emailAddress')?.value;
    this.signUpRequestPayload.userName = this.signUpForm.get('userName')?.value;
    this.signUpRequestPayload.passWord = this.signUpForm.get('passWord')?.value;

    console.log("username", this.signUpRequestPayload.userName);

    this.authService.signUp(this.signUpRequestPayload)
    .subscribe(() => {
      this.router.navigate(['/login'],
       { queryParams : { registered: 'true'}});
    }, () => {
      this.toaster.error('Signup attempt failed! Please try again with different credentials');
    }
    );
  }
}
