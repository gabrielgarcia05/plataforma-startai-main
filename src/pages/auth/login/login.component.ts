import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UtilService } from '../../../service/util.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login();
    } else {
      alert('Formulário inválido. Verifique os campos.');
    }
  }

  private login(): void {
    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: (response) => {
        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response));
          this.router.navigate(['/home']); 
        } else {
          alert('Login falhou. Verifique suas credenciais.');
        }
      },
      error: (error) => {
        const mensagemErro = error.error?.error || 'Erro ao fazer login. Tente novamente.';
        alert(mensagemErro);
      }
    });
  }
  
  cadastrar(): void {
    this.router.navigate(['/cadastro']);
  }
}
