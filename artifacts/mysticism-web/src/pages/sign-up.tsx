import { SignUp } from "@clerk/react";
import { Navbar } from "@/components/layout/navbar";
import { AmbientBg } from "@/components/ambient-bg";

const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

export default function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AmbientBg />
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 pt-20 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary tracking-widest mb-2">HUYỀN BÍ</h1>
            <p className="text-muted-foreground text-sm">Tạo tài khoản để lưu lá số cá nhân</p>
          </div>
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            afterSignUpUrl={`${basePath}/profile`}
          />
        </div>
      </div>
    </div>
  );
}
