import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { PerfilService } from '../../../service/perfil.service';

@Component({
  selector: 'app-senha',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './senha.component.html',
  styleUrl: './senha.component.css'
})
export class SenhaComponent {

  redefinirForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private perfilService: PerfilService,
  ) {
    this.redefinirForm = this.criarFormulario(); 
  }

  private criarFormulario(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dataNascimento: new FormControl('', [Validators.required]), 
    });
  }

  
  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }


  ngOnInit(): void {
    const userId = this.getUserData()?.user?.id;
    if (userId) {
      this.perfilService.getDadosPessoais(userId).subscribe(
        data => {
          this.redefinirForm.patchValue({
            email: data.email,
          });
        },
        error => {
          console.error('Erro ao obter dados pessoais:', error);
        }
      );
    }
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
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const mensagemErro = error.error?.error || 'Erro ao redefinir a senha. Tente novamente.';
        alert(mensagemErro);
      }
    });
  }
  
  dadosPessoais(): void {
    this.router.navigate(['/perfil/dados']);
  }

  senha(): void {
    this.router.navigate(['/perfil/senha']);
  }
}
