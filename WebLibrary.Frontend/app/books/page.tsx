"use client"

import {Input, Textarea} from "@nextui-org/input";
import {Plus, SearchIcon } from "lucide-react";

import BookCard from "@/components/BookCard";
import { Card } from "@nextui-org/card";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import React, {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {DateInput} from "@nextui-org/date-input";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import {AddBookModal} from "@/components/admin/AddBookModal";
import {useQuery} from "@tanstack/react-query";
import {TypeBook} from "@/types/EntityTypes";
import {get} from "@/lib/apiService";
import {useSession} from "next-auth/react";
import {UserRole} from "@/types/userRole";
import {title} from "@/components/primitives";
import {Spinner} from "@nextui-org/spinner";

export default function Books() {
    const { data: session } = useSession();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [filteredData, setFilteredData] = useState<TypeBook[] | undefined>([]);
    const [filter, setFilter] = useState('');
    const { data, error, refetch, isFetching } = useQuery<TypeBook[]>({
        queryKey: ["books"],
        enabled: false,
        queryFn: async () => await (await get({ uri: "book/getrange" })).json()
    })
    
    useEffect(() => {
        refetch()
    },[])

    useEffect(() => {
        if(!data) return;
        
        const result = data.filter(item =>
            item.title.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredData(result);
    }, [filter, data]);
    
  return (
      <section className="w-full h-full">
          <Input
              onChange={e => setFilter(e.target.value)}
              aria-label="Search"
              classNames={{
                  inputWrapper: "bg-default-100",
                  input: "text-sm",
              }}
              labelPlacement="outside"
              placeholder="Search..."
              startContent={
                  <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0"/>
              }
              type="search"
          />
          <div className="flex flex-col sm:grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] my-2 gap-2">
              {/*@ts-ignore*/}
              {session?.user?.role === UserRole.admin &&
                  <Card
                      isBlurred
                      className="border-none text-foreground-500 hover:text-foreground  bg-background/60 dark:bg-default-100/50"
                      shadow="sm"
                  >
                      <div className="flex items-center justify-center cursor-pointer w-full h-full"
                           role="button"
                           onClick={onOpen}>
                          <Plus size={80}/>
                      </div>
                  </Card>
              }

              {filteredData?.length ?
                  filteredData.map((o) => {
                      return (
                          <BookCard key={o.id} book={o}/>
                      )
                  }) : undefined
              }
          </div>

          {filteredData?.length ? undefined :
              <div className="w-full mt-10 flex items-center justify-center">
                  {isFetching ?
                      <Spinner size="lg"/> :
                      <p className={title({size: "sm"})}>Нічого не знайдено</p>
                  }
              </div>
          }

          <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
              <ModalContent>
                  <ModalHeader className="flex flex-col gap-1">Додати книгу</ModalHeader>
                  <ModalBody>
                      <AddBookModal onClose={onClose} refetch={refetch}/>
                  </ModalBody>
              </ModalContent>
          </Modal>
      </section>
  );
}
