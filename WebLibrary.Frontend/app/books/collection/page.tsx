"use client"

import {Input} from "@nextui-org/input";
import {Plus, SearchIcon} from "lucide-react";
import {UserRole} from "@/types/userRole";
import {Card} from "@nextui-org/card";
import BookCard from "@/components/BookCard";
import {Spinner} from "@nextui-org/spinner";
import {title} from "@/components/primitives";
import React, {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {TypeBook} from "@/types/EntityTypes";
import {get} from "@/lib/apiService";
import {Size} from "@react-stately/virtualizer";

export default function Collection() {
    const { data, error, refetch, isFetching } = useQuery<TypeBook[]>({
        queryKey: ["collection book"],
        enabled: false,
        queryFn: async () => await ((await get({ uri: "book/mybooks" })))?.json()
    })
    useEffect( () => {
        refetch()
    },[])
    
    return (
        <section className="w-full h-full">
            <h1 className={title({size: "md"})}>Мої книги</h1>
            <div className="flex flex-col sm:grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] my-2 gap-2">
                {data?.length ?
                    data.map((o) => {
                        return (
                            <BookCard key={o.id} book={o} withLike={false}/>
                        )
                    }) : undefined
                }
            </div>

            {data?.length ? undefined :
                <div className="w-full mt-10 flex items-center justify-center">
                    {isFetching ?
                        <Spinner size="lg"/> :
                        <p className={title({size: "sm"})}>Нічого не знайдено</p>
                    }
                </div>
            }
        </section>
    );
}