import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/ui/Logo";
import Icon from "@/ui/Icon";
import Btn from "@/ui/Btn";
import { cn } from "@/lib/cn";
import { useAuth } from "@/store/auth";
import { useToast } from "@/store/toast";

export default function Login() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const push = useToast((s) => s.push);
  const [tab, setTab] = useState<"in" | "up">("in");
  const [f, setF] = useState({ name: "", email: "", pass: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.email.trim() || !f.pass.trim() || (tab === "up" && !f.name.trim())) {
      return push("Заполните все поля", "err");
    }
    const acc = login(f.email, tab === "up" ? f.name : undefined);
    push(`Добро пожаловать, ${acc.name}!`);
    nav(acc.role === "admin" ? "/admin" : "/account");
  };

  return (
    <div className="wrap grid place-items-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="card p-7">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-cream p-1">
            {(["in", "up"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg py-2 text-sm font-semibold transition",
                  tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-900/50",
                )}
              >
                {t === "in" ? "Вход" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === "up" && (
              <input className="field" placeholder="Имя" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            )}
            <input className="field" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <input className="field" type="password" placeholder="Пароль" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} />
            <Btn block size="lg" type="submit">
              <Icon name="user" size={18} /> {tab === "in" ? "Войти" : "Создать аккаунт"}
            </Btn>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-ink-900/50">
          <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
            ← На главную
          </Link>
        </p>
      </div>
    </div>
  );
}
