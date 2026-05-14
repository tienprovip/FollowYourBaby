// ---------------------------------------------------------------------------
// Minimal zod resolver for react-hook-form.
// Replaces @hookform/resolvers/zod so we avoid an extra npm dependency.
// Compatible with react-hook-form v7 resolver contract.
// ---------------------------------------------------------------------------

import type { Resolver, FieldValues } from 'react-hook-form';
import type { ZodSchema, ZodError } from 'zod';

/**
 * Creates a react-hook-form resolver that validates values against a Zod schema.
 * Errors are mapped to the field-path format react-hook-form expects.
 */
export function zodResolver<T extends FieldValues>(
  schema: ZodSchema<T>,
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const zodError = result.error as ZodError;
    const errors: Record<string, { type: string; message: string }> = {};

    for (const issue of zodError.issues) {
      const path = issue.path.join('.');
      if (path && !errors[path]) {
        errors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    }

    return { values: {}, errors } as ReturnType<Resolver<T>>;
  };
}
