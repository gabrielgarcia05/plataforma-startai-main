import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/auth/login/login.component';
import { CadastroComponent } from '../pages/auth/cadastro/cadastro.component';
import { AuthGuard } from '../auth/Auth.guard';
import { UnAuthGuard } from '../auth/UnAuth.guard';
import { HomeComponent } from '../pages/home/home.component';
import { MemoriaComponent } from '../pages/jogos/memoria/memoria.component';
import { VelhaComponent } from '../pages/jogos/velha/velha.component';
import { DadosComponent } from '../pages/perfil/dados/dados.component';
import { SenhaComponent } from '../pages/perfil/senha/senha.component';
import { ControleComponent } from '../pages/controle/controle.component';
import { RedirectGuard } from '../auth/RedirectGuard.guard';
import { EsqueciSenhaComponent } from '../pages/auth/esqueci-senha/esqueci-senha.component';

export const routes: Routes = [
  {path: '', component: LoginComponent, },
  {path: 'login', component: LoginComponent, },
  {path: 'cadastro', component: CadastroComponent, },
  {path: 'redefinirSenha', component: EsqueciSenhaComponent, },
  {path: 'home', component: HomeComponent, },
  {path: 'jogo-memoria/:mode', component: MemoriaComponent, },
  {path: 'jogo-velha/:mode', component: VelhaComponent, },
  {path: 'perfil/dados', component: DadosComponent, },
  {path: 'perfil/senha', component: SenhaComponent, },
  {path: 'controle/:jogo', component: ControleComponent, },

];
