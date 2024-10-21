import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['home']);
            return false; // Impede o acesso à rota ''
        } else {
            this.router.navigate(['login']);
            return false; // Impede o acesso à rota ''
        }
    }
}
