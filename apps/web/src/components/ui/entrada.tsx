import * as React from 'react';

import { cn } from '@/lib/utilidades';

const Entrada = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className: clasenombre, type: escribirtexto, ...propiedades }, referencia) => {
    return (
      <input
        type={escribirtexto}
        className={cn(
          'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs',
          clasenombre,
        )}
        ref={referencia}
        {...propiedades}
      />
    );
  },
);
Entrada.displayName = 'Entrada';

export { Entrada };
