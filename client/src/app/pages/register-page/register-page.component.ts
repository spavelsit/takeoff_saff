import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup

  oSub: Subscription

  constructor(
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(): void {
    const user: User = {
      email: this.form.get('email').value.trim(),
      password: this.form.get('password').value.trim(),
    }

    this.form.disable()

    this.oSub = this.authService.register(user).subscribe(callback => {
      this.authService.setToken(callback.accessToken) 
      this.router.navigate(['/contacts'])
     
      this.form.reset()
    
      this.form.enable()

      this.snackBar.open('Вы успешно зарегистрировались и вошли в систему')
    }, err => {
      this.form.enable()
      this.snackBar.open("Данный E-mail уже занят")
    })
    
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
