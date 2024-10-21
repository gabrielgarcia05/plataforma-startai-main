import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, private authService: AuthService) {}

  minhaConta(): void {
    this.router.navigate(['/perfil/dados']);
  }

  sair(): void {
    this.authService.logout();  
  }

  deletar(): void {
    const userId = this.getUserData()?.user?.id;

    // Exibir o alerta de confirmação
    const confirmDelete = confirm('Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.');

    if (confirmDelete) {
        this.authService.deletar(userId).subscribe(
            response => {
                alert('Sua conta foi excluída com sucesso.');
                this.router.navigate(['/login']); // Ajuste a rota conforme sua aplicação
              },
            error => {
                alert('Erro ao excluir a conta. Por favor, tente novamente.');
            }
        );
    } else {
        console.log('Exclusão cancelada pelo usuário.');
    }
}

  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

}
