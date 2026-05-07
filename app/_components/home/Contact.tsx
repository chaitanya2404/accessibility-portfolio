import { DENSITY, PAPER_THEME, T } from "./theme";
import { SectionHeader } from "./SectionHeader";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        scrollMarginTop: 80,
        padding: `${DENSITY.sectionPad}px 32px`,
        borderBottom: `1px solid ${PAPER_THEME.rule}`,
        maxWidth: 1280,
        margin: "0 auto",
      }}
    >
      <SectionHeader
        id="contact-heading"
        num="05"
        label="Contact"
        sub="The form goes to me directly."
      />
      <div
        className="home-contact-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 48,
        }}
      >
        <ContactForm />
        <aside
          aria-label="Contact links"
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <ContactRow
            k="email"
            v="basanichaitanyareddy@gmail.com"
            href="mailto:basanichaitanyareddy@gmail.com"
          />
          {/*
          <ContactRow
            k="github"
            v="github.com/chaitanya2404"
            href="https://github.com/chaitanya2404"
            external
          />
          */}
          <ContactRow k="based" v="Irving, TX · open to relocation" />
          <p
            style={{
              marginTop: 24,
              padding: 18,
              border: `1px solid ${PAPER_THEME.rule}`,
              fontFamily: T.bodyFont,
              fontSize: 13,
              color: PAPER_THEME.ink2,
              lineHeight: 1.55,
              textWrap: "pretty",
            }}
          >
            Plain email works too. If you find an accessibility issue with this
            site, the form is the fastest way to report it — I read every one.
          </p>
        </aside>
      </div>
    </section>
  );
}

function ContactRow({
  k,
  v,
  href,
  external,
}: {
  k: string;
  v: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span
        style={{
          fontFamily: T.headFont,
          fontSize: 11,
          color: PAPER_THEME.ink3,
          textTransform: "uppercase",
          letterSpacing: ".08em",
        }}
      >
        {k}
      </span>
      <span style={{ fontFamily: T.headFont, fontSize: 14 }}>{v}</span>
    </>
  );
  const baseStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: `1px solid ${PAPER_THEME.rule}`,
    color: PAPER_THEME.ink,
    textDecoration: "none",
  };
  if (href) {
    return (
      <a
        href={href}
        {...(external
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-label": `${k}: ${v} (opens in a new tab)`,
            }
          : {})}
        style={baseStyle}
      >
        {inner}
      </a>
    );
  }
  return <div style={baseStyle}>{inner}</div>;
}
