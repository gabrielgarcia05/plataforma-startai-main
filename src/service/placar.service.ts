import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacarService {
  private apiUrl = 'https://api-53k8.onrender.com';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Método para registrar o placar
  registrarPlacar(pontuacao: number, tempo: number, id_usuario: number, id_controle: number, id_jogo: number): Observable<any> {
    this.loadingSubject.next(true);
    const body = this.createBody(pontuacao, tempo, id_usuario, id_controle, id_jogo);
    
    return this.http.post(`${this.apiUrl}/registrar-pontuacao`, body, { headers: this.createHeaders() })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => this.handleError('Erro ao registrar placar:', error))
      );
  }

  // Método para obter as maiores pontuações
  MaioresPontuacoes(id_jogo: number, id_controle: number): Observable<any> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}/maiores-pontuacoes-menos-tempos?id_jogo=${id_jogo}&id_controle=${id_controle}`;

    return this.http.get(url, { headers: this.createHeaders() })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => this.handleError('Erro ao obter maiores pontuações:', error, []))
      );
  }

  // Cria o corpo da requisição para registrar placar
  private createBody(pontuacao: number, tempo: number, id_usuario: number, id_controle: number, id_jogo: number) {
    return { pontuacao, tempo, id_usuario, id_controle, id_jogo };
  }

  // Cria os cabeçalhos da requisição
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Trata erros de forma centralizada
  private handleError(message: string, error: any, returnValue: any = null): Observable<any> {
    console.error(message, error);
    return of(returnValue);
  }
}
