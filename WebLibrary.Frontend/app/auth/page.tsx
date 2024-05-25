"use client";

import { Tabs, Tab } from "@nextui-org/tabs";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import Image from "next/image";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import {usePathname, useSearchParams} from "next/navigation";
import { signIn } from "next-auth/react";

export default function Auth() {
  const params = useSearchParams();
  const [selected, setSelected] = React.useState(
      params.get("p")?.endsWith("register") ? "sign-up" : "login",
  );

  const handleLogin = async () => {
    const response = await signIn( 'credentials',
        {
          redirect:false,
          email: "test email",
          password: "test password"
        }
    )
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
              <Tab key="login" title="Login">
                <form className="flex flex-col gap-4">
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
                    <Button fullWidth color="primary" onClick={handleLogin}>
                      Login
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    placeholder="Enter your name"
                    type="password"
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
                    <Button fullWidth color="primary">
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
