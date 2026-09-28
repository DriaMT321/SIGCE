import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Login04Form } from '../components/Login04Form';
import { loginSchema, type LoginFormData, type LoginRole } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useTheme } from '../../../lib/theme';
import { Palette } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isInstitutional, toggleTheme } = useTheme();
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
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-slate-100/80 px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle institutional ambient radial glow based on official school colors */}
      {isInstitutional && (
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-institutional-radial opacity-[0.07] blur-3xl rounded-full" />
      )}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Theme quick switch in login header */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          title={isInstitutional ? "Cambiar a Modo Ejecutivo" : "Cambiar a Identidad Comunidad Cristiana B"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-sm text-xs text-slate-600 shadow-2xs hover:bg-white transition-all cursor-pointer"
        >
          <Palette className={`w-3.5 h-3.5 ${isInstitutional ? 'text-brand-crimson' : 'text-slate-500'}`} />
          <span className="text-[11px] font-medium hidden sm:inline">
            {isInstitutional ? 'Identidad Colegio' : 'Tema Ejecutivo'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isInstitutional
                ? 'bg-gradient-to-r from-[#ffc54c] via-[#f37022] to-[#b91329]'
                : 'bg-slate-400'
            }`}
          />
        </button>
      </div>

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
