import { useRef } from 'react';
import spriteSvg from 'uswds/img/sprite.svg';

import * as schematron from '@asap/browser/presenter/actions/schematron';
import type { OscalDocumentKey } from '@asap/shared/domain/oscal';

import { colorTokenForRole } from '../../util/styles';
import { useAppContext } from '../context';
import { selectFilterOptions } from '@asap/browser/presenter/state/selectors';
import '../styles/ValidatorResultsFilterForm.scss';

type Props = {
  documentType: OscalDocumentKey;
};

export const ValidatorResultsFilterForm = ({ documentType }: Props) => {
  const { state } = useAppContext();
  const oscalDocument = state.oscalDocuments[documentType];
  const { dispatch } = useAppContext();

  const filterOptions = selectFilterOptions(documentType)(state);

  const topRef = useRef<HTMLHeadingElement>(null);
  const scrollIntoView = () => {
    if (topRef && topRef.current && topRef.current.parentElement) {
      topRef.current.parentElement.scrollIntoView();
    }
  };
  return (
    <>
      <aside className="padding-y-2 radius-lg padding-x-3">
        <h2 className=" font-sans-xl" ref={topRef}>
          Filtering Options
        </h2>

        <div
          className="usa-search usa-search--small margin-bottom-2"
          role="search"
        >
          <label className="usa-sr-only" htmlFor="search-field-en-small">
            Search
          </label>
          <input
            className="usa-input"
            type="search"
            name="search"
            id={`${documentType}-search-field`}
            autoComplete="off"
            onChange={event => {
              let text = '';
              if (event && event.target) {
                text = event.target.value;
              }
              dispatch(schematron.setFilterText({ documentType, text }));
            }}
            placeholder="Search text..."
          />
          <button className="usa-button" type="submit">
            <svg
              aria-hidden="true"
              role="img"
              focusable="false"
              className="usa-icon"
            >
              <use
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xlinkHref={`${spriteSvg}#search`}
              />
            </svg>
          </button>
        </div>
        <fieldset className="usa-fieldset">
          <legend className="usa-legend font-sans-md">
            Filter by pass status
          </legend>
          <div className="usa-radio">
            {filterOptions.passStatuses.map(passStatus => (
              <div key={passStatus.id}>
                <input
                  className="usa-radio__input usa-radio__input--tile"
                  id={`${documentType}-status-${passStatus.id}`}
                  type="radio"
                  name="pass-status"
                  value={passStatus.id}
                  checked={oscalDocument.filter.passStatus === passStatus.id}
                  disabled={!passStatus.enabled}
                  onChange={() => {
                    dispatch(
                      schematron.setPassStatus({
                        documentType,
                        passStatus: passStatus.id,
                      }),
                    );
                    scrollIntoView();
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`${documentType}-status-${passStatus.id}`}
                >
                  {passStatus.title}
                  <span
                    className="margin-left-1 usa-tag"
                    title={`${passStatus.count} results`}
                  >
                    {passStatus.count}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <legend className="usa-legend font-sans-md">Select a view</legend>
          <div className="usa-radio">
            {filterOptions.assertionViews.map(assertionView => (
              <div key={assertionView.index}>
                <input
                  className="usa-radio__input usa-radio__input--tile"
                  id={`${documentType}-assertion-view-${assertionView.index}`}
                  type="radio"
                  name="assertion-view"
                  value={assertionView.index}
                  checked={
                    oscalDocument.filter.assertionViewId === assertionView.index
                  }
                  onChange={() => {
                    dispatch(
                      schematron.setFilterAssertionView({
                        documentType,
                        assertionViewId: assertionView.index,
                      }),
                    );
                    scrollIntoView();
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`${documentType}-assertion-view-${assertionView.index}`}
                >
                  {assertionView.title}
                  <span
                    className="margin-left-1 usa-tag"
                    title={`${assertionView.count} results`}
                  >
                    {assertionView.count}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="usa-radio">
            <legend className="usa-legend font-sans-md">
              Filter by severity
            </legend>
            {filterOptions.roles.map((filterRole, index) => (
              <div
                key={index}
                className={`bg-${colorTokenForRole(filterRole.name)}-lighter`}
              >
                <input
                  className="usa-radio__input usa-radio__input--tile"
                  id={`${documentType}-role-${filterRole.name}`}
                  type="radio"
                  name="role"
                  value={filterRole.name}
                  checked={oscalDocument.filter.role === filterRole.name}
                  onChange={() => {
                    dispatch(
                      schematron.setFilterRole({
                        documentType,
                        role: filterRole.name,
                      }),
                    );
                    scrollIntoView();
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`${documentType}-role-${filterRole.name}`}
                >
                  <svg
                    aria-hidden="true"
                    role="img"
                    focusable="false"
                    className="usa-icon usa-icon--size-3 margin-right-1 margin-bottom-neg-2px"
                  >
                    <use
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      xlinkHref={`${spriteSvg}#${colorTokenForRole(
                        filterRole.name,
                      )}`}
                    />
                  </svg>
                  {filterRole.name.toLocaleUpperCase() || '<not specified>'}
                  <span
                    className="margin-left-1 usa-tag"
                    title={`${filterRole.count} results`}
                  >
                    {filterRole.count}
                  </span>
                  <span className="usa-checkbox__label-description">
                    {filterRole.subtitle}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </aside>
    </>
  );
};
