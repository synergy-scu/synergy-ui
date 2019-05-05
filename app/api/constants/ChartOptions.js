import { UsageTypes } from "./ChartTypes";

export const PeriodFormatter = {
    h: '%I:%M %p',
    d: "%b %d",
    w: "%b %d",
    M: "%B %y",
    y: "%Y",
    [UsageTypes.REALTIME]: '%I:%M %p',
};
