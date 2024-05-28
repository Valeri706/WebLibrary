import React, {FC, useRef, useState} from "react";
import {Input, Textarea} from "@nextui-org/input";
import {DateInput} from "@nextui-org/date-input";
import {Autocomplete, AutocompleteItem} from "@nextui-org/autocomplete";
import {useQuery} from "@tanstack/react-query";
import {TypeAuthor, TypeCategory} from "@/types/EntityTypes";
import {get, post} from "@/lib/apiService";
import {Button} from "@nextui-org/button";

interface IAddBookModalProps {
    refetch: () => void;
    onClose: () => void;
}
export const AddBookModal: FC<IAddBookModalProps> = ({ refetch ,onClose }) => {
    const debounce = useRef<any>(0);
    const [authorData,setAuthorData] = useState<TypeAuthor[]>([]);
    const [categoryData,setCategoryData] = useState<TypeCategory[]>([]);
    const [authorId, setAuthorId] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    
    return (
        <form className="space-y-4 py-5" onSubmit={
            async (e) =>{
                e.preventDefault()
            // @ts-ignore
            const elements = e.currentTarget.elements as HTMLFormElement[]
                const book = {
                    title: elements[0].value,
                    publishedDate: elements[1].value,
                    summary: elements[2].value,
                    coverImageUrl: elements[6].value,
                    authorId: Number(authorId),
                    categoryId: Number(categoryId)
                }
                onClose()
                await post( { uri: "book/add",
                    msg:  ["Книга успішно додана до бібліотеки", "Виникла помилка під час додавання книги" ]}, book)
                refetch()
        }}>
            <Input label="Назва книги" isRequired
                   placeholder="Введіть назву для книги"
            />
            <DateInput isRequired
                       label="Дата публікації"
            />
            <Textarea label="Короткий опис книги"
                      isRequired
                      placeholder="Введіть опис книги"
            />
            <Autocomplete isRequired
                            /*@ts-ignore*/
                          onSelectionChange={setAuthorId}
                          defaultItems={authorData ?? []}
                          label="Автор книги"
                          placeholder="Пошук автора по імені" onInput={(e) => {
                clearTimeout(debounce.current)
                debounce.current = setTimeout(async () => {
                    // @ts-ignore
                    if (!e.target.value) return
                    // @ts-ignore
                    const authorSearch = await (await get({uri: "author/search?name=" + e.target.value})).json()
                    setAuthorData(authorSearch)
                }, 500)
            }}
            >
                {(author) => <AutocompleteItem key={author?.id}>{author?.name}</AutocompleteItem>}
            </Autocomplete>
            <Input label="Обкладинка книги"
                   placeholder="URL зображення"
            />
            <Autocomplete
                /*@ts-ignore*/
                            onSelectionChange={setCategoryId}
                          defaultItems={categoryData ?? []}
                          label="Категорія"
                          placeholder="Пошук категорії по імені" onInput={(e) => {
                clearTimeout(debounce.current)
                debounce.current = setTimeout(async () => {
                    // @ts-ignore
                    if (!e.target.value) return
                    // @ts-ignore
                    const categorySearch = await (await get({uri: "category/search?name=" + e.target.value})).json()
                    setCategoryData(categorySearch)
                }, 500)
            }}
            >
                {(category) => <AutocompleteItem key={category?.id}>{category?.name}</AutocompleteItem>}
            </Autocomplete>
            <Button color="primary" type="submit">
                Додати
            </Button>
        </form>
    )
}