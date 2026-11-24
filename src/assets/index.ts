import steps from './steps.webp';
import window_ from './window.webp';
import treehead from './treehead.jpg';
import wlead from './wlead.jpg';
import wwalk from './wwalk.jpg';
import vwalk from './vwalk.webp';
import embrace from './embrace.jpg';
import vkiss from './vkiss.webp';
import beach from './beach.jpg';
import hands from './hands.webp';
import bow from './bow.png';
import coupleMark from './couple-mark.png';

export const IMG = { steps, window: window_, treehead, wlead, wwalk, vwalk, embrace, vkiss, beach, hands } as const;
export type ImgKey = keyof typeof IMG;
export { bow, coupleMark };
