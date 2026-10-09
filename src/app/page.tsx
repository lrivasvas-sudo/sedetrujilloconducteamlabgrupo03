import { LoginForm } from "@/components/LoginForm";
import { WelcomeHero } from "@/components/WelcomeHero";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-br from-nara-lavanda/60 via-nara-crema to-nara-cielo/60 px-5 py-12 sm:px-10">
      <WelcomeHero />
      <LoginForm />
    </main>
  );
}
