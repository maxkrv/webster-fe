import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { App } from './app';
import { AuthLayout } from './modules/auth/layout/auth-layout';
import { ActivateAccountPage } from './modules/auth/pages/activate-account-page';
import { ForgotPasswordPage } from './modules/auth/pages/forgot-password-page';
import { LoginPage } from './modules/auth/pages/login-page';
import { ResetPasswordPage } from './modules/auth/pages/reset-password-page';
import { SignUpPage } from './modules/auth/pages/sign-up-page';
import { HomePage } from './modules/home/pages/home-page';
import { NotFound } from './shared/pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/login" replace />
          },
          {
            path: 'activate/:token',
            element: <ActivateAccountPage />
          },
          {
            path: 'login',
            element: <LoginPage />
          },
          {
            path: 'sign-up',
            element: <SignUpPage />
          },
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />
          },
          {
            path: 'reset-password/:token',
            element: <ResetPasswordPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
