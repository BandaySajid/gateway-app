import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";

// Assuming Metadata is defined elsewhere, otherwise import it or define it here.
interface Metadata {
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
        <div className="flex-grow lg:p-8 text-white flex justify-center items-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                Authenticate
              </h1>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t text-gray-800" />
              </div>
            </div>
            <AuthForm /> 
            <p className="px-8 text-center text-sm text-muted-foreground text-gray-400">
              By clicking continue, you agree to our{" "}
              <Link to="/terms" className="underline underline-offset-4 hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-white">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
  );
}
