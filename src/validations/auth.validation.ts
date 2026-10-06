import z from "zod";


const allowedEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
];


export const loginValidation = z.object({
  email: z.email("Use a valid email").refine(
    (email) => {
      const domain = email.split("@")[1]?.toLowerCase();

      return allowedEmailDomains.includes(domain!);
    },
    {
      message: "Please use a valid email",
    },
  ),
  password: z
    .string("Use a strong password")
    .min(6, "Password must contain minimum 6 characters")
    .regex(/[A-Z]/, "Password must contain one uppercase letter")
    .regex(/[a-z]/, "Password must contain one lowercase letter")
    .regex(/[0-9]/, "Password must contain one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain one special character"),
});
