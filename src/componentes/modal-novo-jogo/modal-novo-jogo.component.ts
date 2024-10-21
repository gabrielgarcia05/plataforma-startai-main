import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-modal-novo-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-novo-jogo.component.html',
  styleUrls: ['./modal-novo-jogo.component.css']
})
export class ModalNovoJogoComponent implements OnInit, OnDestroy {
  @Input() mensagem: string = '';
  contador: number = 5; 
  private timerId: any;

  ngOnInit() {
    this.startContagem();
  }

  startContagem() {
    this.timerId = setInterval(() => {
      if (this.contador > 0) {
        this.contador--;
      } else {
        this.fechar(); // Fecha a modal quando chega a 0
        clearInterval(this.timerId); // Limpa o timer
      }
    }, 1000);
  }

  fechar() {
    // Aqui você pode emitir um evento ou alterar uma variável de controle para ocultar a modal
    clearInterval(this.timerId); // Certifique-se de limpar o timer ao fechar
  }

  ngOnDestroy() {
    clearInterval(this.timerId); // Limpa o timer quando o componente é destruído
  }
}
