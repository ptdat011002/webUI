import { useEffect } from "react";
// import { unstable_usePrompt } from "react-router-dom";
import { useBlocker } from "react-router-dom";

const useWarningOnLeave = (isShowWarning, t) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isShowWarning) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isShowWarning]);

  // unstable_usePrompt({
  //   message: t('unsaved_changes_warning'),
  //   when: isShowWarning,
  // });

  useBlocker(({ currentLocation, nextLocation }) => {
    if (isShowWarning && ((currentLocation.pathname !== nextLocation.pathname) /*|| (currentLocation.search !== nextLocation.search)*/)) {
      return !window.confirm(t('unsaved_changes_warning'));
    }
    return false;
  });
};

export default useWarningOnLeave;
