'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { apiClient, getApiErrorMessage, type LoginPayload } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().required('Requerido'),
});

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (
    values: LoginPayload,
    { setSubmitting }: FormikHelpers<LoginPayload>,
  ) => {
    try {
      const response = await apiClient.post('/auth/login', values);
      const { access_token, user } = response.data;
      
      Cookies.set('southgo_token', access_token, { expires: 1 });
      Cookies.set('southgo_role', user.role, { expires: 1 });
      
      toast.success(`Bienvenido ${user.firstName || ''}`);
      
      // Redirect based on simulated role logic or saved role
      if (user.role === 'SUPERADMIN') {
        router.push('/management');
      } else {
        router.push('/tournaments');
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al iniciar sesión'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Ingresar</h2>
        <p className="text-gray-400 text-center mb-8 font-light">Accede a tu panel de administración.</p>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1 ml-1" />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1 ml-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full py-3.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/25 hover:-translate-y-1 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
