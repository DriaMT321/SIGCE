import * as ts from 'typescript';

export function isObjectReference(
  expression: ts.Expression,
  objectName: string,
  aliases: ReadonlySet<string> = new Set(),
  globalAliases: ReadonlySet<string> = new Set(),
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (
    ts.isIdentifier(expression) &&
    (expression.text === objectName || aliases.has(expression.text))
  ) {
    return true;
  }
  if (objectName !== 'Reflect' && objectName !== 'process') return false;
  const isGlobalObject = (candidate: ts.Expression) => {
    candidate = unwrapLoaderExpression(candidate);
    return (
      ts.isIdentifier(candidate) &&
      (['globalThis', 'global'].includes(candidate.text) || globalAliases.has(candidate.text))
    );
  };
  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text === objectName && isGlobalObject(expression.expression);
  }
  return (
    ts.isElementAccessExpression(expression) &&
    (ts.isStringLiteral(expression.argumentExpression) ||
      ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression)) &&
    expression.argumentExpression.text === objectName &&
    isGlobalObject(expression.expression)
  );
}

export function objectAliases(sourceFile: ts.SourceFile, objectName: string): Set<string> {
  const globalAliases =
    objectName === 'Reflect' || objectName === 'process'
      ? objectAliases(sourceFile, 'globalThis')
      : new Set<string>();
  const aliases = new Set<string>();
  const declarations: ts.VariableDeclaration[] = [];
  const assignments: ts.BinaryExpression[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) declarations.push(node);
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left)
    ) {
      assignments.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  let changed = true;
  while (changed) {
    changed = false;
    const addAlias = (name: ts.Identifier, value: ts.Expression) => {
      value = unwrapLoaderExpression(value);
      if (!isObjectReference(value, objectName, aliases, globalAliases) || aliases.has(name.text)) {
        return;
      }
      aliases.add(name.text);
      changed = true;
    };

    for (const declaration of declarations) {
      if (!declaration.initializer) continue;
      if (ts.isIdentifier(declaration.name)) {
        addAlias(declaration.name, declaration.initializer);
        continue;
      }
      if (
        objectName === 'Reflect' &&
        ts.isObjectBindingPattern(declaration.name) &&
        isObjectReference(declaration.initializer, 'globalThis', globalAliases)
      ) {
        for (const element of declaration.name.elements) {
          const property = element.propertyName ?? element.name;
          if (
            (ts.isComputedPropertyName(property) ||
              (ts.isIdentifier(property) && property.text === 'Reflect') ||
              ((ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property)) &&
                property.text === 'Reflect')) &&
            ts.isIdentifier(element.name) &&
            !aliases.has(element.name.text)
          ) {
            aliases.add(element.name.text);
            changed = true;
          }
        }
      }
    }
    for (const assignment of assignments) {
      if (ts.isIdentifier(assignment.left)) addAlias(assignment.left, assignment.right);
    }
  }

  return aliases;
}

export function isNamedPropertyCall(
  expression: ts.Expression,
  objectName: string,
  propertyName: string,
  objectAliases: ReadonlySet<string> = new Set(),
  globalAliases: ReadonlySet<string> = new Set(),
) {
  expression = unwrapLoaderExpression(expression);
  if (
    ts.isPropertyAccessExpression(expression) &&
    isObjectReference(expression.expression, objectName, objectAliases, globalAliases)
  ) {
    return expression.name.text === propertyName;
  }
  return (
    ts.isElementAccessExpression(expression) &&
    isObjectReference(expression.expression, objectName, objectAliases, globalAliases) &&
    ((ts.isStringLiteral(expression.argumentExpression) &&
      expression.argumentExpression.text === propertyName) ||
      (ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression) &&
        expression.argumentExpression.text === propertyName))
  );
}

export function isProcessMainModuleReference(
  expression: ts.Expression,
  processAliases: ReadonlySet<string>,
): boolean {
  return isNamedPropertyCall(expression, 'process', 'mainModule', processAliases);
}

export function isProcessMainModuleLoader(
  expression: ts.Expression,
  processAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    return (
      propertyName(expression) === 'require' &&
      isProcessMainModuleReference(expression.expression, processAliases)
    );
  }
  return false;
}

