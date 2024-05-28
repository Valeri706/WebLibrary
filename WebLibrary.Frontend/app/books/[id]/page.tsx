"use client"

import {deleteRequest, get} from "@/lib/apiService";
import {json} from "node:stream/consumers";
import {notFound, useRouter} from "next/navigation";
import {TypeBook, TypeCategory} from "@/types/EntityTypes";
import {Image} from "@nextui-org/image";
import React, {useState} from "react";
import {cutIfLonger} from "@/lib/tools";
import {title} from "@/components/primitives";
import { Chip } from "@nextui-org/chip";
import {CheckIcon, Feather, Plus, ScrollText} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";
import {useSession} from "next-auth/react";
import {UserRole} from "@/types/userRole";
import {DeleteIcon} from "@/components/icons";
import {Modal, ModalContent, useDisclosure} from "@nextui-org/modal";
import {ConfirmModal} from "@/components/ConfirmModal";

export default function Page({ params }: { params: { id: string } }) {
    const [loading,setLoading] = useState(false)
    const { data: session } = useSession();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const router = useRouter();
    
    const { data : book, error, refetch, isFetching } = 
        useQuery<TypeBook & { authorName: string, categoryName: string, inLibrary: boolean }>(
            {
                queryKey: ["book " + params.id],
                queryFn: async () => {
                    const response = await get({ uri: `book/finduserbook?id=${params.id}` });
                    if(response.ok)
                        return await response.json()
                    return undefined
                }
            })
    
    if(isFetching) {
        return (<div className="h-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>)
    }
    
    if(!book) {
        notFound()
    }
    
    return (
        <div className="sm:flex-row justify-center sm:justify-normal flex-col flex gap-8 relative">
            <div className="shrink-0">
                <Image
                    alt="Album cover"
                    className="object-cover hover:scale-125"
                    shadow="md"
                    src={book.coverImageUrl ? book.coverImageUrl : "https://i.pinimg.com/736x/5b/78/a5/5b78a51239536a81d6b84aae26ac8e99.jpg"}
                    width={220}
                />
                <div className="flex flex-col justify-center items-center sm:items-start mt-5 gap-2">
                    <Tooltip color="default" content="Автор книги">
                        <Chip
                            endContent={<Feather size={18} />}
                            variant="flat" 
                            color="primary"
                        >
                            {book.authorName}
                        </Chip>
                    </Tooltip>
                    { book.categoryName &&
                        <Tooltip color="default" content="Категорія книги">
                            <Chip
                                endContent={<ScrollText size={18} />}
                                variant="flat"
                                color="secondary"
                            >
                                {book.categoryName}
                            </Chip>
                        </Tooltip>
                    }
                    {/*@ts-ignore*/}
                    { session?.user.role === UserRole.admin &&
                        <Chip onClick={onOpen}
                            endContent={<DeleteIcon size={18} />}
                            variant="flat" className="cursor-pointer"
                            color="danger"
                        >
                            Видалити книгу
                        </Chip>
                    }
                </div>
            </div>

            <div className="mt-4 space-y-8">
                <p className={title()}>{book.title}</p>
                <p className="text-xs font-light dark:text-foreground/70 ">
                    {book.summary}
                </p>
            </div>
            { book.inLibrary ?
                <Tooltip color="default" content="Натисніть, щоб видалити зі своєї колекції">
                    <Chip onClick={async () => {
                        setLoading(true)
                        await deleteRequest({
                            uri: "book/removefromcollection?id=" + book.id,
                            msg:  ["Книга вилучена з вашої колекції", "Виникла помилка під час виконання запиту" ],
                            onSuccess:  async () => await refetch()
                        })
                        setLoading(false)
                    }}
                        className="sm:absolute right-0 top-0 mb-5 cursor-pointer"
                          isDisabled={loading}
                        startContent={<CheckIcon size={18} />}
                        variant="faded"
                        color="success"
                    >
                        Додано
                    </Chip>
                </Tooltip>
                    :
                <Tooltip color="default" content="Натисніть, щоб додати до своєї колекції">
                    <Chip
                        onClick={async () => {
                            setLoading(true)
                            await get({
                                uri: "book/addtocollection?id=" + book.id,
                                msg:  ["Книга додана до вашої колекції. Щоб переглянути вашу колекцію перейдіть у 'Мої книги'", "Виникла помилка під час виконання запиту" ],
                                onSuccess:  async () => await refetch()
                            })
                            setLoading(false)
                        }}
                        className="sm:absolute right-0 top-0 mb-5 cursor-pointer"
                        isDisabled={loading}
                        startContent={<Plus size={18} />}
                        variant="faded"
                        color="warning"
                    >
                        Читати
                    </Chip>
                </Tooltip>
            }
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
                <ModalContent>
                    <ConfirmModal body={<p>Ви дійсно хочете видалити цю книгу?</p>}
                                  onDismiss={onClose}
                                  header="Підтвердіть дію"
                                  onConfirm={() => {
                        onClose();
                        deleteRequest({ uri: "book/delete?id=" + book.id,
                            msg:  ["Книга успішно видалена", "Виникла помилка при видаленні книги" ]}).then(() => {
                            router.push("/books");
                        });
                    }} />
                </ModalContent>
            </Modal>
        </div>
    )
}