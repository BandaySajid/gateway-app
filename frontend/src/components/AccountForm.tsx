import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Plan } from "@/context/AuthContext";

export function AccountForm() {
  const authContext = useContext(AuthContext);
  const user = authContext?.authState.user;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Label htmlFor="name">Name</Label >
          <span className="text-gray-500 justify-self-end">{user?.name || 'Not set'}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label htmlFor="email">Email</Label >
          <span className="text-gray-500 justify-self-end">{user?.email || 'Not set'}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label htmlFor="plan">Plan</Label >
          <span className="text-gray-500 justify-self-end">
            {user?.plan}{" "}
            {user?.plan === Plan.free && (
              <Link to="/plans" className="text-blue-500 underline justify-self-end hover:text-blue-400">
                upgrade
              </Link>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}