import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(email: string, senha: string) {
    this.auth.login(email, senha)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

}
