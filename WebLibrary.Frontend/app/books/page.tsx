import { Input } from "@nextui-org/input";
import { SearchIcon } from "lucide-react";

import BookCard from "@/components/BookCard";

export default function Books() {
  return (
    <section>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
      <div className="flex flex-col sm:grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] my-2 gap-2">
        <BookCard name="New book 1" description="This is a description for this book"
            imageUrl="https://assets1.bmstatic.com/assets/books-covers/46/05/ipad-0068a060f84cbd602d62575b2fb849bc.jpeg" />
        <BookCard name="Салимове Лігво а так же фистинг єйнал"
            description="Містечко, у якому виріс Бен Міерз, завжди було звичайним. Нічого особливого, нікого особливого, хіба що назва трохи дивна: Єрусалимове, або, як вимовляють місцеві люди, Салимове Лігво"
            imageUrl="https://assets1.bmstatic.com/assets/books-covers/32/c4/YH6Wvh4N-ipad.png" />
      </div>
    </section>
  );
}
