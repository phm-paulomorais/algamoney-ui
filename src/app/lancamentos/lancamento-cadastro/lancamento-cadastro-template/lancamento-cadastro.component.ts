import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Lancamento } from 'src/app/core/model';
import { LancamentoService } from '../../lancamento.service';
import { CategoriaService } from './../../../categorias/categoria.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { PessoasService } from './../../../pessoas/pessoas.service';


@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();
  titulo: string;

  constructor(
      private categoriaService: CategoriaService,
      private pessoaService: PessoasService,
      private lancamentoService: LancamentoService,
      private messageService: MessageService,
      private errorHandler: ErrorHandlerService,
      private route: ActivatedRoute,
      private router: Router,
      private title: Title
  ) { }

  ngOnInit() {

    const codigoLancamento = this.route.snapshot.params['codigo'];

    if (codigoLancamento) {
      this.title.setTitle('Edição de Lançamento');
      this.titulo = 'Edição de Lançamento';

      if (isNaN(codigoLancamento)) {
        this.router.navigate(['/pagina-nao-encontrada']);
        return;
      }

      this.carregarLancamento(codigoLancamento);
    } else {
      this.title.setTitle('Novo Lançamento');
      this.titulo = 'Novo Lançamento';
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscaPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(() => {
        this.messageService.add( { severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        this.router.navigate(['/lancamentos']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: NgForm) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;

        this.messageService.add( { severity: 'success', detail: 'Lançamento alterado com sucesso' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then( categorias => {
        this.categorias = categorias.map(c => {
          return { label: c.nome, value: c.codigo };
        });
      })
      .catch( erro => {
        this.errorHandler.handle(erro);
      });
  }

  carregarPessoas() {
    return this.pessoaService.listarPessoas()
      .then( pessoas => {
        this.pessoas = pessoas.map(p => {
          return { label: p.nome, value: p.codigo };
        });
      })
      .catch( erro => {
        this.errorHandler.handle(erro);
      });
  }

  novo(form: NgForm) {
    console.log(form);
    form.reset(new Lancamento());

    // setTimeout(function(){
    //  this.lancamento = new Lancamento();
    // }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

}
