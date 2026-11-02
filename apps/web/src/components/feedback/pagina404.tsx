import { Link } from 'react-router-dom';

export const pagina404 = () => (
  <main className="pagina404" aria-labelledby="pagina404titulo">
    <div className="pagina404contenedor">
      <header className="pagina404marca">
        <span className="pagina404nombre">SIGCE</span>
        <span className="pagina404contexto">Gestión académica</span>
      </header>

      <section className="pagina404contenido">
        <div className="pagina404ilustracion" aria-hidden="true">
          <svg viewBox="0 0 240 220" fill="none">
            <path
              d="M64 26h78l36 36v132H64a10 10 0 0 1-10-10V36a10 10 0 0 1 10-10Z"
              fill="white"
              stroke="#706e64"
              strokeWidth="2"
            />
            <path d="M142 27v30a6 6 0 0 0 6 6h29" stroke="#706e64" strokeWidth="2" />
            <path d="M82 82h75M82 99h54" stroke="#d5d1c6" strokeWidth="4" strokeLinecap="round" />
            <path d="M82 123h27" stroke="#d9c56a" strokeWidth="5" strokeLinecap="round" />
            <text
              x="82"
              y="159"
              fill="#806719"
              fontFamily="var(--font-sans), sans-serif"
              fontSize="25"
              fontWeight="800"
              letterSpacing="-1.5"
            >
              404
            </text>
            <circle cx="164" cy="153" r="25" fill="#edf3ec" stroke="#496b4a" strokeWidth="3" />
            <path d="m182 171 17 17" stroke="#496b4a" strokeWidth="5" strokeLinecap="round" />
            <path
              d="M158 145h12M164 139v12"
              stroke="#496b4a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="pagina404mensaje">
          <p className="pagina404codigo">Error 404</p>
          <h1 id="pagina404titulo">No encontramos esta página.</h1>
          <p className="pagina404descripcion">
            El enlace puede estar incompleto o la dirección ya no ser válida. Puedes volver al panel
            académico o ir al acceso del sistema.
          </p>
          <nav className="pagina404acciones" aria-label="Opciones para continuar">
            <Link className="pagina404botonprincipal" to="/dashboard">
              Ir al panel académico
            </Link>
            <Link className="pagina404botonsecundario" to="/login">
              Volver al acceso
            </Link>
          </nav>
        </div>
      </section>

      <footer className="pagina404pie">
        Si escribiste la dirección manualmente, revisa que esté completa.
      </footer>
    </div>
  </main>
);
