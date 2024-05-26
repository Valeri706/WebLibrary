import { getSession, signOut } from "next-auth/react";

const apiUrl = "http://localhost:5214/api/";

interface IRequestProps {
  uri: string;
  onSuccess?: (json: any) => void;
  onFailed?: (response: Response) => void;
}

const send = async (props: IRequestProps, init?: RequestInit) => {
  const session = await getSession();
  const response = await fetch(`${apiUrl}${props.uri}`, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      /* @ts-ignore*/
      Authorization: `Bearer ${session?.jwt}`,
    }
  });
  
  if(response.status === 401 && session) {
      await signOut()
  }

  response.ok
    ? props.onSuccess?.(await response.json())
    : props.onFailed?.(response);

  return response;
};

export const post = async (props: IRequestProps, content?: any) => {
  return await send(props, {
    method: "POST",
    body: JSON.stringify(content),
  });
};

export const get = async (props: IRequestProps) => {
  return await send(props, {
    method: "GET"
  });
}
