import type { TaskQueryRequest } from "@/@types";

export const extractBoolQueryParam = (
  request: TaskQueryRequest,
  key: string,
): boolean | undefined => {
  return request.query[key] === "true"
    ? true
    : request.query[key] === "false"
      ? false
      : undefined;
};

export const extractStringQueryParam = (
  request: TaskQueryRequest,
  key: string,
): string | undefined => {
  return request.query[key] === "undefined" || request.query[key] === undefined
    ? undefined
    : (request.query[key] as string);
};
