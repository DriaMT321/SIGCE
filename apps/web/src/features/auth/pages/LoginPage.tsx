import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Login04Form } from '../components/Login04Form';
import { loginSchema, type LoginFormData, type LoginRole } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<LoginRole>('ADMINISTRATIVE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'ADMINISTRATIVE',
      identifier: '',
      secret: '',
      secondaryIdentifier: '',
    },
  });

  const handleRoleChange = (role: LoginRole) => {
    setSelectedRole(role);
    setValue('role', role);
    clearErrors();
    setErrorMessage(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const response = axios.isAxiosError(err) ? err.response : undefined;
      setErrorMessage(
        response?.data?.details?.message ||
          response?.data?.message ||
          'Las credenciales no son válidas o no se pudo conectar con el servidor',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F8C311] via-[#F37022] to-[#B91329] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6">
        <div className="text-center text-white drop-shadow-md">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]">Gestión Académica</p>
          <p className="mt-2 text-sm text-white/90">Plataforma Administrativa e Interoperabilidad SIE</p>
        </div>
        <Login04Form
          role={selectedRole}
          register={register}
          errors={errors}
          onRoleChange={handleRoleChange}
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
