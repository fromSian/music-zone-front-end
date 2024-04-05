export type CommonError = {
  message: string;
};

export function isCommonError(error: unknown): error is CommonError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

const convertToCommonError = (error: unknown): CommonError => {
  if (isCommonError(error)) {
    return error;
  }
  try {
    return new Error(JSON.stringify(error));
  } catch (error) {
    // 如果抛出的异常不是object
    return new Error(String(error));
  }
};

export const getErrorMessage = (error: unknown): string => {
  return convertToCommonError(error).message;
};
