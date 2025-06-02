"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const SignOutButton = () => {
  const handleSignOut = () =>
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
          toast.success("Deslogado com sucesso");
        },
      },
    });
  const router = useRouter();
  return <Button onClick={handleSignOut}>Sair</Button>;
};

export default SignOutButton;
