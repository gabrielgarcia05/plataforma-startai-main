import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../../service/perfil.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dados',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.css']
})
export class DadosComponent implements OnInit {
  dadosForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private router: Router
  ) {
    this.dadosForm = this.formBuilder.group({
      nome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      controle: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userId = this.getUserData()?.user?.id;
    if (userId) {
      this.perfilService.getDadosPessoais(userId).subscribe(
        data => {
          this.dadosForm.patchValue({
            nome: data.nome,
            dataNascimento: data.dataNascimento,
            email: data.email,
            controle: data.controleId 
          });
        },
        error => {
          console.error('Erro ao obter dados pessoais:', error);
        }
      );
    }
  }

  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  onSubmit(): void {
    const userId = this.getUserData()?.user?.id;
  
    if (this.dadosForm.valid && userId) {
      this.perfilService.atualizarDados(userId, this.dadosForm.value).subscribe(
        response => {
          console.log('Dados atualizados com sucesso', response);
          if (response.user) {
            localStorage.setItem('userData', JSON.stringify(response));
            this.router.navigate(['/home']); 
          } 
          alert('Dados atualizados com sucesso!'); 
        },
        error => {
          console.error('Erro ao atualizar dados:', error);
          alert('Erro ao atualizar os dados. Por favor, tente novamente.'); 
        }
      );
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.'); 
    }
  }

  dadosPessoais(): void {
    this.router.navigate(['/perfil/dados']);
  }

  senha(): void {
    this.router.navigate(['/perfil/senha']);
  }
}
