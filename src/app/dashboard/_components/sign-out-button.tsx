"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOutButton = () => {

    const router = useRouter()
    return ( 
        <Button
            onClick={ () => authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/authentication")
                        toast.success("Deslogado com sucesso")
                    }
                }
            })}
        >
            Sair
        </Button>
     );
}
 
export default SignOutButton;