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
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-slate-100/70 px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle institutional ambient canvas */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
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
