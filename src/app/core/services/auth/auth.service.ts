import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError, switchMap } from 'rxjs';
import { environment } from 'src/environmet';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { CheckTokenResponse } from '../interfaces/check-token.response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(false);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus> ( AuthStatus.cheking )

  public currentUser = computed(() => this._currentUser() )
  public authStatus = computed(()  => this._authStatus() )

  constructor() { 
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean{
    this._currentUser.set(user);
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
    
    return true;
  }

  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  login(email: string, contrasenia: string): Observable<boolean> {
    const url = `${this.apiUrl}/api/v1/auth/login`;
    const body = { email, contrasenia };

    return this.http.post<LoginResponse>(url, body)
    .pipe(
      switchMap(({user, token}) => {
        // Guardar el token temporalmente
        localStorage.setItem('token', token);
        
        // Verificar el estado de autenticación para obtener información completa
        return this.checkAuthStatus();
      }),
      catchError(err => throwError(() => err.error.message)      
      )
    );
    
  }

  logout(){
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/api/v1/auth/check-status`;
    const token = localStorage.getItem('token');
  
    if (!token) {
      this.logout();
      return of(false);
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this.logout(); 
        return of(false);
      })
    );
  }

  // Método para verificar si el usuario actual es admin
  isUserAdmin(): boolean {
    const user = this.currentUser();
    return user?.roles?.includes('admin') || user?.roles?.includes('ADMIN') || false;
  }

  // Método para obtener los roles del usuario actual
  getUserRoles(): string[] {
    const user = this.currentUser();
    return user?.roles || [];
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.roles?.includes(role) || false;
  }

}
