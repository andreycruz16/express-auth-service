import rateLimit from "express-rate-limit";

// Rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

// Rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
});