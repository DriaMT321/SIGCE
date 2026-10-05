import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Login04Form } from '../components/Login04Form';
import { loginSchema, type LoginFormData, type LoginRole } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useTheme } from '../../../lib/theme';
import { GraduationCap } from 'lucide-react';

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Left: Brand Identity - Clean and minimal */}
      <div className="w-full lg:w-1/2 xl:w-[45%] bg-slate-900 p-8 sm:p-12 xl:p-16 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Subtle accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                SIGCE
              </h1>
              <p className="text-sm text-slate-400">
                U.E. Comunidad Cristiana B
              </p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 py-12 lg:py-16 space-y-4 max-w-md my-auto">
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight">
            Sistema Integrado de Gestión Educativa
          </h2>

          <p className="text-base text-slate-400 leading-relaxed">
            Plataforma unificada para el seguimiento pedagógico, evaluación académica y gestión integral.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[55%] min-h-screen flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white relative">
        {/* Theme Toggle */}
        <div className="flex justify-end w-full mb-6 lg:mb-0">
          <button
            type="button"
            onClick={toggleTheme}
            title={isInstitutional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-sm text-slate-600 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${isInstitutional ? 'bg-brand-600' : 'bg-slate-400'}`} />
            <span className="text-xs font-medium hidden sm:inline">
              {isInstitutional ? 'Institucional' : 'Ejecutivo'}
            </span>
          </button>
        </div>

        {/* Form */}
        <div className="my-auto w-full py-4">
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
    </div>
  );
};
