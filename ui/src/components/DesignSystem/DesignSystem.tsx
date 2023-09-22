/**
 * Define spacing for Stack components
 * will be removed in next PR :(
 * @deprecated Use spacings['size'] instead
 */
export const spacing = { xs: 2, sm: 2, md: 3 };

/**
 * Define spacing for MUI components
 */
export const spacings = {
  xsmall: 1,
  small: { xs: 1, sm: 1, md: 2 },
  medium: { xs: 2, sm: 2, md: 3 },
  large: { xs: 3, sm: 3, md: 4 },
  xlarge: { xs: 4, sm: 5, md: '48px' },
  xxlarge: { xs: 4, sm: '48px', md: '64px' },
};

/**
 * Define styling for outlined input field
 */
export const outlinedInputStyling = {
  '&:hover:not(&.Mui-focused) .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(0, 0, 0, .04)',
  },
  fieldset: {
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    border: '1px solid rgba(0, 0, 0, 0.12)',
  },
};

/**
 * Define media queries for responsive design
 * Should be used in combination with useMediaQuery hook
 * @see https://mui.com/material-ui/react-use-media-query/
 */
export const mediaQueries = {
  mobile: '(max-width:420px)',
  largeMobile: '(max-width:600px)',
  tablet: '(max-width:768px)',
  desktop: '(max-width: 1024px)',
  largeDesktop: '(max-width: 1440px)',
};

export const dynamicWidth = (columnCount: number, gapSize: number) => {
  return `calc(100% / ${columnCount} - ${gapSize}px * ${columnCount - 1} / ${columnCount})`;
};

// Create a function that can be used to calculate the height that is left over
export const headerHeight = 63.5;
export const tabsHeight = 48;
export const currentMargin = 48;

export const stickyHeight = (type: string) => {
  return {
    top:
      headerHeight +
      (type !== 'tabs' ? tabsHeight : 0) +
      (type !== 'tabs' && type !== 'sidebar' ? 40 : 0),
    height: 'fit-content',
    position: 'sticky',
  };
};
