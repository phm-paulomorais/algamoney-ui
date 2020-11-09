import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

import { LancamentoFiltro, LancamentoService } from '../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../../seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  @ViewChild('tabela', {static: true}) grid: Table;
  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];

  constructor(
    public auth: AuthService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0 ) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.lancamentos = resultado.lancamentos;
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

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir ?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
    .then(() => {
      this.grid.reset();

      this.messageService.add( { severity: 'success', detail: 'Lançamento excluído com sucesso!' } );
    })
    .catch( erro => {
      this.errorHandler.handle(erro);
    });
  }

}
