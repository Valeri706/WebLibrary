import {TabPanel} from "@/components/admin/TabPanel";

export default function AdminLayout({children} : {
    children: React.ReactNode;
}) {
    return (
        <div>
            <TabPanel />
            {children}
        </div>
    )
}