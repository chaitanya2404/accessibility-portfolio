import { Heading } from "@/components/Heading";
import { GraduationCap, Briefcase, Sparkles } from "lucide-react";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-20 print:break-inside-avoid">
      <Heading level={2} id="about-heading" className="mb-3">
        About me
      </Heading>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 text-fg-muted">
          <p>
            I&rsquo;m a full stack developer with seven-plus years building
            web applications across healthcare, finance, and higher education.
            My day-to-day is Angular and TypeScript on the front end and Java
            with Spring Boot on the back end, but the work I care about most
            is closer to the user — clean front-end code, accessibility, and
            user-centered design.
          </p>
          <p>
            I enjoy translating ideas from non-technical stakeholders into
            polished web experiences. The best part of the job, for me, is
            sitting with someone who knows the problem and turning that into
            something a screen reader user can navigate as easily as a mouse
            user.
          </p>
        </div>
        <ul className="space-y-3" aria-label="Quick facts">
          <li className="flex gap-3 rounded-lg border border-divider bg-surface p-3">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-fg">Master&rsquo;s in CS</p>
              <p className="text-sm text-fg-muted">University of North Texas</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border border-divider bg-surface p-3">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-fg">Bachelor&rsquo;s in CS</p>
              <p className="text-sm text-fg-muted">Computer science fundamentals</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border border-divider bg-surface p-3">
            <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-fg">7+ years</p>
              <p className="text-sm text-fg-muted">Healthcare · Finance · Higher education</p>
            </div>
          </li>
          <li className="flex gap-3 rounded-lg border border-divider bg-surface p-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-fg">Specialty</p>
              <p className="text-sm text-fg-muted">Front-end + accessibility</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
