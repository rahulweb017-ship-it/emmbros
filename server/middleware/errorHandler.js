export function errorHandler(err, req, res, next) {
  console.error("[error-handler]", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      ok: false,
      error: "Validation failed",
      details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      ok: false,
      error: `Invalid format for ${err.path}: ${err.value}`,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      ok: false,
      error: `A record with this ${field} already exists.`,
    });
  }

  const statusCode = err.statusCode || res.statusCode || 500;
  res.status(statusCode < 400 ? 500 : statusCode).json({
    ok: false,
    error: err.message || "An internal server error occurred.",
  });
}
