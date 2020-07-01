import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

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

    this.oSub = this.authService.login(user).subscribe(callback => {
      this.router.navigate(['/contacts'])
      this.form.reset()
      this.form.enable()

      this.snackBar.open('Вы вошли в систему')
    }, err => {
      this.form.enable()
      this.snackBar.open('Проверьте правильность введенных данных')
    })
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
