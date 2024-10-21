import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UtilService } from '../../../service/util.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.cadastroForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dataNascimento: new FormControl('', [Validators.required, this.utilService.validarData]),
      controle: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      this.cadastrarUsuario();
    } else {
      alert('Formulário inválido. Verifique os campos.');
    }
  }

  private cadastrarUsuario(): void {
    const { nome, email, senha, dataNascimento, controle } = this.cadastroForm.value;

    this.authService.cadastro(nome, email, senha, dataNascimento, controle).subscribe({
      next: (response) => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        const mensagemErro = error.error?.error || 'Erro ao cadastrar usuário. Tente novamente.';
        alert(mensagemErro);
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  redefinirSenha(): void {
    this.router.navigate(['/redefinirSenha']);
  }
}
