import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Login04Form } from '../components/Login04Form';
import { loginSchema, type LoginFormData, type LoginRole } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useTheme } from '../../../lib/theme';
import { Palette, GraduationCap, Sparkles } from 'lucide-react';

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
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row overflow-x-hidden bg-white">
      {/* Columna Izquierda: Identidad Institucional Full-Bleed con los Colores Oficiales (Amarillo/Oro, Naranja, Carmesí) */}
      <div className="w-full lg:w-1/2 xl:w-[52%] bg-gradient-to-br from-[#ffc54c] via-[#f37022] to-[#b91329] p-8 sm:p-12 xl:p-16 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Luces ambientales y texturas sutiles */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-white/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-black/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute inset-0 hairline-pattern opacity-15" />

        {/* Cabecera de Marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl shrink-0">
              <GraduationCap className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white font-display leading-tight drop-shadow-xs">
                SIGCE
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                U.E. Comunidad Cristiana B
              </p>
            </div>
          </div>
        </div>

        {/* Sección Central de Alto Impacto */}
        <div className="relative z-10 py-12 lg:py-16 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Gestión Escolar 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white font-display leading-[1.15] drop-shadow-sm">
            Sistema Integrado de Control y Gestión Educativa
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans max-w-lg">
            Plataforma unificada para el seguimiento pedagógico, evaluación académica continua y gestión integral de aula.
          </p>
        </div>

        {/* Pie Institucional Izquierdo */}
        <div className="relative z-10 pt-6 border-t border-white/20 text-xs text-white/80 flex items-center justify-between font-sans">
          <span>Portal Oficial de Gestión Académica</span>
          <span className="font-semibold text-white">Cochabamba, Bolivia</span>
        </div>
      </div>

      {/* Columna Derecha: Consola de Acceso Espaciosa y Centrada (Zero Espacio Muerto) */}
      <div className="w-full lg:w-1/2 xl:w-[48%] min-h-[100dvh] flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white relative">
        {/* Theme quick switch en la esquina superior */}
        <div className="flex justify-end w-full mb-6 lg:mb-0">
          <button
            type="button"
            onClick={toggleTheme}
            title={isInstitutional ? "Cambiar a Modo Ejecutivo" : "Cambiar a Identidad Comunidad Cristiana B"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50 hover:bg-white text-xs text-slate-600 shadow-2xs transition-all cursor-pointer haptic-press"
          >
            <Palette className={`w-3.5 h-3.5 ${isInstitutional ? 'text-[#b91329]' : 'text-slate-500'}`} />
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

        {/* Contenedor del Formulario Centrado */}
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

        {/* Pie Inferior Derecho */}
        <div className="pt-6 text-center text-xs text-slate-400 border-t border-slate-100 mt-6 lg:mt-0">
          <span>© 2026 SIGCE · Plataforma Oficial de Gestión Académica</span>
        </div>
      </div>
    </div>
  );
};
