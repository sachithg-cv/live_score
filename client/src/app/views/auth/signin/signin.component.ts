import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    authForm = new FormGroup({
        email: new FormControl('',[
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-z0-9]+$/),
        ]),
        password: new FormControl('',[
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
        ])
    });

    constructor(private authService: AuthService, private router: Router) {

    }

    ngOnInit(): void {
        
    }

    onSubmit() {
        if(this.authForm.invalid) {
            return;
        }

        const email = this.authForm.value.email as string;
        const password = this.authForm.value.password as string;

        this.authService.signin({email, password})
        .subscribe({
            next: (res) => {
                console.log(res);
                this.router.navigateByUrl("/");
            },
            error: (err) => {
                if(!err.status) {
                    this.authForm.setErrors({
                        noConnection: true
                    });
                } else {
                    const {message} = err;
                    if (message) {
                        this.authForm.setErrors({
                            invalidCredentials: true
                        });
                    } else{
                        this.authForm.setErrors({
                            unknownError: true
                        });
                    }
                    
                }
            }
        });
    }
}