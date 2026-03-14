// src/middleware/validate.js
export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!parsed.success) {
      return res.status(400).json({
        status: '400 Bad Request',
        error: { code: 'VALIDATION', message: 'Invalid request', details: parsed.error.flatten() }
      });
    }
    req.validated = parsed.data;
    next();
  };
}