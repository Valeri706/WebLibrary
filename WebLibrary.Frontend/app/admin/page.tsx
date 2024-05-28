"use client";

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";
import React, {ReactNode, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {deleteRequest, get, post} from "@/lib/apiService";
import {User} from "@nextui-org/user";
import {UserRole} from "@/types/userRole";
import { Chip } from "@nextui-org/chip";
import {DeleteIcon, EditIcon } from "@/components/icons";
import { Tooltip } from "@nextui-org/tooltip";
import { Spinner } from "@nextui-org/spinner";
import {useDisclosure, Modal, ModalBody, ModalHeader, ModalContent, ModalFooter} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import {ConfirmModal} from "@/components/ConfirmModal";
import {JSXElement} from "@typescript-eslint/types/dist/generated/ast-spec";
import {Input} from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import {TypeUser} from "@/types/EntityTypes";

const userRole = {
    "-1": {
        color: "warning",
        name: UserRole.none
    },
    0: {
        color: "success",
        name: UserRole.user
    },
    100: {
        color: "danger",
        name: UserRole.admin
    }
};

export default function Admin() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [ modalContent, setModalContent ] = useState<ReactNode>(undefined);
    const { data, error, refetch, isFetching } = useQuery<TypeUser[]>({ 
        queryKey: ["users"],
        queryFn: async () => await (await get({ uri: "user/getrange",
            msg:  [undefined, "При спробі отримати список користувачів виникла помилка" ]})).json()
    })
    
    
    const { mutate: mutateRemove } = useMutation(
        { mutationKey: ["delete user"],
            mutationFn: async (id: number) => {
                await deleteRequest({ uri: "user/delete?id=" + id,
                    msg:  ["Користувач видалений", "Виникла помилка при видаленні" ]});
                await refetch()
                onClose()
            } 
        })
    
    const {mutate: mutatePatch } = useMutation(
        {
            mutationKey: ["patch user"],
            mutationFn: async (user: any) => {
                await post({uri: "user/patch",
                    msg:  ["Користувач оновлений", "Виникла помилка при оновленні" ]}, user);
                await refetch()
                onClose()
            }
        })
    
    
    return (
        <>
            <Table aria-label="Users table">
            <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>REGISTERED AT</TableColumn>
                <TableColumn align="end" className="text-right">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."} isLoading={isFetching}
                       loadingContent={<Spinner />}>
                {data?.map((row) =>
                    <TableRow key={row.id}>
                        <TableCell>
                            <User
                                avatarProps={{
                                    radius: "lg", 
                                    src: `https://ui-avatars.com/api/?name=${row.name.replace(" ","+")}` }}
                                description={row.email}
                                name={row.name}
                            >
                                {row.email}
                            </User>
                        </TableCell>
                        <TableCell>
                            <Chip className="capitalize" color={userRole[row.role].color} size="sm" variant="flat">
                                {userRole[row.role].name}
                            </Chip>
                        </TableCell>
                        <TableCell>{new Date(row.registeredAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <div className="relative flex items-center justify-end gap-2">
                                <Tooltip content="Edit user">
                                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                        onClick={() => {
                                            setModalContent(
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">Редагування {row.email}</ModalHeader>
                                                    <ModalBody>
                                                        <form className="space-y-4 py-5" onSubmit={(e) => {
                                                            e.preventDefault()
                                                            // @ts-ignore
                                                            const name = e.currentTarget.elements[0].value;
                                                            // @ts-ignore
                                                            const role = e.currentTarget.elements[1].value;
                                                            // @ts-ignore
                                                            const password = e.currentTarget.elements[4].value
                                                            mutatePatch({ id: row.id, name, role, password })
                                                        }}>
                                                        <Input label="Ім'я"
                                                            defaultValue={row.name} 
                                                            placeholder="Введіть нове ім'я"
                                                        />
                                                        <Select
                                                            label="Роль" defaultSelectedKeys={[userRole[row.role].name]}
                                                            placeholder="Оберіть нову роль"
                                                        >
                                                            {
                                                                Object.entries(UserRole).map(([k,r]) => (
                                                                    <SelectItem key={r} value={r}>
                                                                        {r}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </Select>
                                                        <Input label="Пароль" type="password"
                                                               placeholder="Введіть новий пароль"
                                                        />
                                                            <Button type="submit" color="primary">
                                                                Оновити
                                                            </Button>
                                                        </form>
                                                        
                                                    </ModalBody>
                                                </>)
                                            onOpen()
                                        }}>
                                    <EditIcon/>
                                  </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Delete user">
                                  <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                        onClick={() => {
                                            setModalContent(<ConfirmModal onDismiss={onClose} 
                                                                          onConfirm={() => mutateRemove(row.id)}
                                                header="Підтвердіть дію" 
                                                body={<p>Ви дійсно хочете видалити користувача {row.email}?</p>}/>)
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
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        modalContent
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}