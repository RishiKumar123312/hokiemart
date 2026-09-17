// This layout wraps every sign-up screen (email, code, profile, password,
// done). Because Next.js keeps a layout mounted while navigating between the
// pages inside it, putting the SignupProvider here -- rather than on each
// individual page -- is what lets the answers survive moving from one step
// to the next.
import { SignupProvider } from "@/lib/signup-context";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <SignupProvider>{children}</SignupProvider>;
}
