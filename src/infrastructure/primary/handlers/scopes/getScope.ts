import 'reflect-metadata';
import apiInputMode from 'rebased/handler/input/commandApi';
import apiOutputMode from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../../../depsContainer';
import GetScopeAction from '../../../../application/actions/scopeActions/getScopeAction';

export const handler = async (command: any, context: any) => {
  const action = depsContainer.resolve(GetScopeAction);

  return commandMapper(
    { command, context },
    apiInputMode,
    action.execute,
    apiOutputMode
  );
};
