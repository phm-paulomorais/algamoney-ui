import { NgForm, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoasService } from './../pessoas.service';

import { Endereco, Pessoa, Contato } from './../../core/model';



@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();
  titulo: string;
  estados: any[];
  cidades: any[];
  estadoSelecionado: number;

  constructor(
    private pessoaService: PessoasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private title: Title,
    private router: Router,
  ) { }

  ngOnInit() {

    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.carregarEstados();
    if (codigoPessoa) {
      this.title.setTitle('Edição de Pessoa');
      this.titulo = 'Edição de Pessoa';

      if (isNaN(codigoPessoa)) {
        this.router.navigate(['/pagina-nao-encontrada']);
        return;
      }

      this.carregarPessoa(codigoPessoa);
    } else {
      this.title.setTitle('Nova Pessoa');
      this.titulo = 'Nova Pessoa';
    }

  }

  carregarEstados() {
    this.pessoaService.listarEstados().then(lista => {
      this.estados = lista.map(uf => ({ label: uf.nome, value: uf.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado).then(lista => {
      this.cidades = lista.map(cidade => ({ label: cidade.nome, value: cidade.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscaPorCodigo(codigo)
      .then(pessoa => {
        if (!pessoa.endereco) {
          pessoa.endereco = new Endereco();
        } else {
          this.estadoSelecionado = (pessoa.endereco.cidade) ?
            pessoa.endereco.cidade.estado.codigo : null;

          if (this.estadoSelecionado) {
            this.carregarCidades();
          }
        }
        this.pessoa = pessoa;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.messageService.add( { severity: 'success', detail: 'Pessoa alterada com sucesso' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaService.adicionar(this.pessoa)
      .then(() => {
        this.messageService.add( { severity: 'success', detail: 'Pessoa adicionada com sucesso!' } );

        form.reset();
        this.pessoa = new Pessoa();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: NgForm) {
    form.reset();

    this.pessoa = new Pessoa();

    this.router.navigate(['/pessoas/novo']);
  }

}
