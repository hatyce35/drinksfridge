export const requestFullscreenMode = async (): Promise<boolean> => {
  try {
    const docEl = document.documentElement as any;
    if (!docEl) return false;

    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen({ navigationUI: 'hide' });
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
    }
    return true;
  } catch (err) {
    console.warn('Fullscreen request error:', err);
    return false;
  }
};

export const exitFullscreenMode = async (): Promise<boolean> => {
  try {
    const doc = document as any;
    if (!doc) return false;

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    }
    return true;
  } catch (err) {
    console.warn('Exit fullscreen error:', err);
    return false;
  }
};

export const isFullscreenActive = (): boolean => {
  const doc = document as any;
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement
  );
};

export const toggleFullscreenMode = async (): Promise<boolean> => {
  if (isFullscreenActive()) {
    await exitFullscreenMode();
    return false;
  } else {
    return await requestFullscreenMode();
  }
};
