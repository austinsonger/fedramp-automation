import type { PassStatus, Role } from '../lib/schematron';
import type { PresenterConfig } from '..';

export const initialize = ({ effects, state }: PresenterConfig) => {
  Promise.all([
    effects.useCases.getAssertionViews(),
    effects.useCases.getPOAMSchematronAssertions(),
    effects.useCases.getSAPSchematronAssertions(),
    effects.useCases.getSARSchematronAssertions(),
    effects.useCases.getSSPSchematronAssertions(),
  ]).then(
    ([
      assertionViews,
      poamSchematronAsserts,
      sapSchematronAsserts,
      sarSchematronAsserts,
      sspSchematronAsserts,
    ]) => {
      state.schematron.send('CONFIG_LOADED', {
        config: {
          assertionViews,
          poamSchematronAsserts,
          sapSchematronAsserts,
          sarSchematronAsserts,
          sspSchematronAsserts,
        },
      });
    },
  );
};

export const setFilterRole = ({ state }: PresenterConfig, role: Role) => {
  state.schematron.send('FILTER_ROLE_CHANGED', { role });
};

export const setFilterText = ({ state }: PresenterConfig, text: string) => {
  state.schematron.send('FILTER_TEXT_CHANGED', { text });
};

export const setFilterAssertionView = (
  { state }: PresenterConfig,
  assertionViewId: number,
) => {
  state.schematron.send('FILTER_ASSERTION_VIEW_CHANGED', { assertionViewId });
};

export const setPassStatus = (
  { state }: PresenterConfig,
  passStatus: PassStatus,
) => {
  state.schematron.send('FILTER_PASS_STATUS_CHANGED', { passStatus });
};
