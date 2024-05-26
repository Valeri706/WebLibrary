"use client";

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/table";
import React from "react";
import { Button } from "@nextui-org/button";
import {Trash2} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import {get} from "@/lib/apiService";
import {TypeUser} from "@/types/TypeUser";
import {User} from "@nextui-org/user";
import {UserRole} from "@/types/userRole";
import { Chip } from "@nextui-org/chip";
import {CalendarDateTime} from "@internationalized/date";
import {DeleteIcon, EditIcon } from "@/components/icons";
import { Tooltip } from "@nextui-org/tooltip";

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
    const { data, error } = useQuery<TypeUser[]>({ 
        queryKey: ["users"],
        queryFn: async () => await (await get({ uri: "user/getrange" })).json()
    })
    
    console.log(data)
    
    return (
        <Table aria-label="Users table">
            <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>REGISTERED AT</TableColumn>
                <TableColumn align="end" className="text-right">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."}>
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
                                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EditIcon/>
                                  </span>
                                </Tooltip>
                                <Tooltip color="danger" content="Delete user">
                                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                    <DeleteIcon/>
                                  </span>
                                </Tooltip>
                            </div>
                        </TableCell>
                    </TableRow>
                ) ?? []}
            </TableBody>
        </Table>
    )
}