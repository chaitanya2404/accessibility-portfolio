import Link from "next/link";
import { Code, Mail, User } from "lucide-react";
import { Heading } from "@/components/Heading";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 print:hidden"
    >
      <Heading level={2} id="contact-heading" className="mb-3">
        Get in touch
      </Heading>
      <p className="mb-6 max-w-3xl text-fg-muted">
        The form goes to me directly. Plain email and links are below if you
        prefer.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,18rem)]">
        <ContactForm />

        <aside aria-label="Contact links" className="space-y-3 text-sm">
          <Link
            href="mailto:basanichaitanyareddy@gmail.com"
            className="flex items-start gap-3 rounded-md border border-divider bg-surface p-3 hover:bg-surface-raised"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-fg">Email</span>
              <span className="block break-all text-fg-muted">
                basanichaitanyareddy@gmail.com
              </span>
            </span>
          </Link>

          <a
            href="https://github.com/chaitanya2404"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-md border border-divider bg-surface p-3 hover:bg-surface-raised"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <Code className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="block font-semibold text-fg">GitHub</span>
              <span className="block text-fg-muted">github.com/chaitanya2404</span>
            </span>
          </a>

          <p className="flex items-start gap-3 rounded-md border border-divider bg-surface-raised p-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-fg-subtle" aria-hidden="true" />
            <span className="text-fg-subtle">
              <span className="block font-semibold text-fg-muted">LinkedIn</span>
              <span className="block">Coming soon</span>
            </span>
          </p>
        </aside>
      </div>
    </section>
  );
}