export function isComputedProcessMainModuleLoader(
  expression: ts.Expression,
  processAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    ts.isElementAccessExpression(expression) &&
    isProcessMainModuleReference(expression.expression, processAliases) &&
    !ts.isStringLiteral(expression.argumentExpression) &&
    !ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression)
  );
}

export function isRequireMainModuleReference(
  expression: ts.Expression,
  requireAliases: ReadonlySet<string>,
): boolean {
  return isNamedPropertyCall(expression, 'require', 'main', requireAliases);
}

export function bindingContainsRequire(name: ts.BindingName): boolean {
  if (ts.isArrayBindingPattern(name)) {
    return name.elements.some(
      (element) => ts.isBindingElement(element) && bindingContainsRequire(element.name),
    );
  }
  if (!ts.isObjectBindingPattern(name)) return false;
  return name.elements.some((element) => {
    const property = element.propertyName ?? element.name;
    return (
      ts.isComputedPropertyName(property) ||
      (ts.isIdentifier(property) && property.text === 'require') ||
      ((ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property)) &&
        property.text === 'require') ||
      (ts.isObjectBindingPattern(element.name) && bindingContainsRequire(element.name))
    );
  });
}

export function bindingHasPropertyPath(
  name: ts.BindingName,
  expectedPath: readonly string[],
): boolean {
  if (!ts.isObjectBindingPattern(name) || expectedPath.length === 0) return false;
  return name.elements.some((element) => {
    const property = element.propertyName ?? element.name;
    const matchesProperty =
      ts.isComputedPropertyName(property) ||
      ((ts.isIdentifier(property) ||
        ts.isStringLiteral(property) ||
        ts.isNoSubstitutionTemplateLiteral(property)) &&
        property.text === expectedPath[0]);
    if (!matchesProperty) return false;
    if (expectedPath.length === 1) return true;
    return bindingHasPropertyPath(element.name, expectedPath.slice(1));
  });
}

export interface NodeModuleAliases {
  modules: Set<string>;
  childrenCollections: Set<string>;
}

export const emptyNodeModuleAliases: NodeModuleAliases = {
  modules: new Set<string>(),
  childrenCollections: new Set<string>(),
};

export function isNumericArrayIndex(expression: ts.Expression | undefined): boolean {
  expression = expression && unwrapLoaderExpression(expression);
  return Boolean(
    expression &&
    (ts.isNumericLiteral(expression) ||
      (ts.isPrefixUnaryExpression(expression) &&
        (expression.operator === ts.SyntaxKind.MinusToken ||
          expression.operator === ts.SyntaxKind.PlusToken) &&
        ts.isNumericLiteral(expression.operand))),
  );
}

export function isNodeModuleChildrenCollection(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (ts.isIdentifier(expression) && mainModuleAliases.childrenCollections.has(expression.text)) {
    return true;
  }
  if (ts.isCallExpression(expression)) {
    const [target, property] = expression.arguments;
    if (
      target &&
      property &&
      (ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property)) &&
      property.text === 'children' &&
      isNamedPropertyCall(expression.expression, 'Reflect', 'get') &&
      (isObjectReference(target, 'module', moduleAliases) ||
        isNodeMainModuleReference(
          target,
          mainModuleAliases,
          moduleAliases,
          processAliases,
          requireAliases,
        ))
    ) {
      return true;
    }
  }
  if (ts.isCallExpression(expression)) {
    const method = unwrapLoaderExpression(expression.expression);
    if (
      (ts.isPropertyAccessExpression(method) || ts.isElementAccessExpression(method)) &&
      ['concat', 'filter', 'flatMap', 'map', 'slice', 'toReversed', 'toSorted', 'with'].includes(
        propertyName(method) ?? '',
      )
    ) {
      return isNodeModuleChildrenCollection(
        method.expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      );
    }
  }
  return (
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    propertyName(expression) === 'children' &&
    (isObjectReference(expression.expression, 'module', moduleAliases) ||
      isNodeMainModuleReference(
        expression.expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      ))
  );
}

