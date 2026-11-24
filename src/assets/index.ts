import steps from './steps.jpg';
import window_ from './window.jpg';
import treehead from './treehead.jpg';
import wlead from './wlead.jpg';
import wwalk from './wwalk.jpg';
import vwalk from './vwalk.jpg';
import embrace from './embrace.jpg';
import vkiss from './vkiss.jpg';
import beach from './beach.jpg';
import bow from './bow.png';
import coupleMark from './couple-mark.png';

export const IMG = { steps, window: window_, treehead, wlead, wwalk, vwalk, embrace, vkiss, beach } as const;
export type ImgKey = keyof typeof IMG;
export { bow, coupleMark };
