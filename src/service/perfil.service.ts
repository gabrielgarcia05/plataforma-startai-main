import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'https://api-53k8.onrender.com';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Método para obter os dados pessoais
  getDadosPessoais(id: number): Observable<any> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}/usuario/${id}`;

    return this.http.get(url, { headers: this.createHeaders() })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => this.handleError('Erro ao obter dados pessoais:', error, []))
      );
  }

  // Método para atualizar os dados pessoais
  atualizarDados(id: number, dados: any): Observable<any> {
    this.loadingSubject.next(true);
    const url = `${this.apiUrl}/atualizar-dados/${id}`;

    return this.http.put(url, dados, { headers: this.createHeaders() })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => this.handleError('Erro ao atualizar dados pessoais:', error, null))
      );
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
