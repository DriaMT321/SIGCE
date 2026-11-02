import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utilidades';

const etiquetavariantes = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Etiqueta = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof etiquetavariantes>
>(({ className: clasenombre, ...propiedades }, referencia) => (
  <LabelPrimitive.Root
    ref={referencia}
    className={cn(etiquetavariantes(), clasenombre)}
    {...propiedades}
  />
));
Etiqueta.displayName = LabelPrimitive.Root.displayName;

export { Etiqueta };
