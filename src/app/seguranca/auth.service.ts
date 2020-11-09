import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  tokensRevokeUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.tokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    let headers = new HttpHeaders();
    // client_id:client_secret codificado em Base64
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then( response => {
        this.armazenarToken(response.access_token);
      })
      .catch( response => {
        const responseError = response.error;
        if (response.status === 400 && responseError.error === 'invalid_grant') {
          return Promise.reject('Usuário ou senha inválida');
        } else {
          return Promise.reject(response);
        }
      });

  }

  obterNovoAccessToken(): Promise<void> {
    let headers = new HttpHeaders();
    // client_id:client_secret codificado em Base64
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true } )
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);

        console.log('Novo access token criado');

        return Promise.resolve(null);
      })
      .catch(response => {
          console.error('Erro ao renovar token', response);
          return Promise.resolve(null);
      });

  }

  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  public temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}
