import { LoginForm } from "./_form";

export const metadata = {
  title: "Admin · Sign in",
  robots: { index: false, follow: false },
};

// useSearchParams() in LoginForm forces the page to be dynamic. Setting
// dynamic = "force-dynamic" makes that explicit and avoids the prerender
// error during static export.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginForm />;
}
