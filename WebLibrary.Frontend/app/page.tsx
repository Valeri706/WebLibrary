"use client"

import Link from 'next/link'
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import {Button} from "@nextui-org/button";
import {useSession} from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Досліджуйте світ&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>знань&nbsp;</h1>
        <br />
        <h1 className={title()}>з нашою величезною колекцією книг</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Зареєструйтесь сьогодні та почніть свою подорож у світ читання!
        </h2>
      </div>

        { session === null &&
            <div className="flex gap-3">
                <Button
                    as={Link}
                    className={buttonStyles({
                        color: "primary",
                        radius: "full",
                        variant: "shadow",
                    })}
                    href="/auth?p=register"
                >
                    Зареєструватися
                </Button>
                <Button
                    as={Link}
                    className={buttonStyles({variant: "bordered", radius: "full"})}
                    href="/auth"
                >
                    Увійти
                </Button>
            </div>
        }


        <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="flat">
          <span className="sm:block flex flex-col justify-center items-center gap-1">
            Або ж перегляньте нашу бібліотеку{" "}
              <Code className="cursor-pointer" color="primary">
              прямо зараз
            </Code>
          </span>
            </Snippet>
        </div>
    </section>
  );
}
