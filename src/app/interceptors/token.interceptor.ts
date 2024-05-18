
import { HttpInterceptorFn } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
  const tokenService = new TokenService();
  if (tokenService.getToken() && ! tokenService.isTokenExpired()) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${tokenService.getToken()}`),
    });
  }
  return next(req);
};