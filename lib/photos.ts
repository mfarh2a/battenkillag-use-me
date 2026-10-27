// Public domain photos from the U.S. Department of Agriculture (Flickr: USDAgov,
// Creative Commons Public Domain Mark 1.0). No credit is required. Kept here for our records.
// To swap a photo, replace its src with another live.staticflickr.com image address.

export const photos = {
  orchardSunrise: {
    src: "https://live.staticflickr.com/65535/49445752567_6fdea2387c_b.jpg",
    alt: "Sunrise over rows of apple trees on a family orchard in autumn",
    width: 1024,
    height: 683,
    source: "https://www.flickr.com/photos/usdagov/49445752567/",
  },
  orchardAerial: {
    src: "https://live.staticflickr.com/65535/49431847512_69f1c90e29_b.jpg",
    alt: "Aerial view of apple orchards, pasture and a farm barn in fall color",
    width: 1024,
    height: 682,
    source: "https://www.flickr.com/photos/usdagov/49431847512/",
  },
  cranberryHarvest: {
    src: "https://live.staticflickr.com/65535/49815177093_d9810fb2f1_b.jpg",
    alt: "Cranberry bog during the fall harvest",
    width: 1024,
    height: 683,
    source: "https://www.flickr.com/photos/usdagov/49815177093/",
  },
  valleySunrise: {
    src: "https://live.staticflickr.com/65535/49431751221_d475059609_b.jpg",
    alt: "Sunrise over farm fields and hills in fall color",
    width: 1024,
    height: 576,
    source: "https://www.flickr.com/photos/usdagov/49431751221/",
  },
  battenkillRiver: {
    src: "/images/battenkill-river.jpg",
    alt: "The Battenkill River in fall, with wooded hills along the bank",
    width: 1179,
    height: 786,
    source: "Max Farrell's own photo",
  },
} as const;

export type PhotoKey = keyof typeof photos;
