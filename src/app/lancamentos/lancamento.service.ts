import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from '../core/model';
import { environment } from './../../environments/environment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
      this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
          const lancamentos = response['content'];
          const resultado = {
            lancamentos,
            total: response['totalElements']
          };

          return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {

    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.post<Lancamento>(this.lancamentosUrl, Lancamento.toJson(lancamento)).toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, Lancamento.toJson(lancamento))
      .toPromise()
      .then( lancamentoAtualizado => {
        const arrayLancamentos = new Array();
        arrayLancamentos.push(lancamentoAtualizado);
        const arrayLancamentosConvertido = this.converterStringsParaDatas(arrayLancamentos);
        return arrayLancamentosConvertido[0];
      });
  }

  buscaPorCodigo(codigo: number): Promise<Lancamento> {
    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then( lancamento => {
        const arrayLancamentos = new Array();
        arrayLancamentos.push(lancamento);
        const arrayLancamentosConvertido = this.converterStringsParaDatas(arrayLancamentos);
        return arrayLancamentosConvertido[0];
      });
  }

  private converterStringsParaDatas(lancamentos: Array<Lancamento>) {
    return lancamentos.map( lancamento => {
      return {
      ...lancamento,
      dataVencimento: moment(lancamento.dataVencimento, 'YYYY-MM-DD').toDate(),
      dataPagamento: lancamento.dataPagamento ? moment(lancamento.dataPagamento, 'YYYY-MM-DD').toDate() : null
      };
    });

  }

}
