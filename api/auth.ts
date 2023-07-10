import type { VercelRequest, VercelResponse } from "@vercel/node";
import totp from "totp-generator";

export default function (request: VercelRequest, response: VercelResponse) {
  try {
    const body = request.body || {};
    const {
      algorithm = "SHA-1",
      timeStep = 30, // Time steps in seconds.
      digits = 6, // Number of digits to generate.
    } = body;

    // Get shared key from ENV if not provided in body.
    const sharedKey = body.sharedKey || process.env.TFA_SHARED_KEY;

    const otp = totp(sharedKey, {
      algorithm,
      digits,
      period: timeStep,
    });

    response.json({
      otp,
      digits,
      timeStep,
    });
  } catch (error) {
    response.json({
      error: true,
      message: error?.message || "Server error!",
    });
  }
}
