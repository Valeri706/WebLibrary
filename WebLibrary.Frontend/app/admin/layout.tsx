import {TabPanel} from "@/components/admin/TabPanel";
import {Divider} from "@nextui-org/divider";
import React from "react";

export default function AdminLayout({children} : {
    children: React.ReactNode;
}) {
    return (
        <div>
            <TabPanel />
            {children}
            <Divider className="my-4"/>
        </div>
    )
}