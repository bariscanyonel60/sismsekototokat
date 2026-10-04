import type { ReactNode } from "react";

import { AppointmentForm } from "@/components/AppointmentForm";
import { ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { appointmentContent } from "@/data/company";
import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";
import { delay } from "@/lib/cssVars";

const PENDING = "Bilgi yakında eklenecek";

interface ContactRowProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  index: number;
}

function ContactRow({ icon, label, children, index }: ContactRowProps) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-5 border-b border-ink/15 py-6" data-reveal style={delay(index)}>
      <span className="mt-0.5 inline-flex size-11 items-center justify-center border border-ink/20 text-ink">
        {icon}
      </span>
      <div>
        <p className="label-mono text-steel-500">{label}</p>
        <div className="mt-1.5 font-display text-[1.4rem] font-semibold uppercase leading-tight tracking-[0.04em] text-ink">
          {children}
        </div>
      </div>
    </li>
  );
}

function Pending() {
  return <span className="text-steel-500">{PENDING}</span>;
}

export function AppointmentCTA() {
  const { contact } = site;
  const phone = telHref();
  const whatsapp = whatsappHref();

  return (
    <section
      id={sectionIds.contact}
      aria-labelledby="iletisim-baslik"
      className="section-y relative overflow-hidden bg-bone text-ink"
    >
      <div className="tech-grid-light pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative">
        <div className="flex items-center gap-5" data-reveal>
          <span className="label-mono text-ink">07</span>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="eyebrow text-ink">{appointmentContent.eyebrow}</span>
        </div>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="iletisim-baslik" className="heading-xl" data-reveal style={delay(1)}>
              {appointmentContent.title}
            </h2>
            <p className="lede mt-7 max-w-[32rem] text-steel-700" data-reveal style={delay(2)}>
              {appointmentContent.description}
            </p>

            <ul className="mt-10 border-t border-ink/15">
              <ContactRow icon={<PhoneIcon size={18} />} label="Telefon" index={0}>
                {phone && contact.phone ? (
                  <a href={phone} className="transition-colors hover:text-amber-600">
                    {contact.phone}
                  </a>
                ) : (
                  <Pending />
                )}
              </ContactRow>
              <ContactRow icon={<WhatsAppIcon size={18} />} label="WhatsApp" index={1}>
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-amber-600"
                  >
                    WhatsApp ile yazın
                  </a>
                ) : (
                  <Pending />
                )}
              </ContactRow>
              <ContactRow icon={<PinIcon size={18} />} label="Adres" index={2}>
                {contact.address ? (
                  <address className="not-italic">
                    {contact.address.street}, {contact.address.district} / {contact.address.city}
                  </address>
                ) : (
                  <Pending />
                )}
              </ContactRow>
              <ContactRow icon={<ClockIcon size={18} />} label="Çalışma Saatleri" index={3}>
                {contact.hours ? (
                  <ul>
                    {contact.hours.map((slot) => (
                      <li key={slot.days}>
                        {slot.days}: {slot.time}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Pending />
                )}
              </ContactRow>
            </ul>
          </div>

          <div className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
            <div className="corner-marks noise relative bg-ink p-7 text-bone sm:p-10 lg:p-12" data-reveal style={delay(1)}>
              <div className="flex items-center justify-between gap-4 border-b border-bone/12 pb-6">
                <p className="font-display text-2xl font-bold uppercase tracking-[0.06em] md:text-[1.75rem]">
                  {appointmentContent.formTitle}
                </p>
                <span className="label-mono text-amber">{site.slogans.road}</span>
              </div>
              <div className="mt-8">
                <AppointmentForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
