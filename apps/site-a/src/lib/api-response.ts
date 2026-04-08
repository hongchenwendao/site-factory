export function apiSuccess<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function apiError(
  message: string,
  code: string,
  status = 500,
  details?: unknown,
) {
  return Response.json(
    {
      code,
      error: message,
      ...(process.env.NODE_ENV === "development" && details ? { details } : {}),
    },
    { status },
  );
}
