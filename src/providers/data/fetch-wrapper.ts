import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};

const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-name": "true",
    },
  });
};

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }
  if ("errors" in body) {
    const error = body?.errors;

    const messages = error?.map((error) => error?.message)?.join("");
    const code = error?.[0]?.extensions?.code;

    return {
      message: messages || JSON.stringify(error),
      statusCode: (code as string) || "500",
    };
  }
  return null;
};

const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  const responseClone = response.clone();
  const body = await response.json();
  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }
  return responseClone;
};

export { fetchWrapper };
