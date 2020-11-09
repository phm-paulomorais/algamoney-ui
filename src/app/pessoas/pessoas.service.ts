import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Cidade, Estado, Pessoa } from './../core/model';
import { environment } from './../../environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 4;
}

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  pessoasUrl: string;
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
          const pessoas = response.content;
          const resultado = {
            pessoas,
            total: response.totalElements
          };

          return resultado;
      });
  }

  listarPessoas(): any {
    return this.http.get<any>(`${this.pessoasUrl}`)
    .toPromise()
    .then(response => {
      return response.content;
    });

  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  alterarStatus(codigo: number, status: boolean): Promise<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, status, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa).toPromise();
  }

  buscaPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then( pessoa => {
        return pessoa;
      });
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
      .toPromise()
      .then( pessoaAtualizada => {
        return pessoaAtualizada;
      });
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get(this.estadosUrl).toPromise()
      .then(response => response as Estado[]);
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    let params = new HttpParams();
    params = params.set('estado', estado);
    return this.http.get(this.cidadesUrl, { params }).toPromise()
      .then(response => response as Cidade[]);
  }

}
