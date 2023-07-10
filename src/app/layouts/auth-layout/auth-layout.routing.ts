import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { LoginOtpComponent } from 'src/app/pages/login-otp/login-otp.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'login-otp',          component: LoginOtpComponent },
    { path: 'register',       component: RegisterComponent }
];
