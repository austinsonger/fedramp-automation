import type { PresenterConfig } from '..';

export const initialize = ({ effects, state }: PresenterConfig) => {
  effects.useCases
    .getXSpecScenarioSummaries()
    .then(xspecSummariesByAssertionId => {
      state.schematron.assertionDocumentation.send('SUMMARIES_LOADED', {
        xspecSummariesByAssertionId,
      });
    });
};
