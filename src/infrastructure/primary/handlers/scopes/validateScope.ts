import 'reflect-metadata';
import inputMode from 'rebased/handler/input/commandInvoke';
import outputMode from 'rebased/handler/output/commandInvoke';
import { commandMapper } from 'rebased/handler';
import depsContainer from '../../../../depsContainer';
import ValidateScopeAction from '../../../../application/actions/scopeActions/validateScopeAction';

export const handler = async (command: any, context: any) => {
  const action = depsContainer.resolve(ValidateScopeAction);

  return commandMapper(
    { command, context },
    inputMode,
    action.execute,
    outputMode
  );
};
