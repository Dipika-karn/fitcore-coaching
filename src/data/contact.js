


export const contactInfo = {
  whatsappNumber: "918294592689",

  whatsappMessage:
    "Hello! I would like to know more about your fitness coaching program.",
};

export const whatsappUrl =
  `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(
    contactInfo.whatsappMessage
  )}`;