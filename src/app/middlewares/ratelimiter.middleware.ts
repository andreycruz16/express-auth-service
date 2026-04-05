import rateLimit from "express-rate-limit";

// Rate limiter for general API routes - 15 minutes, 1000 requests
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

// Rate limiter for authentication routes - 10 minutes, 1000 requests
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
});