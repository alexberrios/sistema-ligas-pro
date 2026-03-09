'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const RegisterSchema = Yup.object().shape({
  organizationName: Yup.string().required('Requerido'),
  organizationSlug: Yup.string().matches(/^[a-z0-9-]+$/, 'Solo letras minúsculas y guiones').required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
  rut: Yup.string().required('Requerido'),
  firstName: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
});

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await api.post('/auth/register-league', values);
      const { access_token, user } = response.data;
      
      Cookies.set('southgo_token', access_token, { expires: 1 });
      Cookies.set('southgo_role', user.role, { expires: 1 });
      
      toast.success('Liga creada con éxito');
      router.push('/tournaments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar la liga');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400 mb-2 text-center">Registrar Liga</h2>
        <p className="text-gray-400 text-center mb-8 font-light">Crea tu organización y tu cuenta de administrador en un solo paso.</p>

        <Formik
          initialValues={{ organizationName: '', organizationSlug: '', email: '', password: '', rut: '', firstName: '', lastName: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field name="firstName" placeholder="Nombre" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                  <ErrorMessage name="firstName" component="div" className="text-red-400 text-xs mt-1 ml-1" />
                </div>
                <div>
                  <Field name="lastName" placeholder="Apellido" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                  <ErrorMessage name="lastName" component="div" className="text-red-400 text-xs mt-1 ml-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field name="rut" placeholder="RUT / DNI" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                  <ErrorMessage name="rut" component="div" className="text-red-400 text-xs mt-1 ml-1" />
                </div>
                <div>
                  <Field name="email" type="email" placeholder="Correo" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                  <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1 ml-1" />
                </div>
              </div>

              <div>
                <Field name="password" type="password" placeholder="Contraseña" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1 ml-1" />
              </div>

              <div className="h-px w-full bg-gray-800 my-2"></div>

              <div>
                <Field name="organizationName" placeholder="Nombre de la Liga (Ej: Liga Sur)" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                <ErrorMessage name="organizationName" component="div" className="text-red-400 text-xs mt-1 ml-1" />
              </div>

              <div>
                <Field name="organizationSlug" placeholder="Identificador (ej: liga-sur-2024)" className="w-full bg-gray-800/60 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-gray-800/80 transition-all" />
                <ErrorMessage name="organizationSlug" component="div" className="text-red-400 text-xs mt-1 ml-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl font-bold text-white shadow-lg shadow-teal-500/25 hover:-translate-y-1 hover:shadow-teal-500/40 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creando...' : 'Crear Puesto de Admin'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
