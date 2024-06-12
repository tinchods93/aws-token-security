import 'reflect-metadata';
import commandInput from 'rebased/handler/input/commandApi';
import commandOutput from 'rebased/handler/output/commandApi';
import { commandMapper } from 'rebased/handler';
import { HandlerCommandType } from '../types/handlerTypes';
import depsContainer from '../../../../depsContainer';
import GetScopeAction from '../../../../application/actions/scopeActions/getScopeAction';

export const handler = async (command: HandlerCommandType, context: any) => {
  const action = depsContainer.resolve(GetScopeAction);

  console.log('MARTIN_LOG=> handler', JSON.stringify({ command, context }));

  return commandMapper(
    { command, context },
    commandInput,
    action.execute,
    commandOutput
  );
};
