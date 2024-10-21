import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.css'
})
export class ControleComponent implements OnInit {
  gameMode: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameMode = params['jogo']; 
    });
  }
  
  teclado(): void {
    this.router.navigate([this.gameMode, 1]);
  }

  olho(): void {
    this.router.navigate([this.gameMode, 2]);
  }
}
