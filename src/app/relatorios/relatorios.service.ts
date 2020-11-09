import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
    let params = new HttpParams();

    const dataRelatorio = new Date();
    console.log(dataRelatorio);

    // Ao tentar gerar o relatório na data 13/12/2019 a 23/05/2020 ocorre erro de invalid date,
    // eu identifiquei que o momente esta considerando os dias como meses , e meses como dias,
    // a solução que encontrei
    params = params.set('inicio', moment(inicio, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    params = params.set('fim', moment(fim, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    params = params.set('dataRelatorio', moment(dataRelatorio, 'DD/MM/YYYY').format('YYYY-MM-DD'));

    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`,
      { params, responseType: 'blob' })
      .toPromise()
      .then( response => response);

  }

}
