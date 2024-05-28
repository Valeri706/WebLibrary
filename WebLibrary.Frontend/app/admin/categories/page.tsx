"use client"

import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/modal";
import React, {ReactNode, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {TypeAuthor, TypeCategory} from "@/types/EntityTypes";
import {deleteRequest, get, patchRequest, post} from "@/lib/apiService";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Tooltip} from "@nextui-org/tooltip";
import {Button} from "@nextui-org/button";
import {removeEmptyFields, replaceEmptyStrings} from "@/lib/tools";
import {Plus} from "lucide-react";
import {Spinner} from "@nextui-org/spinner";
import {DeleteIcon, EditIcon} from "@/components/icons";
import {ConfirmModal} from "@/components/ConfirmModal";
import {Input, Textarea} from "@nextui-org/input";
import {toastSuccess} from "@/components/primitives";
import {toast} from "sonner";

export default function AdminCategories() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [ modalContent, setModalContent ] = useState<ReactNode>(undefined);
    const { data, error, refetch, isFetching } = useQuery<TypeCategory[]>({
        queryKey: ["categories"],
        queryFn: async () => await (await get({ uri: "category/getrange",
            msg:  [undefined, "При спробі отримати список категорій виникла помилка" ] })).json()
    })

    const onRefetch = async (func : Promise<any>) => {
        onClose()
        await func;
        await refetch()
    };

    const { mutate: mutateRemove, isPending: isRemovePending } = useMutation(
        { mutationKey: ["delete category"],
            mutationFn: async (id: number) => {
                await onRefetch(deleteRequest({ uri: "category/delete?id=" + id,
                    msg:  ["Категорія видалена", "Виникла помилка при видаленні" ]}))
            }
        })

    const {mutate: mutateAdd, isPending: isAddPending } = useMutation(
        {
            mutationKey: ["add category"],
            mutationFn: async (content: any) =>
                await onRefetch(post({uri: "category/add",
                    msg:  ["Категорія додана", "Виникла помилка при доданні" ]}, content))
        })

    const { mutate: mutatePatch, isPending: isPatchPending } = useMutation(
        { mutationKey: ["patch category"],
            mutationFn: async (content: any) => 
                await onRefetch(patchRequest({ uri: "category/update",
                    msg:  ["Категорія оновлена", "Виникла помилка при оновлені" ] }, content))
        })
    
    const onMutate = (action: (o: any) => void,category: TypeCategory | undefined = undefined) => {

        const content =  <>
            <ModalHeader className="flex flex-col gap-1">{category ? "Редагування " + category.name :  "Додавання категорії"}</ModalHeader>
            <ModalBody>
                <form className="space-y-4 py-5" onSubmit={(e) => {
                    e.preventDefault()
                    // @ts-ignoreрр
                    const elements = e.currentTarget.elements as HTMLFormElement[]
                    action({
                        id: category?.id,
                        name: elements[0].value,
                        description: elements[1].value,
                    })
                }}>
                    <Input label="Назва категорії" isRequired defaultValue={category?.name}
                           placeholder="Для дітей"
                    />
                    <Textarea label="Опис категорії" isRequired maxLength={300} defaultValue={category?.description}
                              placeholder="Введіть опис"
                    />
                    <Button type="submit" color="primary">
                        {category ? "Оновити" : "Додати"}
                    </Button>
                </form>
            </ModalBody>
        </>
        setModalContent(content)
        onOpen()
    }
    
    return (
        <>
            <Table aria-label="Categories table">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn align="end" className="text-right">
                        <div className="flex items-center justify-end">
                            <span>ACTIONS</span>
                            <Tooltip content="Додати категорію">
                                <Button onClick={() => {onMutate((e) => mutateAdd(e))}}
                                        className="bg-transparent text-foreground hover:text-primary" isIconOnly aria-label="Додати категорію" >
                                    <Plus />
                                </Button>
                            </Tooltip>
                        </div>
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Не знайдено категорій для відображення"} isLoading={isFetching}
                    loadingContent={<Spinner />}>
                    {data?.map((row) =>
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.name}
                            </TableCell>
                            <TableCell>
                                {row.description}
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center justify-end gap-2">
                                    <Tooltip content="Редагувати категорію">
                                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                            onClick={() => {onMutate((e) => mutatePatch(e), row) } }>
                                        <EditIcon/>
                                      </span>
                                    </Tooltip>
                                    <Tooltip color="danger" content="Видалити категорію">
                                      <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                            onClick={() => {
                                                setModalContent(
                                                    <ConfirmModal onDismiss={onClose}
                                                                  onConfirm={() => mutateRemove(row.id)}
                                                                  header="Підтвердіть дію"
                                                                  body={<p>Ви дійсно хочете видалити категорію {row.name}?</p>}/>)
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