import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

import { PessoaFiltro, PessoasService } from './../pessoas.service';
import { ErrorHandlerService } from './../../core/error-handler.service';



@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  @ViewChild('tabela', {static: true}) grid: Table;
  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  constructor(
              private pessoaService: PessoasService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0 ) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.pessoas = resultado.pessoas;
        this.totalRegistros = resultado.total;
      })
      .catch( erro => {
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  getPessoas(): any {
    this.pessoaService.listarPessoas()
      .then( pessoas => {
        return pessoas;
      });
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir ?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
    .then(() => {
      this.grid.reset();

      this.messageService.add( { severity: 'success', detail: 'Pessoa excluída com sucesso!' });
    })
    .catch( erro => {
      this.errorHandler.handle(erro);
    });
  }

  alterarEstado(pessoa: any) {
    const novoStatus = !pessoa.ativo;
    this.pessoaService.alterarStatus(pessoa.codigo, novoStatus)
    .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add( { severity: 'success', detail: `Pessoa ${acao} com sucesso!` } );
    })
    .catch( erro => {
      this.errorHandler.handle(erro);
    });
  }

}
