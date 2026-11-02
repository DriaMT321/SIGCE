import * as React from 'react';

import { cn } from '@/lib/utilidades';

const tarjeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className: clasenombre, ...propiedades }, referencia) => (
    <div
      ref={referencia}
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-[0_1px_3px_0_rgba(15,23,42,0.03),0_1px_2px_-1px_rgba(15,23,42,0.02)] transition-all',
        clasenombre,
      )}
      {...propiedades}
    />
  ),
);
tarjeta.displayName = 'Card';

const tarjetaencabezado = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className: clasenombre, ...propiedades }, referencia) => (
    <div
      ref={referencia}
      className={cn('flex flex-col space-y-1.5 p-6 border-b border-slate-100/80', clasenombre)}
      {...propiedades}
    />
  ),
);
tarjetaencabezado.displayName = 'CardHeader';

const tarjetatitulo = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className: clasenombre, ...propiedades }, referencia) => (
  <h3
    ref={referencia}
    className={cn(
      'text-lg font-bold leading-tight tracking-tight text-slate-900 font-display',
      clasenombre,
    )}
    {...propiedades}
  />
));
tarjetatitulo.displayName = 'CardTitle';

const tarjetadescripcion = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className: clasenombre, ...propiedades }, referencia) => (
  <p
    ref={referencia}
    className={cn('text-xs text-slate-500 font-normal leading-relaxed', clasenombre)}
    {...propiedades}
  />
));
tarjetadescripcion.displayName = 'CardDescription';

const tarjetacontenido = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className: clasenombre, ...propiedades }, referencia) => (
    <div ref={referencia} className={cn('p-6', clasenombre)} {...propiedades} />
  ),
);
tarjetacontenido.displayName = 'CardContent';

const tarjetapie = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className: clasenombre, ...propiedades }, referencia) => (
    <div
      ref={referencia}
      className={cn('flex items-center p-6 pt-0 border-t border-slate-100/80 mt-6', clasenombre)}
      {...propiedades}
    />
  ),
);
tarjetapie.displayName = 'CardFooter';

export {
  tarjeta,
  tarjetaencabezado,
  tarjetapie,
  tarjetatitulo,
  tarjetadescripcion,
  tarjetacontenido,
};