export function isNodeMainModuleReference(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (ts.isCallExpression(expression)) {
    const property = expression.arguments[1];
    const propertyNameValue =
      property && (ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property))
        ? property.text
        : undefined;
    const isPotentialModuleLookup =
      !property ||
      propertyNameValue === undefined ||
      propertyNameValue === 'parent' ||
      propertyNameValue === 'children' ||
      propertyNameValue === 'mainModule' ||
      propertyNameValue === 'main';
    if (isNamedPropertyCall(expression.expression, 'Reflect', 'get') && isPotentialModuleLookup) {
      const target = expression.arguments[0];
      if (
        target &&
        (isObjectReference(target, 'module', moduleAliases) ||
          isProcessMainModuleReference(target, processAliases) ||
          isRequireMainModuleReference(target, requireAliases) ||
          isNodeMainModuleReference(
            target,
            mainModuleAliases,
            moduleAliases,
            processAliases,
            requireAliases,
          ) ||
          (propertyNameValue === 'mainModule' &&
            isObjectReference(target, 'process', processAliases)) ||
          (propertyNameValue === 'main' && isObjectReference(target, 'require', requireAliases)))
      ) {
        return true;
      }
    }
    const lookupCall = expression.expression;
    const lookupMethod =
      ts.isPropertyAccessExpression(lookupCall) || ts.isElementAccessExpression(lookupCall)
        ? propertyName(lookupCall)
        : undefined;
    if (
      ['at', 'find', 'findLast', 'pop', 'shift'].includes(lookupMethod ?? '') &&
      isNodeModuleChildrenCollection(
        (lookupCall as ts.PropertyAccessExpression | ts.ElementAccessExpression).expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      )
    ) {
      return true;
    }
  }
  if (
    (ts.isIdentifier(expression) && mainModuleAliases.modules.has(expression.text)) ||
    isObjectReference(expression, 'module', moduleAliases) ||
    isProcessMainModuleReference(expression, processAliases) ||
    isRequireMainModuleReference(expression, requireAliases)
  ) {
    return true;
  }
  if (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) {
    const property = propertyName(expression);
    if (property === 'parent') {
      return (
        isObjectReference(expression.expression, 'module', moduleAliases) ||
        isNodeMainModuleReference(
          expression.expression,
          mainModuleAliases,
          moduleAliases,
          processAliases,
          requireAliases,
        )
      );
    }
    if (property === 'children') return false;
    return (
      ts.isElementAccessExpression(expression) &&
      isNumericArrayIndex(expression.argumentExpression) &&
      isNodeModuleChildrenCollection(
        expression.expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      )
    );
  }
  return false;
}

export function nodeMainModuleAliases(
  sourceFile: ts.SourceFile,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): NodeModuleAliases {
  const aliases: NodeModuleAliases = {
    modules: new Set<string>(),
    childrenCollections: new Set<string>(),
  };
  const declarations: ts.VariableDeclaration[] = [];
  const assignments: ts.BinaryExpression[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) declarations.push(node);
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left)
    ) {
      assignments.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  const addAlias = (name: ts.Identifier, value: ts.Expression): boolean => {
    if (isNodeMainModuleReference(value, aliases, moduleAliases, processAliases, requireAliases)) {
      if (aliases.modules.has(name.text)) return false;
      aliases.modules.add(name.text);
      return true;
    }
    if (
      isNodeModuleChildrenCollection(value, aliases, moduleAliases, processAliases, requireAliases)
    ) {
      if (aliases.childrenCollections.has(name.text)) return false;
      aliases.childrenCollections.add(name.text);
      return true;
    }
    return false;
  };

  let changed = true;
  while (changed) {
    changed = false;
    for (const declaration of declarations) {
      if (!declaration.initializer) continue;
      if (ts.isIdentifier(declaration.name)) {
        changed = addAlias(declaration.name, declaration.initializer) || changed;
        continue;
      }
      const initializer = unwrapLoaderExpression(declaration.initializer);
      if (
        ts.isArrayBindingPattern(declaration.name) &&
        isNodeModuleChildrenCollection(
          initializer,
          aliases,
          moduleAliases,
          processAliases,
          requireAliases,
        )
      ) {
        for (const element of declaration.name.elements) {
          if (
            ts.isBindingElement(element) &&
            ts.isIdentifier(element.name) &&
            !aliases.modules.has(element.name.text)
          ) {
            aliases.modules.add(element.name.text);
            changed = true;
          }
        }
        continue;
      }
      if (!ts.isObjectBindingPattern(declaration.name)) continue;
      const processSource = isObjectReference(initializer, 'process', processAliases);
      const requireSource = isObjectReference(initializer, 'require', requireAliases);
      const moduleSource = isObjectReference(initializer, 'module', moduleAliases);
      if (!processSource && !requireSource && !moduleSource) continue;
      for (const element of declaration.name.elements) {
        const property = element.propertyName ?? element.name;
        const expectedNames = processSource
          ? ['mainModule']
          : moduleSource
            ? ['parent', 'children']
            : ['main'];
        if (
          (ts.isComputedPropertyName(property) ||
            expectedNames.some(
              (expectedName) =>
                (ts.isIdentifier(property) ||
                  ts.isStringLiteral(property) ||
                  ts.isNoSubstitutionTemplateLiteral(property)) &&
                property.text === expectedName,
            )) &&
          ts.isIdentifier(element.name) &&
          !(moduleSource &&
          (ts.isIdentifier(property) ||
            ts.isStringLiteral(property) ||
            ts.isNoSubstitutionTemplateLiteral(property)) &&
          property.text === 'children'
            ? aliases.childrenCollections.has(element.name.text)
            : aliases.modules.has(element.name.text))
        ) {
          if (
            moduleSource &&
            (ts.isIdentifier(property) ||
              ts.isStringLiteral(property) ||
              ts.isNoSubstitutionTemplateLiteral(property)) &&
            property.text === 'children'
          ) {
            aliases.childrenCollections.add(element.name.text);
          } else {
            aliases.modules.add(element.name.text);
          }
          changed = true;
        }
      }
    }
    for (const assignment of assignments) {
      changed = addAlias(assignment.left, assignment.right) || changed;
    }
  }
  return aliases;
}

