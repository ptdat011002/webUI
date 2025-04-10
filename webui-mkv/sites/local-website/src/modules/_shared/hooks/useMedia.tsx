// return mode layout
/**
 *  4k screen: 3840px x 2160px
 *  2k screen: 2560px x 1440px
 *  hd screen: 1920px x 1080px
 *  laptop screen: 1536px x 864px
 *  tablet screen: 1024px x 768px
 *  mobile screen: 375px x 667px
 *  other
 */

import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

export type ILayoutType =
  | '4k'
  | '2k'
  | 'hd'
  | 'laptop'
  | 'tablet'
  | 'mobile'
  | 'other';

const mediaQuery = {
  '4k': '(min-width: 2561px)',
  '2k': '(min-width: 1921px)',
  hd: '(min-width: 1537px)',
  laptop: '(min-width: 1025px)',
  mobile: '(min-width: 376px)',
};

export const useBreakPoint = () => {
  /** listen media change */

  const [mode, setMode] = useState<ILayoutType>('other');

  const setModeOnResize = useMemo(() => {
    return debounce((mode: ILayoutType) => setMode(mode), 100);
  }, []);

  useEffect(() => {
    // set default mode
    for (const key in mediaQuery) {
      if (window.matchMedia(mediaQuery[key]).matches) {
        setMode(key as ILayoutType);
        break;
      }
    }

    window.addEventListener('resize', () => {
      for (const key in mediaQuery) {
        if (window.matchMedia(mediaQuery[key]).matches) {
          setModeOnResize(key as ILayoutType);
          break;
        }
      }
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return mode;
};
