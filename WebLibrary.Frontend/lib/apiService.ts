import { getSession, signOut } from "next-auth/react";
import {toast} from "sonner";
import {toastFail, toastSuccess} from "@/components/primitives";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/";

interface IRequestProps {
  uri: string;
  onSuccess?: (response: Response) => void;
  onFailed?: (response: Response) => void;
  msg?: [
    ok?: string,
    fail?: string
  ],
}

const send = async (props: IRequestProps, init?: RequestInit) => {
  const session = await getSession();
  let response: Response
  try {
    response = await fetch(`${apiUrl}${props.uri}`, {
      ...init,
      cache: "no-cache",
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
        /* @ts-ignore*/
        Authorization: `Bearer ${session?.jwt}`,
      }
    });
  }
  catch (e) {
    await signOut()
    return response!
  }

  
 
  if(response.status === 401 && session) {
      await signOut()
      return response
  }

  if(response.ok) {
    props.onSuccess?.(response)
    if(props.msg?.[0]) {
      toast.success(props.msg[0], toastSuccess())
    }
  }
  else {
    props.onFailed?.(response);
    if(props.msg?.[1]) {
      toast.error(props.msg[1], toastFail())
    }
  }

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

export const patchRequest = async (props: IRequestProps, content?: any) => {
  return await send(props, {
    method: "PATCH",
    body: JSON.stringify(content),
  });
}

export const deleteRequest = async (props: IRequestProps) => {
  return await send(props, {
    method: "DELETE"
  });
}
