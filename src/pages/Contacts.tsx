import { useState } from "react";
import PageHead from "@/ui/PageHead";
import Icon from "@/ui/Icon";
import Btn from "@/ui/Btn";
import { useToast } from "@/store/toast";

const INFO = [
  { icon: "phone", t: "Телефон", v: "+7 (495) 000-00-00", s: "Ежедневно 9:00–21:00" },
  { icon: "mail", t: "Email", v: "hello@ekomebel.ru", s: "Ответим в течение дня" },
  { icon: "pin", t: "Адрес", v: "г. Москва, ул. Экологическая, 42", s: "Шоурум и самовывоз" },
  { icon: "clock", t: "Режим работы", v: "Пн–Вс: 9:00–21:00", s: "Без выходных" },
];

export default function Contacts() {
  const push = useToast((s) => s.push);
  const [f, setF] = useState({ name: "", email: "", msg: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.msg.trim()) return push("Заполните имя и сообщение", "err");
    push("Сообщение отправлено! Мы скоро ответим.");
    setF({ name: "", email: "", msg: "" });
  };

  return (
    <>
      <PageHead crumb={[{ label: "Главная", to: "/" }, { label: "Контакты" }]} title="Контакты" sub="Свяжитесь с нами любым удобным способом — мы всегда на связи." />
      <section className="wrap grid gap-8 py-12 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {INFO.map((i) => (
            <div key={i.t} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-600">
                <Icon name={i.icon} size={22} />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink-900/55">{i.t}</h3>
              <p className="mt-0.5 font-bold">{i.v}</p>
              <p className="mt-0.5 text-sm text-ink-900/45">{i.s}</p>
            </div>
          ))}
          <div className="card grid place-items-center gap-2 p-6 text-center sm:col-span-2">
            <span className="text-5xl">🗺️</span>
            <p className="text-sm text-ink-900/50">Шоурум: г. Москва, ул. Экологическая, 42</p>
          </div>
        </div>

        <form onSubmit={submit} className="card h-fit p-6">
          <h2 className="text-xl font-extrabold">Напишите нам</h2>
          <p className="mt-1 text-sm text-ink-900/50">Оставьте сообщение, и мы свяжемся с вами.</p>
          <div className="mt-5 space-y-4">
            <input className="field" placeholder="Ваше имя" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input className="field" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <textarea className="field min-h-[8rem] resize-none" placeholder="Сообщение" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} />
            <Btn block size="lg" type="submit">
              <Icon name="mail" size={18} /> Отправить
            </Btn>
          </div>
        </form>
      </section>
    </>
  );
}
