import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/contacts'])
      return
    }

    this.route.queryParams.subscribe((params: Params) => {
      if (params.access === 'denied') {
        this.snackBar.open('Доступ запрещен. Для начала нужно авторизироваться');
      } else if (params.session === 'expire') {
        this.snackBar.open('Сессия истекла. Войдите в систему заного');
      }
    });
  }
}
