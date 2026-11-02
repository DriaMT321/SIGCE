import * as ts from 'typescript';

function agregaridentificadores(
  ambitos: Map<ts.Node, Map<string, ts.Identifier>>,
  ambito: ts.Node,
  nombre: ts.BindingName | ts.Identifier | undefined,
): void {
  if (!nombre) return;
  let nombres = ambitos.get(ambito);
  if (!nombres) {
    nombres = new Map();
    ambitos.set(ambito, nombres);
  }
  if (ts.isIdentifier(nombre)) {
    nombres.set(nombre.text, nombre);
    return;
  }
  if (ts.isArrayBindingPattern(nombre)) {
    for (const elemento of nombre.elements) {
      if (ts.isBindingElement(elemento)) agregaridentificadores(ambitos, ambito, elemento.name);
    }
    return;
  }
  for (const elemento of nombre.elements) agregaridentificadores(ambitos, ambito, elemento.name);
}

function creararchivofuente(source: string): ts.SourceFile {
  return ts.createSourceFile(
    'architecture-global-reference.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
}

function crearambitos(archivofuente: ts.SourceFile): Map<ts.Node, Map<string, ts.Identifier>> {
  const ambitos = new Map<ts.Node, Map<string, ts.Identifier>>();
  const buscarambito = (desde: ts.Node, coincide: (nodo: ts.Node) => boolean): ts.Node => {
    let actual = desde.parent;
    while (actual && !coincide(actual)) actual = actual.parent;
    return actual ?? archivofuente;
  };

  const registrar = (nodo: ts.Node): void => {
    if (ts.isVariableDeclaration(nodo)) {
      const esbloque =
        ts.isVariableDeclarationList(nodo.parent) &&
        (nodo.parent.flags & ts.NodeFlags.BlockScoped) !== 0;
      const ambito = esbloque
        ? buscarambito(
            nodo,
            (actual) =>
              ts.isBlock(actual) ||
              ts.isForStatement(actual) ||
              ts.isForInStatement(actual) ||
              ts.isForOfStatement(actual) ||
              ts.isCaseBlock(actual) ||
              ts.isModuleBlock(actual) ||
              ts.isSourceFile(actual),
          )
        : buscarambito(
            nodo,
            (actual) =>
              ts.isFunctionLike(actual) || ts.isModuleBlock(actual) || ts.isSourceFile(actual),
          );
      agregaridentificadores(ambitos, ambito, nodo.name);
    } else if (ts.isParameter(nodo)) {
      agregaridentificadores(ambitos, buscarambito(nodo, ts.isFunctionLike), nodo.name);
    } else if (ts.isFunctionDeclaration(nodo) || ts.isClassDeclaration(nodo)) {
      agregaridentificadores(
        ambitos,
        buscarambito(
          nodo,
          (actual) =>
            ts.isBlock(actual) ||
            ts.isCaseBlock(actual) ||
            ts.isModuleBlock(actual) ||
            ts.isSourceFile(actual),
        ),
        nodo.name,
      );
    } else if (ts.isFunctionExpression(nodo) || ts.isClassExpression(nodo)) {
      agregaridentificadores(ambitos, nodo, nodo.name);
    } else if (ts.isCatchClause(nodo)) {
      agregaridentificadores(ambitos, nodo, nodo.variableDeclaration?.name);
    } else if (ts.isImportClause(nodo)) {
      agregaridentificadores(ambitos, archivofuente, nodo.name);
    } else if (ts.isImportSpecifier(nodo) || ts.isNamespaceImport(nodo)) {
      agregaridentificadores(ambitos, archivofuente, nodo.name);
    } else if (ts.isImportEqualsDeclaration(nodo)) {
      agregaridentificadores(ambitos, archivofuente, nodo.name);
    }
    ts.forEachChild(nodo, registrar);
  };

  registrar(archivofuente);
  return ambitos;
}

function resolveridentificador(
  nodo: ts.Identifier,
  ambitos: ReadonlyMap<ts.Node, ReadonlyMap<string, ts.Identifier>>,
): ts.Identifier | undefined {
  let actual: ts.Node | undefined = nodo.parent;
  while (actual) {
    const declaracion = ambitos.get(actual)?.get(nodo.text);
    if (declaracion) return declaracion;
    actual = actual.parent;
  }
  return undefined;
}

export function obtenerreferenciasglobales(
  source: string,
  globales: ReadonlySet<string>,
  archivofuente = creararchivofuente(source),
): Set<ts.Identifier> {
  const ambitos = crearambitos(archivofuente);

  const eslocal = (nodo: ts.Identifier): boolean => {
    let actual: ts.Node | undefined = nodo.parent;
    while (actual) {
      if (ambitos.get(actual)?.has(nodo.text)) return true;
      actual = actual.parent;
    }
    return false;
  };

  const esnombredeclarado = (nodo: ts.Identifier): boolean => {
    const padre = nodo.parent;
    return (
      (ts.isVariableDeclaration(padre) && padre.name === nodo) ||
      (ts.isParameter(padre) && padre.name === nodo) ||
      ((ts.isFunctionDeclaration(padre) ||
        ts.isClassDeclaration(padre) ||
        ts.isFunctionExpression(padre) ||
        ts.isClassExpression(padre)) &&
        padre.name === nodo) ||
      (ts.isBindingElement(padre) && padre.name === nodo) ||
      ((ts.isImportSpecifier(padre) ||
        ts.isNamespaceImport(padre) ||
        ts.isImportEqualsDeclaration(padre)) &&
        padre.name === nodo) ||
      (ts.isImportClause(padre) && padre.name === nodo)
    );
  };

  const esnombredepropiedad = (nodo: ts.Identifier): boolean => {
    const padre = nodo.parent;
    return (
      (ts.isPropertyAccessExpression(padre) && padre.name === nodo) ||
      ((ts.isPropertyAssignment(padre) ||
        ts.isMethodDeclaration(padre) ||
        ts.isMethodSignature(padre) ||
        ts.isPropertyDeclaration(padre) ||
        ts.isPropertySignature(padre) ||
        ts.isEnumMember(padre)) &&
        padre.name === nodo) ||
      ((ts.isBindingElement(padre) || ts.isImportSpecifier(padre)) && padre.propertyName === nodo)
    );
  };

  const encontradas = new Set<ts.Identifier>();
  const visitar = (nodo: ts.Node): void => {
    if (
      ts.isIdentifier(nodo) &&
      globales.has(nodo.text) &&
      !esnombredeclarado(nodo) &&
      !esnombredepropiedad(nodo) &&
      !eslocal(nodo) &&
      !(
        (ts.isTypeReferenceNode(nodo.parent) && nodo.parent.typeName === nodo) ||
        (ts.isTypeQueryNode(nodo.parent) && nodo.parent.exprName === nodo)
      )
    ) {
      encontradas.add(nodo);
    }
    ts.forEachChild(nodo, visitar);
  };

  visitar(archivofuente);
  return encontradas;
}

export function tienereferenciaglobal(source: string, globales: ReadonlySet<string>): boolean {
  return obtenerreferenciasglobales(source, globales).size > 0;
}

function nombredeacceso(nodo: ts.Expression | undefined): string | undefined {
  if (!nodo) return undefined;
  if (ts.isPropertyAccessExpression(nodo)) return nodo.name.text;
  if (ts.isElementAccessExpression(nodo)) {
    return textosimple(nodo.argumentExpression);
  }
  return undefined;
}

function textosimple(nodo: ts.Expression | undefined): string | undefined {
  if (!nodo) return undefined;
  if (ts.isStringLiteral(nodo) || ts.isNoSubstitutionTemplateLiteral(nodo)) {
    return nodo.text;
  }
  if (
    ts.isParenthesizedExpression(nodo) ||
    ts.isAsExpression(nodo) ||
    ts.isTypeAssertionExpression(nodo) ||
    ts.isNonNullExpression(nodo) ||
    ts.isSatisfiesExpression(nodo)
  ) {
    return textosimple(nodo.expression);
  }
  if (ts.isBinaryExpression(nodo) && nodo.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const izquierda = textosimple(nodo.left);
    const derecha = textosimple(nodo.right);
    if (izquierda !== undefined && derecha !== undefined) return izquierda + derecha;
  }
  return undefined;
}

function rutadeacceso(nodo: ts.Expression): { raiz: string; ruta: string[] } | undefined {
  const ruta: string[] = [];
  let actual = nodo;
  while (ts.isPropertyAccessExpression(actual) || ts.isElementAccessExpression(actual)) {
    ruta.unshift(
      ts.isPropertyAccessExpression(actual)
        ? actual.name.text
        : (textosimple(actual.argumentExpression) ?? '*'),
    );
    actual = actual.expression;
  }
  return ts.isIdentifier(actual) ? { raiz: actual.text, ruta } : undefined;
}

function raizdeacceso(nodo: ts.Expression): ts.Identifier | undefined {
  let actual = nodo;
  while (ts.isPropertyAccessExpression(actual) || ts.isElementAccessExpression(actual)) {
    actual = actual.expression;
  }
  return ts.isIdentifier(actual) ? actual : undefined;
}

function esreferenciareflectget(
  expresion: ts.Expression,
  globales: ReadonlySet<ts.Identifier>,
  reflectos: ReadonlySet<ts.Identifier>,
  funcionesget: ReadonlySet<ts.Identifier>,
  ambitos: ReadonlyMap<ts.Node, ReadonlyMap<string, ts.Identifier>>,
): boolean {
  if (
    ts.isIdentifier(expresion) &&
    funcionesget.has(resolveridentificador(expresion, ambitos) ?? expresion)
  ) {
    return true;
  }
  const acceso = rutadeacceso(expresion);
  const raiz = raizdeacceso(expresion);
  if (!acceso || !raiz) return false;
  const declaracion = resolveridentificador(raiz, ambitos);
  const esglobal = declaracion
    ? globales.has(declaracion)
    : ['globalThis', 'window', 'self'].includes(raiz.text);
  const esreflect = declaracion ? reflectos.has(declaracion) : raiz.text === 'Reflect';
  return (
    (esglobal && acceso.ruta.join('.') === 'Reflect.get') ||
    (esreflect && acceso.ruta.join('.') === 'get')
  );
}

function nivelesconstructor(sourceFile: ts.SourceFile): {
  niveles: Map<ts.Identifier, number>;
  obtenernivel: (expresion: ts.Expression | undefined) => number;
  esconstructreflect: (expresion: ts.Expression) => boolean;
} {
  const globales = new Set<ts.Identifier>();
  const reflectos = new Set<ts.Identifier>();
  const funcionesget = new Set<ts.Identifier>();
  const funcionesconstruct = new Set<ts.Identifier>();
  const niveles = new Map<ts.Identifier, number>();
  const ambitos = crearambitos(sourceFile);
  const referenciasconstructores = obtenerreferenciasglobales(
    sourceFile.text,
    new Set([
      'Object',
      'Array',
      'String',
      'Number',
      'Boolean',
      'Date',
      'RegExp',
      'Error',
      'TypeError',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'Promise',
      'BigInt',
      'Symbol',
    ]),
    sourceFile,
  );
  const declaraciones: ts.VariableDeclaration[] = [];
  const asignaciones: ts.BinaryExpression[] = [];
  const asignacionespropiedad: ts.BinaryExpression[] = [];
  const inicializadores = new Map<ts.Identifier, ts.Expression>();

  const recopilar = (nodo: ts.Node): void => {
    if (ts.isVariableDeclaration(nodo)) {
      declaraciones.push(nodo);
      if (ts.isIdentifier(nodo.name) && nodo.initializer) {
        inicializadores.set(nodo.name, nodo.initializer);
      }
    }
    if ((ts.isFunctionDeclaration(nodo) || ts.isClassDeclaration(nodo)) && nodo.name) {
      niveles.set(nodo.name, 1);
    }
    if (ts.isBinaryExpression(nodo) && nodo.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      if (ts.isIdentifier(nodo.left)) asignaciones.push(nodo);
      if (ts.isPropertyAccessExpression(nodo.left) || ts.isElementAccessExpression(nodo.left)) {
        asignacionespropiedad.push(nodo);
      }
    }
    ts.forEachChild(nodo, recopilar);
  };
  recopilar(sourceFile);

  const esgetreflect = (expresion: ts.Expression): boolean =>
    esreferenciareflectget(expresion, globales, reflectos, funcionesget, ambitos);
  const espropiedadfuncion = (expresion: ts.Expression): boolean => {
    if (!ts.isPropertyAccessExpression(expresion)) return false;
    const nombre = expresion.name.text;
    let objeto = expresion.expression;
    while (ts.isParenthesizedExpression(objeto)) objeto = objeto.expression;

    const contienepropiedad = (declaracion: ts.ClassLikeDeclaration): boolean =>
      declaracion.members.some((miembro) => {
        if (!ts.isMethodDeclaration(miembro) && !ts.isPropertyDeclaration(miembro)) {
          return false;
        }
        const nombremiembro =
          ts.isIdentifier(miembro.name) || ts.isStringLiteral(miembro.name)
            ? miembro.name.text
            : undefined;
        if (nombremiembro !== nombre) return false;
        const esestatico = ts.canHaveModifiers(miembro)
          ? (ts
              .getModifiers(miembro)
              ?.some((modificador) => modificador.kind === ts.SyntaxKind.StaticKeyword) ?? false)
          : false;
        return (
          esestatico &&
          (ts.isMethodDeclaration(miembro) ||
            (miembro.initializer &&
              (ts.isArrowFunction(miembro.initializer) ||
                ts.isFunctionExpression(miembro.initializer))))
        );
      });
    const contienepropiedaddelobjeto = (declaracion: ts.ObjectLiteralExpression): boolean =>
      declaracion.properties.some((miembro) => {
        const nombremiembro =
          ts.isIdentifier(miembro.name) || ts.isStringLiteral(miembro.name)
            ? miembro.name.text
            : undefined;
        return (
          nombremiembro === nombre &&
          (ts.isMethodDeclaration(miembro) ||
            (ts.isPropertyAssignment(miembro) &&
              (ts.isArrowFunction(miembro.initializer) ||
                ts.isFunctionExpression(miembro.initializer))))
        );
      });
    if (ts.isObjectLiteralExpression(objeto)) return contienepropiedaddelobjeto(objeto);
    if (ts.isClassExpression(objeto)) return contienepropiedad(objeto);
    if (!ts.isIdentifier(objeto)) return false;
    const vinculacion = resolveridentificador(objeto, ambitos);
    if (!vinculacion) return false;
    if (
      asignacionespropiedad.some((asignacion) => {
        if (asignacion.pos >= expresion.pos) return false;
        const izquierda = asignacion.left;
        const raiz = raizdeacceso(izquierda);
        return (
          nombredeacceso(izquierda) === nombre &&
          raiz !== undefined &&
          resolveridentificador(raiz, ambitos) === vinculacion
        );
      })
    ) {
      return false;
    }
    if (ts.isClassDeclaration(vinculacion.parent) && vinculacion.parent.name === vinculacion) {
      return contienepropiedad(vinculacion.parent);
    }
    const inicializador = inicializadores.get(vinculacion);
    if (!inicializador) return false;
    if (ts.isObjectLiteralExpression(inicializador)) {
      return contienepropiedaddelobjeto(inicializador);
    }
    if (ts.isClassExpression(inicializador)) return contienepropiedad(inicializador);
    if (ts.isNewExpression(inicializador) && ts.isIdentifier(inicializador.expression)) {
      const clase = resolveridentificador(inicializador.expression, ambitos);
      if (clase && ts.isClassDeclaration(clase.parent) && clase.parent.name === clase) {
        return clase.parent.members.some((miembro) => {
          if (!ts.isMethodDeclaration(miembro) && !ts.isPropertyDeclaration(miembro)) {
            return false;
          }
          const nombremiembro =
            ts.isIdentifier(miembro.name) || ts.isStringLiteral(miembro.name)
              ? miembro.name.text
              : undefined;
          const esestatico = ts.canHaveModifiers(miembro)
            ? (ts
                .getModifiers(miembro)
                ?.some((modificador) => modificador.kind === ts.SyntaxKind.StaticKeyword) ?? false)
            : false;
          return (
            !esestatico &&
            nombremiembro === nombre &&
            (ts.isMethodDeclaration(miembro) ||
              (miembro.initializer &&
                (ts.isArrowFunction(miembro.initializer) ||
                  ts.isFunctionExpression(miembro.initializer))))
          );
        });
      }
    }
    return false;
  };
  const esconstructreflect = (expresion: ts.Expression): boolean => {
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return Boolean(declaracion && funcionesconstruct.has(declaracion));
    }
    const acceso = rutadeacceso(expresion);
    const raiz = raizdeacceso(expresion);
    if (!acceso || !raiz) return false;
    const declaracion = resolveridentificador(raiz, ambitos);
    const esglobal = declaracion
      ? globales.has(declaracion)
      : ['globalThis', 'window', 'self'].includes(raiz.text);
    const esreflect = declaracion ? reflectos.has(declaracion) : raiz.text === 'Reflect';
    return (
      (esglobal && acceso.ruta.join('.') === 'Reflect.construct') ||
      (esreflect && acceso.ruta.join('.') === 'construct')
    );
  };
  const nivel = (expresion: ts.Expression | undefined): number => {
    if (!expresion) return 0;
    while (
      ts.isParenthesizedExpression(expresion) ||
      ts.isAsExpression(expresion) ||
      ts.isTypeAssertionExpression(expresion) ||
      ts.isNonNullExpression(expresion) ||
      ts.isSatisfiesExpression(expresion)
    ) {
      expresion = expresion.expression;
    }
    if (
      ts.isArrowFunction(expresion) ||
      ts.isFunctionExpression(expresion) ||
      ts.isClassExpression(expresion)
    ) {
      return 1;
    }
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return declaracion
        ? (niveles.get(declaracion) ?? 0)
        : referenciasconstructores.has(expresion)
          ? 1
          : 0;
    }
    if (
      (ts.isPropertyAccessExpression(expresion) || ts.isElementAccessExpression(expresion)) &&
      nombredeacceso(expresion) === 'constructor'
    ) {
      return nivel(expresion.expression) + 1;
    }
    if (
      (ts.isPropertyAccessExpression(expresion) || ts.isElementAccessExpression(expresion)) &&
      ['call', 'apply', 'bind'].includes(nombredeacceso(expresion) ?? '')
    ) {
      return nivel(expresion.expression);
    }
    if (espropiedadfuncion(expresion)) return 1;
    if (
      ts.isCallExpression(expresion) &&
      esgetreflect(expresion.expression) &&
      textosimple(expresion.arguments[1]) === 'constructor'
    ) {
      return nivel(expresion.arguments[0]) + 1;
    }
    return 0;
  };

  let cambio = true;
  while (cambio) {
    cambio = false;
    const agregar = (nombre: ts.Identifier, valor: ts.Expression | undefined): void => {
      const encontrado = nivel(valor);
      if (encontrado > (niveles.get(nombre) ?? 0)) {
        niveles.set(nombre, encontrado);
        cambio = true;
      }
    };

    for (const declaracion of declaraciones) {
      if (!declaracion.initializer) continue;
      if (ts.isIdentifier(declaracion.name)) {
        agregar(declaracion.name, declaracion.initializer);
        const acceso = rutadeacceso(declaracion.initializer);
        const raiz = raizdeacceso(declaracion.initializer);
        const raizdeclarada = raiz && resolveridentificador(raiz, ambitos);
        const esglobal = raiz
          ? raizdeclarada
            ? globales.has(raizdeclarada)
            : ['globalThis', 'window', 'self'].includes(raiz.text)
          : false;
        const esreflect = raiz
          ? raizdeclarada
            ? reflectos.has(raizdeclarada)
            : raiz.text === 'Reflect'
          : false;
        if (acceso && esglobal && acceso.ruta.length === 0) {
          if (!globales.has(declaracion.name)) {
            globales.add(declaracion.name);
            cambio = true;
          }
        }
        if (
          acceso &&
          ((esglobal && acceso.ruta.join('.') === 'Reflect') ||
            (esreflect && acceso.ruta.length === 0)) &&
          !reflectos.has(declaracion.name)
        ) {
          reflectos.add(declaracion.name);
          cambio = true;
        }
        if (esgetreflect(declaracion.initializer) && !funcionesget.has(declaracion.name)) {
          funcionesget.add(declaracion.name);
          cambio = true;
        }
        if (
          esconstructreflect(declaracion.initializer) &&
          !funcionesconstruct.has(declaracion.name)
        ) {
          funcionesconstruct.add(declaracion.name);
          cambio = true;
        }
      } else if (ts.isObjectBindingPattern(declaracion.name)) {
        const base = nivel(declaracion.initializer);
        const raiz = raizdeacceso(declaracion.initializer);
        const declaracionraiz = raiz && resolveridentificador(raiz, ambitos);
        const esglobal = raiz
          ? declaracionraiz
            ? globales.has(declaracionraiz)
            : ['globalThis', 'window', 'self'].includes(raiz.text)
          : false;
        const esreflect = raiz
          ? declaracionraiz
            ? reflectos.has(declaracionraiz)
            : raiz.text === 'Reflect'
          : false;
        for (const elemento of declaracion.name.elements) {
          if (!ts.isBindingElement(elemento) || !ts.isIdentifier(elemento.name)) continue;
          const propiedad = elemento.propertyName ?? elemento.name;
          const nombrepropiedad =
            ts.isIdentifier(propiedad) || ts.isStringLiteral(propiedad)
              ? propiedad.text
              : undefined;
          if (
            esglobal &&
            ['globalThis', 'window', 'self'].includes(nombrepropiedad ?? '') &&
            !globales.has(elemento.name)
          ) {
            globales.add(elemento.name);
            cambio = true;
          }
          if (esglobal && nombrepropiedad === 'Reflect' && !reflectos.has(elemento.name)) {
            reflectos.add(elemento.name);
            cambio = true;
          }
          if (esreflect && nombrepropiedad === 'get' && !funcionesget.has(elemento.name)) {
            funcionesget.add(elemento.name);
            cambio = true;
          }
          if (
            esreflect &&
            nombrepropiedad === 'construct' &&
            !funcionesconstruct.has(elemento.name)
          ) {
            funcionesconstruct.add(elemento.name);
            cambio = true;
          }
          if (nombrepropiedad === 'constructor' && base + 1 > (niveles.get(elemento.name) ?? 0)) {
            niveles.set(elemento.name, base + 1);
            cambio = true;
          }
        }
      }
    }
    for (const asignacion of asignaciones) {
      if (ts.isIdentifier(asignacion.left)) {
        const declaracion = resolveridentificador(asignacion.left, ambitos);
        if (declaracion) {
          agregar(declaracion, asignacion.right);
          if (esconstructreflect(asignacion.right) && !funcionesconstruct.has(declaracion)) {
            funcionesconstruct.add(declaracion);
            cambio = true;
          }
        }
      }
    }
  }
  return { niveles, obtenernivel: nivel, esconstructreflect };
}

