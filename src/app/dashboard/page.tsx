import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./_components/sign-out-button";
import { redirect } from "next/navigation";

const DashboardPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.user) {
        redirect("/authentication")
    }

    return ( 
        <div>
            <h1>Dashboard</h1>
            <p>{session?.user?.email}</p>
            <p>{session?.user?.name}</p>
            <SignOutButton />
        </div>
     );
}
 
export default DashboardPage;