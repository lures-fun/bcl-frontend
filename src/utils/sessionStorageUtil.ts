export type TimelineSession = {
  timelinePage: number;
  timelineScroll: number;
  maximumScrollHeight: number;
};

//Timeline
export const setTimelineSession = ({
  timelinePage,
  timelineScroll,
  maximumScrollHeight,
}: TimelineSession): void => {
  sessionStorage.setItem('timelinePage', JSON.stringify(timelinePage));
  sessionStorage.setItem('timelineScroll', JSON.stringify(timelineScroll));
  sessionStorage.setItem('maximumScrollHeight', JSON.stringify(maximumScrollHeight));
};

export const getTimelineSession = (): TimelineSession | null => {
  try {
    const page = sessionStorage.getItem('timelinePage');
    const scroll = sessionStorage.getItem('timelineScroll');
    const maximumScrollHeight = sessionStorage.getItem('maximumScrollHeight');
    if (page && scroll) {
      return {
        timelinePage: JSON.parse(page) as number,
        timelineScroll: JSON.parse(scroll) as number,
        maximumScrollHeight: JSON.parse(maximumScrollHeight || '0') as number,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error getting timeline session data:`, error);
    return null;
  }
};

export const removeTimelineSession = (): void => {
  sessionStorage.removeItem('timelinePage');
  sessionStorage.removeItem('timelineScroll');
  sessionStorage.removeItem('maximumScrollHeight');
};
// Timeline End
