/** AdSense placement slot IDs — set in env for production; empty disables that placement. */
export const adSlots = {
  homeBetweenTools: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "",
  setBelowChart: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SET ?? "",
  toolBelowResults: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL ?? "",
};
