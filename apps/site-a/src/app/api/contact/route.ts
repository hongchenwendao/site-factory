import { z } from "zod";

import { apiSuccess, apiError } from "@/lib/api-response";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // In production, send email or push to a queue here.
    // For now, log and return success.
    console.log("[contact] Form submission:", {
      company: validated.company,
      email: validated.email,
      name: validated.name,
    });

    return apiSuccess(
      { ok: true as const, submittedAt: new Date().toISOString() },
      200,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Invalid form data", "VALIDATION_ERROR", 400, error.issues);
    }

    console.error("[contact] Unexpected error:", error);
    return apiError("Failed to send message", "INTERNAL_ERROR", 500);
  }
}
