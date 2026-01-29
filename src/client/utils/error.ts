// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return (
      error?.data?.message ??
      error?.data?.error ??
      error?.error ??
      "An unknown error occurred."
    );
  }
};
