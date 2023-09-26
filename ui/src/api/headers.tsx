const CSRFTokenHeaderName = 'X-CSRFToken';

const factoryHeader = (headerName: string, headerValue: any) => {
  return {
    headerName: headerName,
    value: headerValue,
    getValue() {
      return headerValue;
    },
    setValue(value: any) {
      headerValue = value;
    },
  };
};

/**
 * Global module-scoped variable to track the value of the CSRF Token.
 *
 * The Open Zaaktype Beheer includes the value of the CSRF Token as a header in fetch api
 * calls if it's set.
 */
let CSRFToken = factoryHeader(CSRFTokenHeaderName, null);

export { CSRFToken };
