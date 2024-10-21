import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BlinkService } from '../../../service/blink.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';
import { PlacarService } from '../../../service/placar.service';
import { Jogador } from '../../../componentes/interface/Jogador';

@Component({
  selector: 'app-velha',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent],
  templateUrl: './velha.component.html',
  styleUrls: ['./velha.component.css']
})
export class VelhaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private subscription: Subscription | undefined;
  private blinkSubscription: Subscription | undefined;
  private timerSubscription: Subscription | undefined;

  ReconhecimentoOcular = false;
  gameActive = true; 
  showVitoria = false;
  showDerrota = false;
  showEmpate = false;

  private modalTimer: any;

  tempo: number = 0; // Tempo em segundos
  pontuacaoJogador: number = 0; // Pontuação do jogador

  jogadores: Jogador[] = [];
  selectedIndex: number = 0;
  botHasPlayed: boolean = false;
  cellValues: (string | null)[] = Array(9).fill(null);
  gameMode: number = 2;

  listaPontuacoes: { pontuacao: number; Jogador: string }[] = [];
  jogadas: number = 0;
  
  // Definições de pontuação
  private readonly PONTUACAO_VITORIA_JOGADOR = 500; // Pontos por vitória
  private readonly PONTUACAO_JOGADA = 50; // Pontos por jogada
  private readonly BONUS_TEMPO = 100; // Bônus por completar rápido
  private readonly TEMPO_MAXIMO = 30; // Tempo máximo em segundos para bônus

  constructor(private blinkService: BlinkService, private router: Router, private route: ActivatedRoute, private placarService: PlacarService) {}

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
          .catch(error => console.error("Erro ao inicializar FaceMesh:", error));
      }
    });
  }

  ngOnInit() {
    this.carregarMaioresPontuacoes();

    this.route.params.subscribe(params => {
      if (+params['mode']  === 2) {
        this.ReconhecimentoOcular = true;
        this.iniciarSelecao();
      }
    });

    this.blinkSubscription = this.blinkService.blinkDetected.subscribe(() => {
      if (this.gameMode === 2 && this.gameActive) {
        this.onBlinkDetected();
      }
    });

    this.initializePlacar();
    this.iniciarContador(); // Começar o contador de tempo
  }

  private iniciarContador() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tempo++;
    });
  }

  getImagemPorIndice(indice: number): string {
    const imagens = [
        '../../../assets/img/primeiro.png', 
        '../../../assets/img/segundo.png', 
        '../../../assets/img/terceiro.png'  
    ];

    return imagens[indice];
  }

  private carregarMaioresPontuacoes() {
    const id_jogo = 1; 
    this.gameMode = 0;

    this.route.params.subscribe((params) => {
      this.gameMode = +params['mode']
      this.placarService.MaioresPontuacoes(id_jogo, this.gameMode).subscribe(data => {
        if (data && data.maioresPontuacoes) { 
            this.jogadores = data.maioresPontuacoes.map((item: any) => ({
                nome: item.Jogador, 
            }));
        } else {
            this.jogadores = []; 
        }
    
      });
    });

   
  
  }

  private initializePlacar() {
    this.placarService.MaioresPontuacoes(1, this.gameMode).subscribe(
      (response: { pontuacao: number; Jogador: string }[]) => {
        this.listaPontuacoes = Array.isArray(response) ? response : [];
      },
      error => {
        console.error('Erro ao obter maiores pontuações:', error);
        this.listaPontuacoes = [];
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
    if (this.modalTimer) {
      clearTimeout(this.modalTimer); 
    }
    this.gameActive = false; 

    if (this.ReconhecimentoOcular) {
      this.blinkService.stopCamera(this.videoElement.nativeElement);
    }
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  iniciarSelecao() {
    if (this.gameActive) {
      this.subscription = interval(1500).subscribe(() => {
        if (this.gameActive) {
          this.atualizarSelecao();
        }
      });
    }
  }

  atualizarSelecao() {
    const previousCell = document.getElementById(`cell${this.selectedIndex}`);
    if (previousCell) {
      previousCell.classList.remove('selected');
    }

    do {
      this.selectedIndex = (this.selectedIndex + 1) % 9;
    } while (document.getElementById(`cell${this.selectedIndex}`)?.classList.contains('marcada'));

    const currentCell = document.getElementById(`cell${this.selectedIndex}`);
    if (currentCell) {
      currentCell.classList.add('selected');
    }
  }

  selecionarCelula(index: number) {
    if (!this.cellValues[index] && this.gameActive) {
      this.cellValues[index] = 'X';
      this.jogadas++; // Incrementa o contador de jogadas
      const jogadorCell = document.getElementById(`cell${index}`);

      if (jogadorCell) {
        jogadorCell.classList.add('marcada');
        jogadorCell.classList.add('jogador');
        jogadorCell.innerHTML = 'X';
      }

      const vencedor = this.verificarVencedor();
      if (vencedor) {
        this.gameActive = false;
        return;
      }

      this.botHasPlayed = false;

      setTimeout(() => this.jogadaBot(), 100);
    }
  }

  private jogadaBot() {
    if (this.botHasPlayed || !this.gameActive) return;

    let availableCells: number[] = [];
    for (let i = 0; i < 9; i++) {
      if (!this.cellValues[i]) {
        availableCells.push(i);
      }
    }

    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const botCellIndex = availableCells[randomIndex];
      this.cellValues[botCellIndex] = 'O';
      const botCell = document.getElementById(`cell${botCellIndex}`);
      if (botCell) {
        botCell.classList.add('marcada');
        botCell.classList.add('bot');
        botCell.innerHTML = 'O';
      }

      const vencedor = this.verificarVencedor();
      if (vencedor) {
        this.gameActive = false;
        return;
      }

      this.botHasPlayed = true;
    }
  }

  private onBlinkDetected() {
    this.selecionarCelula(this.selectedIndex);
  }

  private verificarVencedor(): string | null {
    const combinacoesVitoria = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combinacao of combinacoesVitoria) {
        const [a, b, c] = combinacao;
        if (this.cellValues[a] && this.cellValues[a] === this.cellValues[b] && this.cellValues[a] === this.cellValues[c]) {
            if (this.cellValues[a] === 'X') {
                this.showVitoria = true;
                let pontos = this.PONTUACAO_VITORIA_JOGADOR;

                // Verifique se o tempo é suficiente para um bônus
                if (this.tempo <= this.TEMPO_MAXIMO) {
                    pontos += this.BONUS_TEMPO;
                }

                this.pontuacaoJogador += pontos - (this.jogadas * this.PONTUACAO_JOGADA);
                this.registrarPontuacao();
            }
            this.gameActive = false;

            // Reinicia o jogo após 5 segundos
            this.modalTimer = setTimeout(() => {
              this.reiniciarJogo();
            }, 5000);

            return this.cellValues[a];
        }
    }

    if (!this.cellValues.includes(null)) {
      this.showEmpate = true;
      // Atualizar pontuação em caso de empate, se necessário
    }

    return null;
  }

  private reiniciarJogo() {
    this.gameActive = false; 
    this.cellValues.fill(null);
    this.jogadas = 0; // Resetar contador de jogadas
    this.tempo = 0; // Resetar tempo

    // Remover marcações e conteúdo de todas as células no DOM
    for (let index = 0; index < this.cellValues.length; index++) {
        const cell = document.getElementById(`cell${index}`);
        if (cell) {
            cell.classList.remove('marcada', 'jogador', 'bot'); // Remover todas as classes
            cell.innerHTML = ''; // Limpar o conteúdo da célula
        }
    }

    // Desativar a seleção atual para evitar múltiplos seletores
    const previousCell = document.getElementById(`cell${this.selectedIndex}`);
    if (previousCell) {
      previousCell.classList.remove('selected');
    }
   

    // Resetar estados do jogo
    this.selectedIndex = 0;
    this.showVitoria = false;
    this.showDerrota = false;
    this.showEmpate = false;
    this.botHasPlayed = false;

    // Limpar modalTimer, se existir
    if (this.modalTimer) {
        clearTimeout(this.modalTimer);
        this.modalTimer = null;
    }

    // Limpar a subscription existente para evitar múltiplos intervalos
    if (this.subscription) {
        this.subscription.unsubscribe();
    }

    // Reiniciar a seleção após um curto intervalo
    setTimeout(() => {
        this.gameActive = true;
        this.iniciarSelecao(); // Iniciar seleção apenas após limpar
    }, 100); // Pode ajustar o tempo conforme necessário

    this.initializePlacar();
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }

  registrarPontuacao() {
    const userId = this.getUserData().user.id;
    this.placarService.registrarPlacar(this.pontuacaoJogador, this.tempo, userId, this.gameMode, 1).subscribe();
  }

  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}
