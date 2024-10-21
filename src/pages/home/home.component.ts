import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userData = this.getUserData();

  constructor(private router: Router) {}

  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  velha(): void {
    if (this.userData) {
      const route = this.userData.controleId === 1 ? 
        ['controle', 'jogo-velha'] : 
        ['jogo-velha', this.userData.controleId];
      this.router.navigate(route);
    }
  }

  memoria(): void {
    if (this.userData) {
      const route = this.userData.controleId === 1 ? 
        ['controle', 'jogo-memoria'] : 
        ['jogo-memoria', this.userData.controleId];
      this.router.navigate(route);
    }
  }
}
