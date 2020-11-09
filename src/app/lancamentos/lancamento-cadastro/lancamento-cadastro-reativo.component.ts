import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Lancamento } from 'src/app/core/model';
import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoasService } from './../../pessoas/pessoas.service';


@Component({
  selector: 'app-lancamento-cadastro-reativo',
  templateUrl: './lancamento-cadastro-reativo.component.html',
  styleUrls: ['./lancamento-cadastro-reativo.component.css']
})
export class LancamentoCadastroReativoComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  titulo: string;
  formulario: FormGroup;
  uploadEmAndamento = false;
  protocolo = 'https:';

  constructor(
      private categoriaService: CategoriaService,
      private pessoaService: PessoasService,
      private lancamentoService: LancamentoService,
      private messageService: MessageService,
      private errorHandler: ErrorHandlerService,
      private route: ActivatedRoute,
      private router: Router,
      private title: Title,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.configurarFormulario();

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

  antesUploadAnexo(event) {
    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    // Para obtermos acesso ao objeto de response, precisamos acessar a propriedade
    // "originalEvent" e dentro da mesma, acessamos a propriedade "body"
    const anexo = event.originalEvent.body;

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  configurarURLcomProtocolo() {
    return `https://${this.formulario.get('urlAnexo').value}`;
  }

  erroUpload(event) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar enviar anexo!' });
    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;
    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }
    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  private configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required ],
      dataVencimento: [null, Validators.required ],
      dataPagamento: [],
      descricao: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      valor: [null, Validators.required ],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required ],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []

    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscaPorCodigo(codigo)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then(() => {
        this.messageService.add( { severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        this.router.navigate(['/lancamentos']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);

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

  novo() {

    this.formulario.reset(new Lancamento());

    // setTimeout(function(){
    //  this.lancamento = new Lancamento();
    // }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

}
