"use client"

import {useSession} from "next-auth/react";
import {title, toastSuccess} from "@/components/primitives";
import {Divider} from "@nextui-org/divider";
import {Input} from "@nextui-org/input";
import React, {useEffect, useRef, useState} from "react";
import {DatePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import {Button} from "@nextui-org/button";
import {TypeUser} from "@/types/EntityTypes";
import {get, post} from "@/lib/apiService";
import {Spinner} from "@nextui-org/spinner";
import {toast} from "sonner";

export default function Profile() {
    const [isLoading, setLoading] = useState(false)
    const [error,setError] = useState("")
    const [refetch, setRefetch] = useState(false);
    const [user,setUser] = useState<TypeUser | undefined>(undefined);
    
    useEffect(() => {
        get({ uri: "user/info", onSuccess: async (o) => {
            setUser(await o.json()) 
        }})
    },[refetch])
    
    if(!user) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }
    
    return (
        <div>

            <h1 className={title({size: "sm"})}>Ваші налаштування, </h1>
            <h1 className={title({color: "violet", size: "sm"})}>{user.name}</h1>
            <Divider className="my-4"/>

            <form onSubmit={async (e) => {
                e.preventDefault()
                // @ts-ignore
                const elements = e.currentTarget.elements as HTMLFormElement[]
                setLoading(true)
                await post({uri: "user/updatesettings", failMsg: "Виникла помилка", onSuccess:  () => {
                        toast.success('Профіль оновлено', toastSuccess())
                        setRefetch(prev => !prev)
                },
                }, {
                    newName: elements[1].value,
                    newBirth: elements[2].value
                })
                setLoading(false)
            }}>
                <h3 className="text-default-500 text-small my-3 ml-2">Email-адреса</h3>
                <Input
                    label="Email"
                    value={user.email} disabled
                    type="email"
                />
    
                <h3 className="text-default-500 text-small my-3 ml-2">Ваше ім'я</h3>
                <Input
                    isRequired
                    label="Ім'я"
                    defaultValue={user.name}
                    placeholder="Введіть ваше ім'я"
                />
    
                <h3 className="text-default-500 text-small my-3 ml-2">Ваша дата народження</h3>
                <DatePicker
                    label="Дата народження"
                    defaultValue={user.birth ? parseDate(user.birth) : undefined}
                    maxValue={today(getLocalTimeZone()).subtract({days: 1})}
                    showMonthAndYearPickers={true}
                />
                <Button type="submit" className="my-8" color="primary" isLoading={isLoading}>
                    Оновити інформацію
                </Button>
            </form>

            <form onSubmit={async e => {
                e.preventDefault();
                setLoading(true)
                // @ts-ignore
                const elements = e.currentTarget.elements as HTMLFormElement[]
                if(elements[0].value === elements[1].value) {
                    setError("Введіть пароль, який буде відрізнятися від старого")
                    setLoading(false)
                    return
                }
                await post({
                    uri: "user/updatepassword",
                    onSuccess: () => {
                        setError("")
                        toast.success('Пароль оновлено', toastSuccess())
                    },
                    onFailed: (e) => {
                        setError(e.status === 403 ? "Поточний пароль не правильний" : "Виникла помилка")
                    }
                }, {
                    currentPassword: elements[0].value,
                    newPassword: elements[1].value
                })
                setLoading(false)
            }}>
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
                <p className="text-tiny text-danger mt-4">{error}</p>
                <Button type="submit" className="my-4" color="primary" isLoading={isLoading}>
                    Оновити пароль
                </Button>
            </form>
        </div>
    );
}