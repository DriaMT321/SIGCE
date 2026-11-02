import * as ts from 'typescript';
import { tieneejecuciondinamica } from './referenciasglobales';
import {
  emptyNodeModuleAliases,
  isObjectReference,
  objectAliases,
  isNamedPropertyCall,
  isProcessMainModuleLoader,
  isComputedProcessMainModuleLoader,
  bindingContainsRequire,
  bindingHasPropertyPath,
  isNodeMainModuleReference,
  nodeMainModuleAliases,
  isNodeMainModuleLoader,
  isNodeInternalModuleLoader,
  isReflectGetModuleLoader,
  isComputedNodeMainModuleLoader,
  unwrapLoaderExpression,
  isRequireCall,
  isComputedModuleMethodAccess,
  propertyName,
  isReflectiveModuleLoaderMethod,
  isModuleLoaderReference,
  isDirectLoaderCallCallee,
  isReflectApplyReference,
  aliasedReflectApplyNames,
} from './analisiscargadoresnode';

export function hasComputedModuleLoader(source: string): boolean {
  const sourceFile = ts.createSourceFile(
    'architecture-source.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const globalAliases = objectAliases(sourceFile, 'globalThis');
  const moduleAliases = objectAliases(sourceFile, 'module');
  const processAliases = objectAliases(sourceFile, 'process');
  const requireAliases = objectAliases(sourceFile, 'require');
  const mainModuleAliases = nodeMainModuleAliases(
    sourceFile,
    moduleAliases,
    processAliases,
    requireAliases,
  );
  const reflectAliases = objectAliases(sourceFile, 'Reflect');
  const reflectApplyAliases = aliasedReflectApplyNames(sourceFile);
  let found = false;

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const isRequire = isRequireCall(
        node.expression,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
        reflectAliases,
        globalAliases,
      );
      const isComputedModuleLoader = isComputedModuleMethodAccess(node.expression, moduleAliases);
      const isComputedProcessLoader = isComputedProcessMainModuleLoader(
        node.expression,
        processAliases,
      );
      const isProcessLoader = isProcessMainModuleLoader(node.expression, processAliases);
      const isNodeMainModuleLoaderCall = isNodeMainModuleLoader(
        node.expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      );
      const isComputedNodeMainLoader = isComputedNodeMainModuleLoader(
        node.expression,
        mainModuleAliases,
        moduleAliases,
        processAliases,
        requireAliases,
      );
      const isReflectiveLoader = isReflectiveModuleLoaderMethod(
        node.expression,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
      );
      const isReflectApply = isReflectApplyReference(
        node.expression,
        reflectAliases,
        reflectApplyAliases,
        globalAliases,
      );
      const isReflectiveRequireGetter = isReflectGetModuleLoader(
        node,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
        reflectAliases,
        globalAliases,
      );
      const argument = node.arguments[0];
      if (
        isComputedModuleLoader ||
        isComputedProcessLoader ||
        isProcessLoader ||
        isNodeMainModuleLoaderCall ||
        isComputedNodeMainLoader ||
        isReflectiveLoader ||
        isReflectApply ||
        isReflectiveRequireGetter ||
        ((isDynamicImport || isRequire) &&
          (!argument ||
            (!ts.isStringLiteral(argument) && !ts.isNoSubstitutionTemplateLiteral(argument))))
      ) {
        found = true;
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return found;
}

export function hasAliasedModuleLoader(source: string): boolean {
  const sourceFile = ts.createSourceFile(
    'architecture-source.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const globalAliases = objectAliases(sourceFile, 'globalThis');
  const moduleAliases = objectAliases(sourceFile, 'module');
  const processAliases = objectAliases(sourceFile, 'process');
  const requireAliases = objectAliases(sourceFile, 'require');
  const mainModuleAliases = nodeMainModuleAliases(
    sourceFile,
    moduleAliases,
    processAliases,
    requireAliases,
  );
  const reflectAliases = objectAliases(sourceFile, 'Reflect');
  const aliases = new Set<string>();
  const reflectApplyAliases = aliasedReflectApplyNames(sourceFile);
  let found = false;
  const declarations: ts.VariableDeclaration[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) {
      declarations.push(node);
      const initializer = node.initializer && unwrapLoaderExpression(node.initializer);
      const hasUnsafeLoaderDestructuring =
        ts.isObjectBindingPattern(node.name) &&
        initializer &&
        ((bindingContainsRequire(node.name) &&
          (isObjectReference(initializer, 'module', moduleAliases) ||
            isNodeMainModuleReference(
              initializer,
              mainModuleAliases,
              moduleAliases,
              processAliases,
              requireAliases,
            ))) ||
          (isObjectReference(initializer, 'process', processAliases) &&
            bindingHasPropertyPath(node.name, ['mainModule', 'require'])) ||
          (isObjectReference(initializer, 'require', requireAliases) &&
            bindingHasPropertyPath(node.name, ['main', 'require'])));
      if (hasUnsafeLoaderDestructuring) {
        found = true;
      }
      if (
        ts.isIdentifier(node.name) &&
        initializer &&
        isReflectApplyReference(initializer, reflectAliases, reflectApplyAliases, globalAliases)
      ) {
        found = true;
      }
    }
    if (
      ts.isParameter(node) &&
      node.initializer &&
      isModuleLoaderReference(
        node.initializer,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
      )
    ) {
      found = true;
    }
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left) &&
      (isModuleLoaderReference(
        node.right,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
      ) ||
        isReflectApplyReference(node.right, reflectAliases, reflectApplyAliases, globalAliases))
    ) {
      aliases.add(node.left.text);
      found = true;
    }
    if (
      ts.isCallExpression(node) &&
      (isNamedPropertyCall(node.expression, 'module', 'require', moduleAliases) ||
        isComputedModuleMethodAccess(node.expression, moduleAliases) ||
        isNodeInternalModuleLoader(
          node.expression,
          mainModuleAliases,
          moduleAliases,
          processAliases,
          requireAliases,
        ) ||
        isProcessMainModuleLoader(node.expression, processAliases) ||
        isComputedProcessMainModuleLoader(node.expression, processAliases) ||
        isNodeMainModuleLoader(
          node.expression,
          mainModuleAliases,
          moduleAliases,
          processAliases,
          requireAliases,
        ) ||
        isComputedNodeMainModuleLoader(
          node.expression,
          mainModuleAliases,
          moduleAliases,
          processAliases,
          requireAliases,
        )) &&
      !isObjectReference(
        (
          unwrapLoaderExpression(node.expression) as
            ts.PropertyAccessExpression | ts.ElementAccessExpression
        ).expression,
        'module',
      )
    ) {
      found = true;
    }
    if (
      (ts.isIdentifier(node) ||
        ts.isPropertyAccessExpression(node) ||
        ts.isElementAccessExpression(node) ||
        ts.isCallExpression(node)) &&
      isModuleLoaderReference(
        node,
        moduleAliases,
        processAliases,
        requireAliases,
        mainModuleAliases,
      ) &&
      !isDirectLoaderCallCallee(node)
    ) {
      found = true;
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  let changed = true;
  while (changed) {
    changed = false;
    for (const declaration of declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      const isLoaderAlias =
        isModuleLoaderReference(
          declaration.initializer,
          moduleAliases,
          processAliases,
          requireAliases,
          mainModuleAliases,
        ) ||
        (ts.isIdentifier(declaration.initializer) && aliases.has(declaration.initializer.text));
      if (!isLoaderAlias || aliases.has(declaration.name.text)) continue;
      aliases.add(declaration.name.text);
      found = true;
      changed = true;
    }
  }

  return found;
}

export function hasUnsafeModuleLoader(source: string): boolean {
  return (
    hasComputedModuleLoader(source) ||
    hasAliasedModuleLoader(source) ||
    hasProcessBuiltinModule(source) ||
    tieneejecuciondinamica(source)
  );
}

export function hasProcessBuiltinModule(source: string): boolean {
  const sourceFile = ts.createSourceFile(
    'architecture-source.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const processAliases = objectAliases(sourceFile, 'process');
  const isBuiltinMethod = (expression: ts.Expression): boolean => {
    expression = unwrapLoaderExpression(expression);
    if (ts.isPropertyAccessExpression(expression)) {
      return (
        expression.name.text === 'getBuiltinModule' &&
        isObjectReference(expression.expression, 'process', processAliases)
      );
    }
    return (
      ts.isElementAccessExpression(expression) &&
      (ts.isStringLiteral(expression.argumentExpression) ||
        ts.isNoSubstitutionTemplateLiteral(expression.argumentExpression)) &&
      expression.argumentExpression.text === 'getBuiltinModule' &&
      isObjectReference(expression.expression, 'process', processAliases)
    );
  };

  let found = false;
  const visit = (node: ts.Node): void => {
    if (found) return;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer
    ) {
      if (isObjectReference(node.initializer, 'process', processAliases)) {
        found = node.name.elements.some((element) => {
          const property = element.propertyName ?? element.name;
          return (
            (ts.isIdentifier(property) && property.text === 'getBuiltinModule') ||
            ((ts.isStringLiteral(property) || ts.isNoSubstitutionTemplateLiteral(property)) &&
              property.text === 'getBuiltinModule')
          );
        });
      }
    }
    if (
      (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
      isBuiltinMethod(node)
    ) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}
