export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "A simple starting point for building better fitness habits.",
    price: "$49",
    period: "month",
    popular: false,

    whatsappMessage:
      "Hello! I am interested in the Starter fitness coaching plan ($49/month). I would like to know more about it.",

    features: [
      "Personalized workout plan",
      "Basic nutrition guide",
      "Weekly check-ins",
    ],
  },

  {
    id: "transformation",
    name: "Transformation",
    description: "A complete coaching plan for consistent progress.",
    price: "$79",
    period: "month",
    popular: true,

    whatsappMessage:
      "Hello! I am interested in the Transformation fitness coaching plan ($79/month). I would like to know more about it.",

    features: [
      "Customized workout & nutrition plan",
      "Weekly progress tracking",
      "Direct coach support",
      "Lifestyle guidance",
    ],
  },

  {
    id: "premium",
    name: "Premium",
    description: "More personalized support for your fitness journey.",
    price: "$129",
    period: "month",
    popular: false,

    whatsappMessage:
      "Hello! I am interested in the Premium fitness coaching plan ($129/month). I would like to know more about it.",

    features: [
      "Everything in Transformation",
      "1:1 video call monthly",
      "Priority support",
      "Advanced workout plans",
    ],
  },
];