export function isNodeMainModuleLoader(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  const isLoader =
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    propertyName(expression) === 'require' &&
    isNodeMainModuleReference(
      expression.expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    );
  return isLoader;
}

export function isNodeInternalLoadOwner(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    propertyName(expression) === 'constructor' &&
    isNodeMainModuleReference(
      expression.expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    )
  );
}

export function isNodeInternalModuleLoader(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    propertyName(expression) === '_load' &&
    isNodeInternalLoadOwner(
      expression.expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    )
  );
}

export function isReflectGetModuleLoader(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
  mainModuleAliases: NodeModuleAliases,
  reflectAliases: ReadonlySet<string>,
  globalAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (
    !ts.isCallExpression(expression) ||
    !isNamedPropertyCall(expression.expression, 'Reflect', 'get', reflectAliases, globalAliases)
  ) {
    return false;
  }
  const [target, property] = expression.arguments;
  if (!target) return false;
  const isModuleObject = isNodeMainModuleReference(
    target,
    mainModuleAliases,
    moduleAliases,
    processAliases,
    requireAliases,
  );
  const isInternalLoadOwner = isNodeInternalLoadOwner(
    target,
    mainModuleAliases,
    moduleAliases,
    processAliases,
    requireAliases,
  );
  const propertyNameValue =
    property && (ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property))
      ? property.text
      : undefined;
  return (
    ((!property || propertyNameValue === undefined) && (isModuleObject || isInternalLoadOwner)) ||
    (isModuleObject && propertyNameValue === 'require') ||
    (isInternalLoadOwner && propertyNameValue === '_load')
  );
}

export function isComputedNodeMainModuleLoader(
  expression: ts.Expression,
  mainModuleAliases: NodeModuleAliases,
  moduleAliases: ReadonlySet<string>,
  processAliases: ReadonlySet<string>,
  requireAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    ts.isElementAccessExpression(expression) &&
    isNodeMainModuleReference(
      expression.expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    ) &&
    !ts.isStringLiteral(expression.argumentExpression) &&
    !ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression) &&
    !ts.isNumericLiteral(expression.argumentExpression) &&
    !(
      ts.isPrefixUnaryExpression(expression.argumentExpression) &&
      (expression.argumentExpression.operator === ts.SyntaxKind.MinusToken ||
        expression.argumentExpression.operator === ts.SyntaxKind.PlusToken) &&
      ts.isNumericLiteral(expression.argumentExpression.operand)
    )
  );
}

export function unwrapLoaderExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isNonNullExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

