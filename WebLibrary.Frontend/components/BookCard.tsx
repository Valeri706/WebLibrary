"use client";

import React, { FC } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { HeartIcon } from "lucide-react";
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";

import { cutIfLonger } from "@/lib/tools";

interface IBookCardProps {
  imageUrl: string;
  name: string;
  description: string;
}

const BookCard: FC<IBookCardProps> = ({ imageUrl, name, description }) => {
  const [liked, setLiked] = React.useState(false);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
    >
      <CardBody>
        <div className="h-full w-full flex flex-col">
          <div className="h-full flex flex-col xs:flex-row px-3">
            <div className="flex items-center flex-shrink-0 justify-center xs:justify-normal my-3 xs:my-0 xs:mr-8">
              <Image
                alt="Album cover"
                className="object-cover hover:scale-125"
                shadow="md"
                src={imageUrl}
                width={120}
              />
            </div>

            <div className="mt-4">
              <p className="font-bold text-foreground mb-3 pr-5">{name}</p>
              <p className="text-xs font-light dark:text-foreground/70 ">
                {cutIfLonger(description, 170)}
              </p>
            </div>

            <Button
              isIconOnly
              className="text-default-900/60 data-[hover]:bg-foreground/10
              absolute right-3 top-3"
              radius="full"
              variant="light"
              onPress={() => setLiked((v) => !v)}
            >
              <HeartIcon
                className={liked ? "[&>path]:stroke-transparent" : ""}
                fill={liked ? "currentColor" : "none"}
              />
            </Button>
          </div>

          <div className="w-full flex justify-end mt-3">
            <Button
              className={buttonStyles({
                variant: "bordered",
                radius: "sm",
                className: "py-0 mr-0",
              })}
            >
              Читати далі
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BookCard;
