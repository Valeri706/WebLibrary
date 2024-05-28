"use client"

import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/modal";
import React, {ReactNode, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";
import {deleteRequest, get, patchRequest, post} from "@/lib/apiService";
import {TypeAuthor} from "@/types/EntityTypes";
import {Spinner} from "@nextui-org/spinner";
import {User} from "@nextui-org/user";
import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import {Tooltip} from "@nextui-org/tooltip";
import {Input, Textarea} from "@nextui-org/input";
import {Select, SelectItem} from "@nextui-org/select";
import {UserRole} from "@/types/userRole";
import {DeleteIcon, EditIcon} from "@/components/icons";
import {ConfirmModal} from "@/components/ConfirmModal";
import {DatePicker} from "@nextui-org/date-picker";
import {getLocalTimeZone, parseDate, today} from "@internationalized/date";
import {DateInput} from "@nextui-org/date-input";
import {removeEmptyFields, replaceEmptyStrings} from "@/lib/tools";
import {toast} from "sonner";

export default function AdminAuthors() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [ modalContent, setModalContent ] = useState<ReactNode>(undefined);
    const { data, error, refetch, isFetching } = useQuery<TypeAuthor[]>({
        queryKey: ["authors"],
        queryFn: async () => await (await get({ uri: "author/getrange",
            msg:  [undefined, "При спробі отримати список авторів виникла помилка" ]})).json()
    })
    
    const onRefetch = async (func : Promise<any>) => {
        onClose()
        await func;
        await refetch()
    };

    const {mutate: mutateAdd, isPending } = useMutation(
        {
            mutationKey: ["add author"],
            mutationFn: async (author: any) =>
                await onRefetch(post({uri: "author/add",
                    msg:  ["Автор доданий", "Виникла помилка при доданні автора" ] }, author)
                )
        })

    const { mutate: mutateRemove } = useMutation(
        { mutationKey: ["delete author"],
            mutationFn: async (id: number) => {
                await onRefetch(deleteRequest(
                    { uri: "author/delete?id=" + id,
                        msg:  ["Автор видалений", "Виникла помилка при видаленні" ] })
                )
            }
        })

    const { mutate: mutatePatch } = useMutation(
        { mutationKey: ["patch author"],
            mutationFn: async (content: any) => {
                await onRefetch(patchRequest({ uri: "author/update",
                    msg:  ["Автор оновлений", "Виникла помилка при оновлені" ]}, content))
            }
        })
    
    
    const onMutate = (action: (o: any) => void,author: TypeAuthor | undefined = undefined) => {
        const content =  <>
            <ModalHeader className="flex flex-col gap-1">{author ? "Редагування " + author.name :  "Додавання автора"}</ModalHeader>
            <ModalBody>
                <form className="space-y-4 py-5" onSubmit={(e) => {
                    e.preventDefault()
                    // @ts-ignore
                    const elements = e.currentTarget.elements as HTMLFormElement[]
                    action({
                        id: author?.id,
                        name: elements[0].value,
                        biography: elements[1].value,
                        birthDate: elements[2].value,
                        deathDate: elements[3].value
                    })
                }}>
                    <Input label="Ім'я" isRequired defaultValue={author?.name}
                           placeholder="Введіть ім'я автора"
                    />
                    <Textarea label="Біографія" defaultValue={author?.biography}
                           placeholder="Введіть біографію автора"
                    />
                    <DateInput
                        label="Дата народження" defaultValue={author?.birthDate ? parseDate(author.birthDate) : undefined}
                        maxValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                    />
                    <DateInput
                        label="Дата смерті" defaultValue={author?.deathDate ? parseDate(author.deathDate) : undefined}
                        maxValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                    />
                    <Button type="submit" color="primary" isLoading={isPending}>
                        {author ? "Оновити" : "Додати"}
                    </Button>
                </form>

            </ModalBody>
        </>
        
        setModalContent(content)
        onOpen()
    }
    
    return (
        <>
            <Table aria-label="Authors table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>BIRTH DATE</TableColumn>
                    <TableColumn>DEATH DATE</TableColumn>
                    <TableColumn align="end" className="text-right">
                        <div className="flex items-center justify-end">
                            <span>ACTIONS</span>
                            <Tooltip content="Додати автора">
                                <Button onClick={() => onMutate((e) => {
                                    removeEmptyFields(e)
                                    mutateAdd(e)
                                })}
                                    className="bg-transparent text-foreground hover:text-primary" isIconOnly aria-label="Додати автора" >
                                    <Plus />
                                </Button>
                            </Tooltip>
                        </div>
                        
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No authors to display yet"} isLoading={isFetching}
                           loadingContent={<Spinner />}>
                    {data?.map((row) =>
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.name}
                            </TableCell>
                            <TableCell>
                                {row.birthDate == null ? "-" : new Date(row.birthDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {row.deathDate == null ? "-" : new Date(row.deathDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-end gap-2">
                                    <Tooltip content="Редагувати автора">
                                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                            role="button"
                                      onClick={() => onMutate((o) => {
                                          replaceEmptyStrings(o)
                                          mutatePatch(o)
                                      },row)}>
                                        <EditIcon/>
                                      </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Видалити автора">
                                      <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                            role="button"
                                            onClick={() => {
                                                setModalContent(
                                                    <ConfirmModal onDismiss={onClose}
                                                                  onConfirm={() => mutateRemove(row.id)}
                                                                  header="Підтвердіть дію"
                                                                  body={<p>Ви дійсно хочете видалити автора {row.name}?</p>}/>)
                                                onOpen()
                                            }}>
                                        <DeleteIcon/>
                                      </span>
                                    </Tooltip>
                                </div>

                            </TableCell>
                        </TableRow>
                    ) ?? []}
                </TableBody>
            </Table>
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
                <ModalContent>
                    {() => (
                        modalContent
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}