export function isRequireCall(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string> = new Set(),
  processAliases: ReadonlySet<string> = new Set(),
  requireAliases: ReadonlySet<string> = new Set(),
  mainModuleAliases: NodeModuleAliases = emptyNodeModuleAliases,
  reflectAliases: ReadonlySet<string> = new Set(),
  globalAliases: ReadonlySet<string> = new Set(),
): boolean {
  return (
    isRequireIdentifierReference(expression) ||
    isNamedPropertyCall(expression, 'require', 'resolve') ||
    isNamedPropertyCall(expression, 'module', 'require', moduleAliases) ||
    isProcessMainModuleLoader(expression, processAliases) ||
    isNodeMainModuleLoader(
      expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    ) ||
    isNodeInternalModuleLoader(
      expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    ) ||
    isReflectGetModuleLoader(
      expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
      reflectAliases,
      globalAliases,
    )
  );
}

export function isDirectModuleLoaderReference(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string> = new Set(),
  processAliases: ReadonlySet<string> = new Set(),
  requireAliases: ReadonlySet<string> = new Set(),
  mainModuleAliases: NodeModuleAliases = emptyNodeModuleAliases,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    isRequireIdentifierReference(expression) ||
    isNamedPropertyCall(expression, 'require', 'resolve') ||
    isNamedPropertyCall(expression, 'module', 'require', moduleAliases) ||
    isProcessMainModuleLoader(expression, processAliases) ||
    isNodeMainModuleLoader(
      expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    ) ||
    isNodeInternalModuleLoader(
      expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    ) ||
    isReflectGetModuleLoader(
      expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
      new Set(),
      new Set(),
    )
  );
}

export function isRequireIdentifierReference(expression: ts.Expression): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    ts.isIdentifier(expression) &&
    expression.text === 'require' &&
    !(ts.isPropertyAccessExpression(expression.parent) && expression.parent.name === expression)
  );
}

export function isComputedModuleMethodAccess(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string> = new Set(),
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    ts.isElementAccessExpression(expression) &&
    isObjectReference(expression.expression, 'module', moduleAliases) &&
    !ts.isStringLiteral(expression.argumentExpression) &&
    !ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression)
  );
}

export function propertyName(expression: ts.Expression): string | undefined {
  expression = unwrapLoaderExpression(expression);
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  if (ts.isElementAccessExpression(expression)) {
    const name = unwrapLoaderExpression(expression.argumentExpression);
    if (ts.isIdentifier(name)) return name.text;
    if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  }
  return undefined;
}

export function isReflectiveModuleLoaderMethod(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string> = new Set(),
  processAliases: ReadonlySet<string> = new Set(),
  requireAliases: ReadonlySet<string> = new Set(),
  mainModuleAliases: NodeModuleAliases = emptyNodeModuleAliases,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (!ts.isPropertyAccessExpression(expression) && !ts.isElementAccessExpression(expression)) {
    return false;
  }
  const method = propertyName(expression);
  return (
    ['apply', 'bind', 'call'].includes(method ?? '') &&
    isModuleLoaderReference(
      expression.expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
    )
  );
}

export function isModuleLoaderReference(
  expression: ts.Expression,
  moduleAliases: ReadonlySet<string> = new Set(),
  processAliases: ReadonlySet<string> = new Set(),
  requireAliases: ReadonlySet<string> = new Set(),
  mainModuleAliases: NodeModuleAliases = emptyNodeModuleAliases,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (
    isDirectModuleLoaderReference(
      expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
    ) ||
    isComputedModuleMethodAccess(expression, moduleAliases) ||
    isComputedProcessMainModuleLoader(expression, processAliases) ||
    isComputedNodeMainModuleLoader(
      expression,
      mainModuleAliases,
      moduleAliases,
      processAliases,
      requireAliases,
    )
  ) {
    return true;
  }
  if (
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    ['apply', 'bind', 'call'].includes(propertyName(expression) ?? '') &&
    isModuleLoaderReference(
      expression.expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
    )
  ) {
    return true;
  }
  return (
    ts.isCallExpression(expression) &&
    ts.isPropertyAccessExpression(unwrapLoaderExpression(expression.expression)) &&
    propertyName(unwrapLoaderExpression(expression.expression)) === 'bind' &&
    isModuleLoaderReference(
      (unwrapLoaderExpression(expression.expression) as ts.PropertyAccessExpression).expression,
      moduleAliases,
      processAliases,
      requireAliases,
      mainModuleAliases,
    )
  );
}

