"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Info, LogIn, Send, UserPlus } from "lucide-react";
import {
  Button,
  FieldError,
  FieldHelp,
  FormMessage,
  Input,
  Textarea,
  buttonVariants,
} from "@/components/ui";
import { authHref } from "@/lib/auth/redirects";
import { validateInterestInput } from "./validation";
import {
  submitInterestThroughAction,
  type InterestSubmissionAction,
} from "./submission";

type FormStatus =
  "idle" | "submitting" | "success" | "error" | "already_submitted";

type InterestFormProps = {
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  isDemo?: boolean;
  viewerRole?: "student" | "researcher" | "admin";
  initialEmail?: string;
  onSubmitAction?: InterestSubmissionAction;
};

export function InterestForm({
  projectId,
  projectTitle,
  projectSlug,
  isDemo = false,
  viewerRole,
  initialEmail = "",
  onSubmitAction,
}: InterestFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>(
    {},
  );
  const emailId = useId();
  const messageId = useId();
  const errorSummaryId = useId();
  const returnTo = `/projects/${projectSlug}#get-involved`;
  const canSubmit = viewerRole === "student";
  const currentLength = message.trim().length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const validation = validateInterestInput({ email, message });
    setErrors(validation.errors);
    if (!validation.isValid) return;

    setStatus("submitting");
    setServerMessage(null);

    try {
      const result = await submitInterestThroughAction(
        onSubmitAction,
        new FormData(event.currentTarget),
      );
      if (result.error) {
        setStatus("error");
        setServerMessage(result.error);
        return;
      }
      setStatus(
        result.code === "already_submitted" ? "already_submitted" : "success",
      );
      setServerMessage(result.success ?? "Your interest has been saved.");
    } catch {
      setStatus("error");
      setServerMessage(
        "Interest submission could not be completed. Your message has not been saved.",
      );
    }
  }

  if (status === "success" || status === "already_submitted") {
    const duplicate = status === "already_submitted";
    return (
      <section
        className="surface-panel space-y-5 p-6 sm:p-8"
        aria-live="polite"
        role="status"
      >
        <div className="flex items-start gap-4">
          <span className="icon-disc" aria-hidden="true">
            {duplicate ? <Clock size={22} /> : <CheckCircle2 size={22} />}
          </span>
          <div>
            <p className="section-kicker">
              {duplicate ? "Participation status" : "Interest recorded"}
            </p>
            <h3 className="type-h3 mt-1">
              {duplicate
                ? "You have already expressed interest"
                : "Your interest has been saved"}
            </h3>
            <p className="mt-2 text-sm text-muted">{serverMessage}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/account" className={buttonVariants()}>
            View student account
          </Link>
          <Link
            href="/projects"
            className={buttonVariants({ variant: "secondary" })}
          >
            Browse projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="section-kicker">Student participation</span>
          {isDemo && <span className="demo-label">DEMO DATA</span>}
        </div>
        <h3 className="type-h3 mt-2 break-words">
          Express interest in “{projectTitle}”
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Tell the research team why you would like to participate. Your contact
          email and message will be available to the research and administration
          team.
        </p>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        {!viewerRole && (
          <FormMessage tone="info" title="Sign in with a student account">
            <p>
              Public research remains open. A student account is required to
              record an expression of interest.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={authHref("/auth/sign-in", returnTo)}
                className={buttonVariants()}
              >
                <LogIn size={16} aria-hidden="true" /> Sign in to continue
              </Link>
              <Link
                href={authHref("/auth/sign-up", returnTo)}
                className={buttonVariants({ variant: "secondary" })}
              >
                <UserPlus size={16} aria-hidden="true" /> Create student account
              </Link>
            </div>
          </FormMessage>
        )}

        {viewerRole && viewerRole !== "student" && (
          <FormMessage tone="info" title="Student participation">
            Interest submission is available to student accounts. You can
            continue browsing this project and its published work.
          </FormMessage>
        )}

        {Object.keys(errors).length > 0 && (
          <FormMessage
            id={errorSummaryId}
            tone="error"
            title="Check the highlighted fields"
          >
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.email && <li>{errors.email}</li>}
              {errors.message && <li>{errors.message}</li>}
            </ul>
          </FormMessage>
        )}

        {status === "error" && serverMessage && (
          <FormMessage tone="error" title="Interest was not saved">
            {serverMessage}
          </FormMessage>
        )}

        {canSubmit && (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <input type="hidden" name="project_id" value={projectId} />
            <input type="hidden" name="is_demo" value={isDemo ? "on" : "off"} />

            <div>
              <label htmlFor={emailId}>Contact email</label>
              <Input
                id={emailId}
                name="contact_email"
                type="email"
                autoComplete="email"
                required
                disabled={!canSubmit || status === "submitting"}
                value={email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={`${emailId}-help${errors.email ? ` ${emailId}-error` : ""}`}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                  if (errors.email)
                    setErrors((current) => ({ ...current, email: undefined }));
                }}
              />
              <FieldHelp id={`${emailId}-help`}>
                Use an address where the team can contact you about this
                interest.
              </FieldHelp>
              {errors.email && (
                <FieldError id={`${emailId}-error`}>{errors.email}</FieldError>
              )}
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <label htmlFor={messageId}>
                  Why would you like to participate?
                </label>
                <span className="mb-1 text-xs text-muted" aria-hidden="true">
                  {currentLength}/2000
                </span>
              </div>
              <Textarea
                id={messageId}
                name="message"
                required
                rows={6}
                maxLength={2000}
                disabled={!canSubmit || status === "submitting"}
                value={message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={`${messageId}-help${errors.message ? ` ${messageId}-error` : ""}`}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setMessage(event.target.value);
                  if (errors.message)
                    setErrors((current) => ({
                      ...current,
                      message: undefined,
                    }));
                }}
                placeholder="Describe your interest, relevant experience, and how you hope to contribute."
              />
              <FieldHelp id={`${messageId}-help`}>
                Minimum 20 characters. Share only information relevant to your
                participation interest.
              </FieldHelp>
              {errors.message && (
                <FieldError id={`${messageId}-error`}>
                  {errors.message}
                </FieldError>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex max-w-xl items-start gap-2 text-xs text-muted">
                <Info
                  size={15}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Submitting records your interest for review by the research and
                administration team.
              </p>
              <Button
                type="submit"
                disabled={!canSubmit || status === "submitting"}
              >
                <Send size={16} aria-hidden="true" />
                {status === "submitting"
                  ? "Saving interest…"
                  : "Express interest"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
