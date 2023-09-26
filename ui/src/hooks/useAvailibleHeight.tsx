import { useMemo } from 'react';
import { currentMargin, headerHeight, tabsHeight } from '../components/DesignSystem/DesignSystem';

/**
 * Working for now with fixed values (only on large screens). Should be improved to responsive value.
 * @param articleRefs the
 * @returns
 */
function useAvailableHeight(element: any) {
  return useMemo(() => {
    return `calc(100vh - 50px - 24px - 48px - ${tabsHeight}px - ${currentMargin}px - ${headerHeight}px - ${element?.clientHeight}px)`;
  }, [element]);
}

export default useAvailableHeight;
