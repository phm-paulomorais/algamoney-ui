import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import { SegurancaRotingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { AuthGuard } from './auth.guard';
import { environment } from './../../environments/environment';


export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [`${environment.allowedDomain}`],
        disallowedRoutes: [`${environment.apiUrl}/oauth/token`],
      }
    }),

    FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,

    SegurancaRotingModule
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard
  ],
  exports: []
})
export class SegurancaModule { }
