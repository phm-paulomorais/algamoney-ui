import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosPorCategoria(): Promise<Array<any>> {
    let params = new HttpParams();
    params = params.set('tipoLancamento', 'DESPESA');

    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-categoria`, { params })
      .toPromise()
      .then( response => response as Array<any>);
  }

  lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then( response => {
        const dados = response as Array<any>;
        this.converterStringsParaDatas(dados);

        return dados;
      });
  }

  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }

}
