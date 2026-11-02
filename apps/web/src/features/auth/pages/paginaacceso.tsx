import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Sesion04Formulario } from '../components/formularioacceso04';
import {
  sesionesquema,
  type sesionformulariodatos,
  type sesionrol,
} from '../schemas/esquemadeautenticacion';
import { gestionusoautenticacion } from '../presentation/contextodeautenticacion';
import { usotema } from '../../../lib/tema';

export const SesionPagina = () => {
  const navegar = useNavigate();
  const autenticacion = gestionusoautenticacion();
  const { isInstitutional: esinstitucional, toggleTheme: alternartema } = usotema();
  const [seleccionadorol, establecerseleccionadorol] = useState<sesionrol>('ADMINISTRATIVE');
  const [errormensaje, establecererrormensaje] = useState<string | null>(null);
  const [escarga, establecerescarga] = useState(false);

  const {
    register: registrar,
    handleSubmit: manejarenviar,
    setValue: establecervalor,
    clearErrors: limpiarerrores,
    formState: { errors: errores },
  } = useForm<sesionformulariodatos>({
    resolver: zodResolver(sesionesquema),
    defaultValues: {
      role: 'ADMINISTRATIVE',
      identifier: '',
      secret: '',
      secondaryIdentifier: '',
    },
  });

  const manejarrolcambio = (rol: sesionrol) => {
    establecerseleccionadorol(rol);
    establecervalor('role', rol);
    limpiarerrores();
    establecererrormensaje(null);
  };

  const onenviar = async (datos: sesionformulariodatos) => {
    establecerescarga(true);
    establecererrormensaje(null);

    try {
      const sesion = await autenticacion.sesion(datos);
      navegar(sesion.user.role === 'STUDENT' ? '/dashboard/schedules' : '/dashboard');
    } catch (error: unknown) {
      establecererrormensaje(
        error instanceof Error
          ? error.message
          : 'Las credenciales no son válidas o no se pudo conectar con el servidor',
      );
    } finally {
      establecerescarga(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f6f1] text-[#292820] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <section className="flex min-h-[18rem] flex-col justify-between border-b border-[#e7e4da] bg-[#fbfaf6] p-6 sm:min-h-[22rem] sm:p-10 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-12 xl:p-16">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#d4c476] bg-[#f4ebcb] font-extrabold text-[#806719]">
            S
          </span>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">SIGCE</h1>
            <p className="text-xs text-[#706e64]">U.E. Comunidad Cristiana B</p>
          </div>
        </div>

        <div className="my-12 max-w-xl lg:my-auto lg:py-16">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
            La información escolar, en un solo lugar.
          </h2>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#706e64]">
            Acceso al seguimiento académico y la comunicación entre la unidad educativa y las
            familias.
          </p>
        </div>

        <p className="text-xs text-[#706e64]">
          Sistema Integrado de Gestión Educativa · Gestión 2026
        </p>
      </section>

      <section className="flex min-h-screen flex-col bg-white p-6 sm:p-10 lg:justify-center lg:p-12 xl:p-16">
        <div className="mb-8 flex justify-end lg:absolute lg:right-8 lg:top-8">
          <button
            type="button"
            onClick={alternartema}
            title={esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'}
            aria-label={
              esinstitucional ? 'Cambiar a tema ejecutivo' : 'Cambiar a tema institucional'
            }
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#8c897e] bg-[#fbfaf6] px-3 text-sm text-[#706e64] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-primary">
              {esinstitucional ? 'Institucional' : 'Ejecutivo'}
            </span>
          </button>
        </div>

        <div className="my-auto w-full py-4">
          <Sesion04Formulario
            role={seleccionadorol}
            register={registrar}
            errors={errores}
            onRoleChange={manejarrolcambio}
            onSubmit={manejarenviar(onenviar)}
            isLoading={escarga}
            errorMessage={errormensaje}
            onActivateStudent={() => navegar('/student/activate')}
          />
        </div>
      </section>
    </div>
  );
};
