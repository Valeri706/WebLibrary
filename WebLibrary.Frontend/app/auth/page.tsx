"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";
import React, {FormEvent, Suspense, useState} from "react";
import Image from "next/image";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useRouter, useSearchParams} from "next/navigation";
import { signIn } from "next-auth/react";
import { post } from "@/lib/apiService";

export default function Auth ()  {
  return (
      <Suspense>
        <AuthComponent />
      </Suspense>
  )
}

const AuthComponent = () => {
  const router = useRouter()
  const params = useSearchParams();
  const [signupError, setSignupError] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = React.useState(
    params.get("p")?.endsWith("register") ? "sign-up" : "login",
  );

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    const response = await signIn("credentials", {
      redirect: false,
      email: (e.currentTarget.elements[0] as HTMLFormElement).value as string,
      password: (e.currentTarget.elements[1] as HTMLFormElement)
        .value as string,
    });
    
    if(!response || response.ok) {
      router.refresh()
      return;
    } 
    
    switch(response.status)
    {
      case 401:
        setLoginError("Неправильні дані для входу")
        break;
      default:
        setLoginError("Виникла помилка при реєстрації")
        break;
    }
    setIsLoading(false)
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    await post(
        { 
          uri: "user/signup", 
          onFailed: o => {
            switch(o.status) {
              case 409:
                setSignupError("Користувач з таким Email вже існує")
                break;
              default:
                setSignupError("Виникла помилка при реєстрації")
                break;
            }
          },
          onSuccess: async o => {
            await signIn("credentials",{ token: (await o.json()).token })
          }
        },
        {
          name: (e.currentTarget.elements[0] as HTMLFormElement).value as string,
          birth: (e.currentTarget.elements[1] as HTMLFormElement).value || undefined,
          email: (e.currentTarget.elements[3] as HTMLFormElement).value as string,
          password: (e.currentTarget.elements[4] as HTMLFormElement).value as string,
        },
    );
    setIsLoading(false)
    return
  }

  return (
    <section>
      <div
        aria-hidden={true}
        className="pointer-events-none fixed -right-[20%] bottom-[-20%] z-20 h-screen w-[1400px] touch-none  md:right-[-15%] xl:w-[1800px] xl:bottom-[-5%] overflow-hidden"
      >
        <Image
          alt="support bg gradient"
          className="h-full w-full overflow-hidden opacity-100"
          fill={true}
          loading="lazy"
          src="/default-gradient.png"
        />
      </div>
      <div className="flex flex-col w-full items-center justify-center pt-[1%]">
        <Card className="max-w-full w-[400px]">
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              aria-label="Tabs form"
              selectedKey={selected}
              size="md"
              /* @ts-ignore*/
              onSelectionChange={setSelected}
            >
              <Tab key="login" title="Login" >
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <Input
                      isRequired
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                  />
                  <Input
                      isRequired
                      label="Password"
                      placeholder="Enter your password"
                      type="password"
                  />
                  <p className="text-tiny text-danger">{loginError}</p>
                  <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link
                        className="cursor-pointer"
                        size="sm"
                        onPress={() => setSelected("sign-up")}
                    >
                      Sign up
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button isLoading={isLoading}
                        fullWidth
                        color="primary"
                        type="submit"
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    placeholder="Enter your name"
                    type="tel"
                  />
                  <DatePicker
                    label="Birth date"
                    maxValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                    showMonthAndYearPickers={true}
                  />
                  <Input
                    isRequired
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                  />
                  <p className="text-tiny text-danger">{signupError}</p>
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link
                      className="cursor-pointer"
                      size="sm"
                      onPress={() => setSelected("login")}
                    >
                      Login
                    </Link>
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button type="submit" fullWidth color="primary" isLoading={isLoading}>
                      Sign up
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
