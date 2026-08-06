// Only students with one of these school domains may register/sign in.
export const ALLOWED_EMAIL_DOMAINS = ["rupp.edu.kh", "itc.edu.kh"];

export const isAllowedSchoolEmail = (email = "") => {
  const domain = email.trim().toLowerCase().split("@")[1] || "";
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};
