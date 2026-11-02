export const tokenverificadorreplicalocalsie = Symbol('VERIFICADOR_REPLICA_LOCAL_SIE');

export interface resultadoverificacionreplicalocalsie {
  active: boolean;
  loginSuccess: boolean;
  localReplica: boolean;
  structureRecognized: boolean;
  portalTitle: string;
  checkedAt: string;
  message: string;
}

export interface verificadorreplicalocalsie {
  verificar(htmlsubido?: string): Promise<resultadoverificacionreplicalocalsie>;
}