export function isDirectLoaderCallCallee(expression: ts.Expression): boolean {
  let current: ts.Node = expression;
  let parent = current.parent;
  while (
    (parent && ts.isPropertyAccessExpression(parent) && parent.expression === current) ||
    (parent && ts.isElementAccessExpression(parent) && parent.expression === current)
  ) {
    current = parent;
    parent = current.parent;
  }
  return Boolean(parent && ts.isCallExpression(parent) && parent.expression === current);
}

export function isComputedReflectMethodAccess(
  expression: ts.Expression,
  reflectAliases: ReadonlySet<string>,
  globalAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  return (
    ts.isElementAccessExpression(expression) &&
    isObjectReference(expression.expression, 'Reflect', reflectAliases, globalAliases) &&
    !ts.isStringLiteral(expression.argumentExpression) &&
    !ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression)
  );
}

export function isReflectApplyReference(
  expression: ts.Expression,
  reflectAliases: ReadonlySet<string>,
  applyAliases: ReadonlySet<string>,
  globalAliases: ReadonlySet<string>,
): boolean {
  expression = unwrapLoaderExpression(expression);
  if (
    isNamedPropertyCall(expression, 'Reflect', 'apply', reflectAliases, globalAliases) ||
    isComputedReflectMethodAccess(expression, reflectAliases, globalAliases) ||
    (ts.isIdentifier(expression) && applyAliases.has(expression.text))
  ) {
    return true;
  }

  if (
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
    ['apply', 'bind', 'call'].includes(propertyName(expression) ?? '') &&
    isReflectApplyReference(expression.expression, reflectAliases, applyAliases, globalAliases)
  ) {
    return true;
  }

  if (
    ts.isElementAccessExpression(expression) &&
    !ts.isStringLiteral(expression.argumentExpression) &&
    !ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression) &&
    isReflectApplyReference(expression.expression, reflectAliases, applyAliases, globalAliases)
  ) {
    return true;
  }

  if (
    ts.isCallExpression(expression) &&
    isReflectApplyReference(expression.expression, reflectAliases, applyAliases, globalAliases)
  ) {
    return true;
  }

  return (
    ts.isCallExpression(expression) &&
    (ts.isPropertyAccessExpression(unwrapLoaderExpression(expression.expression)) ||
      ts.isElementAccessExpression(unwrapLoaderExpression(expression.expression))) &&
    ['apply', 'bind', 'call'].includes(
      propertyName(unwrapLoaderExpression(expression.expression)) ?? '',
    ) &&
    isReflectApplyReference(
      (
        unwrapLoaderExpression(expression.expression) as
          ts.PropertyAccessExpression | ts.ElementAccessExpression
      ).expression,
      reflectAliases,
      applyAliases,
      globalAliases,
    )
  );
}

export function aliasedReflectApplyNames(sourceFile: ts.SourceFile): Set<string> {
  const globalAliases = objectAliases(sourceFile, 'globalThis');
  const reflectAliases = objectAliases(sourceFile, 'Reflect');
  const aliases = new Set<string>();
  const declarations: ts.VariableDeclaration[] = [];
  const assignments: ts.BinaryExpression[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) declarations.push(node);
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left)
    ) {
      assignments.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  let changed = true;
  while (changed) {
    changed = false;
    const addAlias = (name: ts.Identifier, value: ts.Expression) => {
      const isApply = isReflectApplyReference(value, reflectAliases, aliases, globalAliases);
      if (!isApply || aliases.has(name.text)) return;
      aliases.add(name.text);
      changed = true;
    };

    for (const declaration of declarations) {
      if (!declaration.initializer) continue;
      if (ts.isIdentifier(declaration.name)) {
        addAlias(declaration.name, declaration.initializer);
        continue;
      }
      if (
        ts.isObjectBindingPattern(declaration.name) &&
        isObjectReference(declaration.initializer, 'Reflect', reflectAliases, globalAliases)
      ) {
        for (const element of declaration.name.elements) {
          const property = element.propertyName ?? element.name;
          if (
            (ts.isComputedPropertyName(property) ||
              (ts.isIdentifier(property) && property.text === 'apply') ||
              ((ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property)) &&
                property.text === 'apply')) &&
            ts.isIdentifier(element.name) &&
            !aliases.has(element.name.text)
          ) {
            aliases.add(element.name.text);
            changed = true;
          }
        }
      }
    }
    for (const assignment of assignments) {
      if (ts.isIdentifier(assignment.left)) addAlias(assignment.left, assignment.right);
    }
  }

  return aliases;
}
