"use client"

import {useSession} from "next-auth/react";
import {title} from "@/components/primitives";
import {Divider} from "@nextui-org/divider";
import {Input} from "@nextui-org/input";
import React from "react";
import {DatePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, today} from "@internationalized/date";
import {Button} from "@nextui-org/button";

export default function Profile() {
    const {data: session} = useSession();
    return (
        <div>

            <h1 className={title({size: "sm"})}>Ваші налаштування, </h1>
            <h1 className={title({color: "violet", size: "sm"})}>{session?.user?.name}</h1>
            <Divider className="my-4"/>

            <h3 className="text-default-500 text-small my-3 ml-2">Ваше ім'я</h3>
            <Input
                isRequired
                label="Ім'я"
                value={session?.user?.name!}
                placeholder="Введіть ваше ім'я"
            />

            <h3 className="text-default-500 text-small my-3 ml-2">Поточна email-адреса</h3>
            <Input
                isRequired
                label="Email"
                value={session?.user?.email!}
                placeholder="Введіть вашу email-адресу"
                type="email"
            />

            <h3 className="text-default-500 text-small my-3 ml-2">Ваша дата народження</h3>
            <DatePicker
                label="Дата народження"
                maxValue={today(getLocalTimeZone()).subtract({days: 1})}
                showMonthAndYearPickers={true}
            />
            <Button type="submit" className="my-8" color="primary">
                Оновити інформацію
            </Button>

            <h3 className="text-default-500 text-small my-3 ml-2">Поточний пароль</h3>
            <Input
                isRequired
                label="Пароль"
                placeholder="Введіть ваш поточний пароль"
                type="password"
            />

            <h3 className="text-default-500 text-small my-3 ml-2">Новий пароль</h3>
            <Input
                isRequired
                label="Пароль"
                placeholder="Введіть ваш новий пароль"
                type="password"
            />

            <Button type="submit" className="my-8" color="primary">
                Оновити пароль
            </Button>
        </div>
    );
}