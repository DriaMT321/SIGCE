export function seleccionarcursoauditoria<T extends { text: string }>(
  cursos: T[],
  argumento?: string,
  limitepredeterminado = 3,
): T[] {
  const entrada = argumento?.trim();
  let cursosseleccionados: T[];

  if (!entrada) {
    cursosseleccionados = cursos.slice(0, limitepredeterminado);
  } else {
    const limite = Number(entrada);
    if (Number.isFinite(limite)) {
      if (!Number.isSafeInteger(limite) || limite <= 0) {
        throw new Error('El límite de cursos debe ser un entero mayor que cero.');
      }
      cursosseleccionados = cursos.slice(0, limite);
    } else {
      const filtro = entrada.toLocaleLowerCase('es');
      cursosseleccionados = cursos.filter((curso) =>
        curso.text.toLocaleLowerCase('es').includes(filtro),
      );
    }
  }

  if (cursosseleccionados.length === 0) {
    throw new Error('No hay cursos que coincidan con la selección para auditar.');
  }
  return cursosseleccionados;
}
