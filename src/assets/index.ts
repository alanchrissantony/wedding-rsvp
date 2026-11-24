import steps from './steps.webp';
import window_ from './window.webp';
import treehead from './treehead.webp';
import wlead from './wlead.webp';
import wwalk from './wwalk.webp';
import vwalk from './vwalk.webp';
import embrace from './embrace.webp';
import vkiss from './vkiss.webp';
import beach from './beach.webp';
import hands from './hands.webp';
import bow from './bow.webp';
import coupleMark from './couple-mark.webp';

export const IMG = { steps, window: window_, treehead, wlead, wwalk, vwalk, embrace, vkiss, beach, hands } as const;
export type ImgKey = keyof typeof IMG;
export { bow, coupleMark };
