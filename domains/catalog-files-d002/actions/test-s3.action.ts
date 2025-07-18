'use server';

import { fileActions } from './crud.actions.server';

/**
 * A wrapper server action that is safe to be called from the client.
 * It calls the original 'server-only' action.
 */
export const testS3Configuration = async () => {
  return fileActions.testS3ConfigurationAction();
};
