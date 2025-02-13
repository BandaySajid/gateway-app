import * as React from "react"
import { useContext } from "react";
import { cn } from "@/lib/utils"
import { GoogleLogin } from '@react-oauth/google';
import { API_HOST } from "../../config.mjs"
import { AuthContext } from "@/context/AuthContext";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const ac = useContext(AuthContext);
  const handleGoogleLogin = async (data: any)=>{
      const response = await fetch(`${API_HOST}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: data.credential }),
      });
      if(response.status === 200){
        const rd = await response.json();
        if(rd.token){
          if(ac?.login){
            ac?.login(rd.token, rd.user);
          }
        }
      }
  }
  return (
  <>
    <div className={cn("grid gap-6", className, "flex flex-col justify-center items-center") } {...props}>
        <GoogleLogin theme="filled_black" size="medium" onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed")} />
    </div>
  </>
  )
}