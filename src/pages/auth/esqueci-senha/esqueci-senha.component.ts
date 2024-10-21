import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css']
})
export class EsqueciSenhaComponent {
  redefinirForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.redefinirForm = this.criarFormulario(); 
  }

  private criarFormulario(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dataNascimento: new FormControl('', [Validators.required]), 
    });
  }

  onSubmit(): void {
    if (this.redefinirForm.valid) {
      this.redefinirSenha();
    } else {
      alert('Formulário inválido. Verifique os campos.');
    }
  }

  private redefinirSenha(): void {
    const { email, senha, dataNascimento } = this.redefinirForm.value;

    this.authService.redefinirSenha(email, senha, dataNascimento).subscribe({
      next: () => {
        alert('Senha redefinida com sucesso! Você será redirecionado para a tela de login');
      },
      error: (error) => {
        const mensagemErro = error.error?.error || 'Erro ao redefinir a senha. Tente novamente.';
        alert(mensagemErro);
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