function tieneejecucionporconstructor(source: string): boolean {
  const archivofuente = creararchivofuente(source);
  const analisis = nivelesconstructor(archivofuente);
  let encontrado = false;
  const visitar = (nodo: ts.Node): void => {
    if (encontrado) return;
    if (
      (ts.isCallExpression(nodo) || ts.isNewExpression(nodo)) &&
      analisis.obtenernivel(nodo.expression) >= 2
    ) {
      encontrado = true;
      return;
    }
    if (
      ts.isCallExpression(nodo) &&
      analisis.esconstructreflect(nodo.expression) &&
      analisis.obtenernivel(nodo.arguments[0]) >= 2
    ) {
      encontrado = true;
      return;
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(archivofuente);
  return encontrado;
}

export function tieneejecuciondinamica(source: string): boolean {
  return (
    tieneejecucionporconstructor(source) ||
    tieneevaluadorglobal(source) ||
    tienetemporizadorconcodigo(source)
  );
}

function tienetemporizadorconcodigo(source: string): boolean {
  const archivofuente = creararchivofuente(source);
  const ambitos = crearambitos(archivofuente);
  const referencias = obtenerreferenciasglobales(
    source,
    new Set(['setTimeout', 'setInterval']),
    archivofuente,
  );
  const globales = new Set<ts.Identifier>();
  const temporizadores = new Set<ts.Identifier>();
  const cadenas = new Set<ts.Identifier>();
  const declaraciones: ts.VariableDeclaration[] = [];
  const asignaciones: ts.BinaryExpression[] = [];
  const desenrollar = (expresion: ts.Expression): ts.Expression => {
    while (
      ts.isParenthesizedExpression(expresion) ||
      ts.isAsExpression(expresion) ||
      ts.isTypeAssertionExpression(expresion) ||
      ts.isNonNullExpression(expresion) ||
      ts.isSatisfiesExpression(expresion)
    ) {
      expresion = expresion.expression;
    }
    return expresion;
  };
  const esraizglobal = (expresion: ts.Expression): boolean => {
    const raiz = raizdeacceso(expresion);
    if (!raiz) return false;
    const declaracion = resolveridentificador(raiz, ambitos);
    return declaracion
      ? globales.has(declaracion)
      : ['globalThis', 'window', 'self'].includes(raiz.text);
  };
  const esreferenciatemporizador = (expresion: ts.Expression): boolean => {
    expresion = desenrollar(expresion);
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return referencias.has(expresion) || Boolean(declaracion && temporizadores.has(declaracion));
    }
    if (
      (ts.isPropertyAccessExpression(expresion) || ts.isElementAccessExpression(expresion)) &&
      ['call', 'apply'].includes(nombredeacceso(expresion) ?? '')
    ) {
      return esreferenciatemporizador(expresion.expression);
    }
    const acceso = rutadeacceso(expresion);
    return Boolean(
      acceso &&
      esraizglobal(expresion) &&
      acceso.ruta.length === 1 &&
      ['setTimeout', 'setInterval'].includes(acceso.ruta[0] ?? ''),
    );
  };
  const esexpresioncadena = (expresion: ts.Expression | undefined): boolean => {
    if (!expresion) return false;
    expresion = desenrollar(expresion);
    if (
      ts.isStringLiteral(expresion) ||
      ts.isNoSubstitutionTemplateLiteral(expresion) ||
      ts.isTemplateExpression(expresion)
    ) {
      return true;
    }
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return Boolean(declaracion && cadenas.has(declaracion));
    }
    return (
      ts.isBinaryExpression(expresion) &&
      expresion.operatorToken.kind === ts.SyntaxKind.PlusToken &&
      (esexpresioncadena(expresion.left) || esexpresioncadena(expresion.right))
    );
  };
  const obtenertextodeltemporizador = (llamada: ts.CallExpression): ts.Expression | undefined => {
    const expresion = desenrollar(llamada.expression);
    if (!ts.isPropertyAccessExpression(expresion) && !ts.isElementAccessExpression(expresion)) {
      return llamada.arguments[0];
    }
    const metodo = nombredeacceso(expresion);
    if (metodo === 'call') return llamada.arguments[1];
    if (metodo === 'apply') {
      const argumentos = llamada.arguments[1];
      if (!argumentos || !ts.isArrayLiteralExpression(argumentos)) return undefined;
      const primero = argumentos.elements[0];
      return primero && !ts.isSpreadElement(primero) ? primero : undefined;
    }
    return llamada.arguments[0];
  };

  const recopilar = (nodo: ts.Node): void => {
    if (ts.isVariableDeclaration(nodo)) declaraciones.push(nodo);
    if (
      ts.isBinaryExpression(nodo) &&
      nodo.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(nodo.left)
    ) {
      asignaciones.push(nodo);
    }
    ts.forEachChild(nodo, recopilar);
  };
  recopilar(archivofuente);

  let cambio = true;
  while (cambio) {
    cambio = false;
    for (const declaracion of declaraciones) {
      if (
        ts.isIdentifier(declaracion.name) &&
        declaracion.initializer &&
        esreferenciatemporizador(declaracion.initializer) &&
        !temporizadores.has(declaracion.name)
      ) {
        temporizadores.add(declaracion.name);
        cambio = true;
      }
      if (
        ts.isIdentifier(declaracion.name) &&
        esexpresioncadena(declaracion.initializer) &&
        !cadenas.has(declaracion.name)
      ) {
        cadenas.add(declaracion.name);
        cambio = true;
      }
    }
    for (const asignacion of asignaciones) {
      if (ts.isIdentifier(asignacion.left)) {
        const declaracion = resolveridentificador(asignacion.left, ambitos);
        if (
          declaracion &&
          esreferenciatemporizador(asignacion.right) &&
          !temporizadores.has(declaracion)
        ) {
          temporizadores.add(declaracion);
          cambio = true;
        }
        if (declaracion && esexpresioncadena(asignacion.right) && !cadenas.has(declaracion)) {
          cadenas.add(declaracion);
          cambio = true;
        }
      }
    }
  }

  let encontrado = false;
  const visitar = (nodo: ts.Node): void => {
    if (encontrado) return;
    if (
      ts.isCallExpression(nodo) &&
      esreferenciatemporizador(nodo.expression) &&
      esexpresioncadena(obtenertextodeltemporizador(nodo))
    ) {
      encontrado = true;
      return;
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(archivofuente);
  return encontrado;
}

function tieneevaluadorglobal(source: string): boolean {
  const archivofuente = creararchivofuente(source);
  const ambitos = crearambitos(archivofuente);
  const globales = new Set<ts.Identifier>();
  const reflectos = new Set<ts.Identifier>();
  const funcionesget = new Set<ts.Identifier>();
  const funcionesconstruct = new Set<ts.Identifier>();
  const evaluadores = new Set<ts.Identifier>();
  const referencias = obtenerreferenciasglobales(
    source,
    new Set(['eval', 'Function']),
    archivofuente,
  );
  const declaraciones: ts.VariableDeclaration[] = [];
  const asignaciones: ts.BinaryExpression[] = [];
  const inicializadoresconstantes = new Map<ts.Identifier, ts.Expression>();
  const recopilar = (nodo: ts.Node): void => {
    if (ts.isVariableDeclaration(nodo)) {
      declaraciones.push(nodo);
      if (
        ts.isIdentifier(nodo.name) &&
        nodo.initializer &&
        ts.isVariableDeclarationList(nodo.parent) &&
        (nodo.parent.flags & ts.NodeFlags.Const) !== 0
      ) {
        inicializadoresconstantes.set(nodo.name, nodo.initializer);
      }
    }
    if (
      ts.isBinaryExpression(nodo) &&
      nodo.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(nodo.left)
    ) {
      asignaciones.push(nodo);
    }
    ts.forEachChild(nodo, recopilar);
  };
  recopilar(archivofuente);

  const textoestatico = (
    expresion: ts.Expression | undefined,
    visitados = new Set<ts.Identifier>(),
  ): string | undefined => {
    if (!expresion) return undefined;
    const simple = textosimple(expresion);
    if (simple !== undefined) return simple;
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      const inicializador = declaracion && inicializadoresconstantes.get(declaracion);
      if (!declaracion || !inicializador || visitados.has(declaracion)) return undefined;
      visitados.add(declaracion);
      return textoestatico(inicializador, visitados);
    }
    return undefined;
  };

  const esraizglobal = (expresion: ts.Expression): boolean => {
    const raiz = raizdeacceso(expresion);
    if (!raiz) return false;
    const declaracion = resolveridentificador(raiz, ambitos);
    return declaracion
      ? globales.has(declaracion)
      : ['globalThis', 'window', 'self'].includes(raiz.text);
  };
  const esreferenciaglobaldirecta = (expresion: ts.Expression): boolean => {
    const acceso = rutadeacceso(expresion);
    return Boolean(acceso && acceso.ruta.length === 0 && esraizglobal(expresion));
  };
  const esraizreflect = (expresion: ts.Expression): boolean => {
    const raiz = raizdeacceso(expresion);
    if (!raiz) return false;
    const declaracion = resolveridentificador(raiz, ambitos);
    return declaracion ? reflectos.has(declaracion) : raiz.text === 'Reflect';
  };
  const esreflectget = (expresion: ts.Expression): boolean => {
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return referencias.has(expresion)
        ? false
        : Boolean(declaracion && funcionesget.has(declaracion));
    }
    const acceso = rutadeacceso(expresion);
    if (!acceso) return false;
    if (acceso.ruta.join('.') === 'Reflect.get') return esraizglobal(expresion);
    return acceso.ruta.join('.') === 'get' && esraizreflect(expresion);
  };
  const esreflectconstruct = (expresion: ts.Expression): boolean => {
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return Boolean(declaracion && funcionesconstruct.has(declaracion));
    }
    const acceso = rutadeacceso(expresion);
    if (!acceso) return false;
    if (acceso.ruta.join('.') === 'Reflect.construct') return esraizglobal(expresion);
    return acceso.ruta.join('.') === 'construct' && esraizreflect(expresion);
  };
  const esreferenciaevaluador = (expresion: ts.Expression | undefined): boolean => {
    if (!expresion) return false;
    while (
      ts.isParenthesizedExpression(expresion) ||
      ts.isAsExpression(expresion) ||
      ts.isTypeAssertionExpression(expresion) ||
      ts.isNonNullExpression(expresion) ||
      ts.isSatisfiesExpression(expresion)
    ) {
      expresion = expresion.expression;
    }
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return referencias.has(expresion) || Boolean(declaracion && evaluadores.has(declaracion));
    }
    if (
      (ts.isPropertyAccessExpression(expresion) || ts.isElementAccessExpression(expresion)) &&
      ['call', 'apply', 'bind'].includes(nombredeacceso(expresion) ?? '') &&
      esreferenciaevaluador(expresion.expression)
    ) {
      return true;
    }
    const acceso = rutadeacceso(expresion);
    const propiedad =
      nombredeacceso(expresion) ??
      (ts.isElementAccessExpression(expresion)
        ? textoestatico(expresion.argumentExpression)
        : undefined);
    if (acceso && acceso.ruta.length === 1 && ['eval', 'Function'].includes(propiedad ?? '')) {
      return esraizglobal(expresion);
    }
    if (
      ts.isCallExpression(expresion) &&
      esreflectget(expresion.expression) &&
      textoestatico(expresion.arguments[1]) !== undefined &&
      ['eval', 'Function'].includes(textoestatico(expresion.arguments[1]) ?? '') &&
      Boolean(expresion.arguments[0] && esreferenciaglobaldirecta(expresion.arguments[0]))
    ) {
      return true;
    }
    return false;
  };
  const esreferenciaevaluadorvigente = (
    expresion: ts.Expression | undefined,
    posicion: number,
    visitados = new Set<ts.Identifier>(),
  ): boolean => {
    if (!expresion) return false;
    while (
      ts.isParenthesizedExpression(expresion) ||
      ts.isAsExpression(expresion) ||
      ts.isTypeAssertionExpression(expresion) ||
      ts.isNonNullExpression(expresion) ||
      ts.isSatisfiesExpression(expresion)
    ) {
      expresion = expresion.expression;
    }
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      if (!declaracion) return referencias.has(expresion);
      if (visitados.has(declaracion)) return false;
      let valor = declaraciones.find((elemento) => elemento.name === declaracion)?.initializer;
      let posicionasignacion = -1;
      for (const asignacion of asignaciones) {
        if (
          asignacion.pos < posicion &&
          asignacion.pos > posicionasignacion &&
          resolveridentificador(asignacion.left as ts.Identifier, ambitos) === declaracion
        ) {
          valor = asignacion.right;
          posicionasignacion = asignacion.pos;
        }
      }
      if (!valor) return evaluadores.has(declaracion);
      visitados.add(declaracion);
      return esreferenciaevaluadorvigente(valor, posicion, visitados);
    }
    if (
      (ts.isPropertyAccessExpression(expresion) || ts.isElementAccessExpression(expresion)) &&
      ['call', 'apply', 'bind'].includes(nombredeacceso(expresion) ?? '')
    ) {
      return esreferenciaevaluadorvigente(expresion.expression, posicion, visitados);
    }
    return esreferenciaevaluador(expresion);
  };
  const esreferenciareflect = (expresion: ts.Expression | undefined): boolean => {
    if (!expresion) return false;
    const acceso = rutadeacceso(expresion);
    if (!acceso) return false;
    if (acceso.ruta.length === 0) return esraizreflect(expresion);
    return acceso.ruta.length === 1 && acceso.ruta[0] === 'Reflect' && esraizglobal(expresion);
  };
  const esreferenciareflectgetdesde = (expresion: ts.Expression | undefined): boolean => {
    if (!expresion) return false;
    if (ts.isIdentifier(expresion)) {
      const declaracion = resolveridentificador(expresion, ambitos);
      return Boolean(declaracion && funcionesget.has(declaracion));
    }
    const acceso = rutadeacceso(expresion);
    return Boolean(
      acceso && acceso.ruta.length === 1 && acceso.ruta[0] === 'get' && esraizreflect(expresion),
    );
  };

  let cambio = true;
  while (cambio) {
    cambio = false;
    const marcar = (conjunto: Set<ts.Identifier>, id: ts.Identifier): void => {
      if (!conjunto.has(id)) {
        conjunto.add(id);
        cambio = true;
      }
    };
    const propagar = (id: ts.Identifier, valor: ts.Expression | undefined): void => {
      if (!valor) return;
      if (esreferenciaglobaldirecta(valor)) marcar(globales, id);
      if (esreferenciareflect(valor)) marcar(reflectos, id);
      if (esreferenciareflectgetdesde(valor)) marcar(funcionesget, id);
      if (esreflectconstruct(valor)) marcar(funcionesconstruct, id);
      if (esreferenciaevaluador(valor)) marcar(evaluadores, id);
      if (
        ts.isCallExpression(valor) &&
        esreflectget(valor.expression) &&
        ['eval', 'Function'].includes(textoestatico(valor.arguments[1]) ?? '') &&
        Boolean(valor.arguments[0] && esreferenciaglobaldirecta(valor.arguments[0]))
      ) {
        marcar(evaluadores, id);
      }
    };
    for (const declaracion of declaraciones) {
      if (!declaracion.initializer) continue;
      if (ts.isIdentifier(declaracion.name)) {
        propagar(declaracion.name, declaracion.initializer);
      } else if (ts.isObjectBindingPattern(declaracion.name)) {
        const initializer = declaracion.initializer;
        const esglobal = esreferenciaglobaldirecta(initializer);
        const esreflect = esreferenciareflect(initializer) || esraizreflect(initializer);
        for (const elemento of declaracion.name.elements) {
          if (!ts.isIdentifier(elemento.name)) continue;
          const propiedad = elemento.propertyName ?? elemento.name;
          const nombre =
            ts.isIdentifier(propiedad) || ts.isStringLiteral(propiedad)
              ? propiedad.text
              : undefined;
          if (esglobal && ['globalThis', 'window', 'self'].includes(nombre ?? '')) {
            marcar(globales, elemento.name);
          }
          if (esglobal && nombre === 'Reflect') marcar(reflectos, elemento.name);
          if (esglobal && ['eval', 'Function'].includes(nombre ?? ''))
            marcar(evaluadores, elemento.name);
          if (esreflect && nombre === 'get') marcar(funcionesget, elemento.name);
          if (esreflect && nombre === 'construct') marcar(funcionesconstruct, elemento.name);
        }
      }
    }
    for (const asignacion of asignaciones) {
      const declaracion = resolveridentificador(asignacion.left as ts.Identifier, ambitos);
      if (declaracion) propagar(declaracion, asignacion.right);
    }
  }

  let encontrado = false;
  const visitar = (nodo: ts.Node): void => {
    if (encontrado) return;
    if (ts.isCallExpression(nodo) || ts.isNewExpression(nodo)) {
      if (esreferenciaevaluadorvigente(nodo.expression, nodo.pos)) {
        encontrado = true;
        return;
      }
    }
    if (
      ts.isCallExpression(nodo) &&
      esreflectconstruct(nodo.expression) &&
      esreferenciaevaluadorvigente(nodo.arguments[0], nodo.pos)
    ) {
      encontrado = true;
      return;
    }
    ts.forEachChild(nodo, visitar);
  };
  visitar(archivofuente);
  return encontrado;
}
