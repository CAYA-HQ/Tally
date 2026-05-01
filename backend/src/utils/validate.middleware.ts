export const validate =
  (schema: any) => (req: any, _res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };