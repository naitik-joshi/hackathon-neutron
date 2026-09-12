"use client";

import { useState, useId, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  Clock,
  Info,
} from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import { validateInterestInput } from "./validation";

export type FormStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "already_submitted";

export type InterestFormProps = {
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  isDemo?: boolean;
  isAuthenticated?: boolean;
  initialEmail?: string;
  initialStatus?: FormStatus;
  alreadySubmitted?: boolean;
  serverError?: string;
  serverSuccess?: string;
  /**
   * Optional Server Action or callback integration point for Naitik.
   * If provided, the form will invoke this action upon client validation.
   */
  onSubmitAction?: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: string; code?: string }>;
};

export function InterestForm({
  projectId,
  projectTitle,
  projectSlug,
  isDemo = false,
  isAuthenticated = false,
  initialEmail = "",
  initialStatus = "idle",
  alreadySubmitted = false,
  serverError,
  serverSuccess,
  onSubmitAction,
}: InterestFormProps) {
  const computedInitialStatus: FormStatus = alreadySubmitted
    ? "already_submitted"
    : serverError
      ? "error"
      : serverSuccess
        ? "success"
        : initialStatus;

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>(computedInitialStatus);
  const [serverMessage, setServerMessage] = useState<string | null>(
    serverError || serverSuccess || null,
  );
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  const emailId = useId();
  const messageId = useId();
  const emailHelpId = useId();
  const messageHelpId = useId();
  const errorSummaryId = useId();

  const minMessageLength = 20;
  const maxMessageLength = 2000;
  const currentLength = message.trim().length;

  const validate = (): boolean => {
    const result = validateInterestInput({ email, message });
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    if (!validate()) {
      return;
    }

    setStatus("submitting");
    setServerMessage(null);

    const formData = new FormData(e.currentTarget);

    if (onSubmitAction) {
      try {
        const result = await onSubmitAction(formData);
        if (result.error) {
          if (result.code === "23505" || result.error.includes("already expressed")) {
            setStatus("already_submitted");
            setServerMessage(result.error);
          } else {
            setStatus("error");
            setServerMessage(result.error);
          }
        } else if (result.success) {
          if (result.success.includes("already expressed")) {
            setStatus("already_submitted");
          } else {
            setStatus("success");
          }
          setServerMessage(result.success);
        }
      } catch {
        setStatus("error");
        setServerMessage(
          "A network or server error occurred while sending your request. Please try again.",
        );
      }
    } else {
      // Frontend standalone mode for testing / integration review
      // Simulates the successful client state transition cleanly
      setTimeout(() => {
        setStatus("success");
        setServerMessage(
          "Your expression of interest has been prepared for submission to the faculty desk.",
        );
      }, 600);
    }
  };

  // State: Success Confirmation
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-6 md:p-8 space-y-4 text-emerald-950"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-emerald-100 p-2 text-[#0F766E] shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#0F766E] block">
              Application Acknowledged
            </span>
            <h3 className="font-serif text-xl font-bold text-emerald-950">
              Expression of Interest Recorded
            </h3>
            <p className="text-xs md:text-sm text-emerald-900 leading-relaxed max-w-2xl">
              {serverMessage ||
                "Your statement and contact information have been logged. The principal investigators and research secretariat can review your submission and contact you directly via your provided email."}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white/80 border border-emerald-200/60 p-4 text-xs font-mono text-emerald-900 space-y-1">
          <div>
            Project: <strong className="text-emerald-950">{projectTitle}</strong>
          </div>
          <div>
            Contact: <strong className="text-emerald-950">{email}</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setStatus("idle");
              setMessage("");
            }}
            className="text-xs"
          >
            Submit another message
          </Button>
          <Link
            href="/projects"
            className="btn-academic-outline text-xs inline-flex items-center gap-1.5"
          >
            Browse all research projects
          </Link>
        </div>
      </div>
    );
  }

  // State: Already Submitted
  if (status === "already_submitted") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-amber-200 bg-amber-50/90 p-6 md:p-8 space-y-4 text-amber-950"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-amber-100 p-2 text-amber-800 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-amber-800 block">
              Participation Status
            </span>
            <h3 className="font-serif text-xl font-bold text-amber-950">
              Interest Already Registered
            </h3>
            <p className="text-xs md:text-sm text-amber-900 leading-relaxed max-w-2xl">
              {serverMessage ||
                "You have already expressed interest in this project. The research team reviews student candidate dossiers during regular editorial review cycles and will be in touch if a laboratory placement is available."}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="btn-academic-outline text-xs inline-flex items-center gap-1.5"
          >
            Explore other active projects
          </Link>
          <Link
            href="/account"
            className="btn-academic-primary text-xs inline-flex items-center gap-1.5"
          >
            View student account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-xs space-y-6 break-words">
      <div className="border-b border-slate-100 pb-4 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#0F2042] text-white px-2 py-0.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider">
              Student Application
            </span>
            {isDemo && (
              <span className="pill-badge pill-collab text-xs font-semibold">
                DEMO PROJECT
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-500">
            Confidential to project PIs
          </span>
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-[#0F2042] pt-1 break-words">
          Express Interest in &ldquo;{projectTitle}&rdquo;
        </h3>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Undergraduate and postgraduate students at Islington College can submit an application to join this research initiative.
        </p>
      </div>

      {/* Authentication Gateway Notice if Visitor is not Signed In */}
      {!isAuthenticated && (
        <div
          role="region"
          aria-label="Student authentication required"
          className="rounded-lg border border-blue-200 bg-blue-50/70 p-4 md:p-5 space-y-3"
        >
          <div className="flex items-start gap-3">
            <LogIn className="h-5 w-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs md:text-sm font-semibold text-blue-950">
                Student Account Required to Submit
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                You can browse public research freely. To submit an expression of interest to faculty PIs, please sign in with your Islington College student account.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1 pl-8">
            <Link
              href={`/auth/sign-in?redirectTo=/projects/${projectSlug}#get-involved`}
              className="btn-academic-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
            >
              <LogIn size={13} />
              <span>Sign in to submit</span>
            </Link>
            <Link
              href={`/auth/sign-up?redirectTo=/projects/${projectSlug}#get-involved`}
              className="btn-academic-outline text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
            >
              <UserPlus size={13} />
              <span>Create student account</span>
            </Link>
          </div>
        </div>
      )}

      {/* Error Summary if Validation Fails */}
      {Object.keys(errors).length > 0 && (
        <div
          id={errorSummaryId}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-1.5 text-xs text-red-900"
        >
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 text-red-700 shrink-0" />
            <span>Please correct the following fields before submitting:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5">
            {errors.email && <li>{errors.email}</li>}
            {errors.message && <li>{errors.message}</li>}
          </ul>
        </div>
      )}

      {/* Server Failure State */}
      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-2.5 text-xs text-red-900"
        >
          <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Submission Error:</strong>
            <p>{serverMessage}</p>
          </div>
        </div>
      )}

      {/* The Interactive Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <input type="hidden" name="project_id" value={projectId} />
        <input type="hidden" name="is_demo" value={isDemo ? "on" : "off"} />

        {/* Contact Email Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={emailId}
              className="text-xs font-semibold text-slate-800 uppercase font-mono tracking-wider"
            >
              Contact Email Address <span className="text-red-600">*</span>
            </label>
            <span className="text-[0.7rem] text-slate-500 font-mono">Required</span>
          </div>
          <Input
            id={emailId}
            name="contact_email"
            type="email"
            required
            aria-required="true"
            aria-describedby={emailHelpId}
            aria-invalid={errors.email ? "true" : "false"}
            value={email}
            disabled={status === "submitting" || !isAuthenticated}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="e.g. s1234567@islingtoncollege.edu.np"
            className={`text-xs md:text-sm ${
              errors.email ? "border-red-400 focus:ring-red-200" : ""
            }`}
          />
          <p id={emailHelpId} className="text-[0.72rem] text-slate-500">
            Provide the direct email where project supervisors can coordinate with you.
          </p>
          {errors.email && (
            <p role="alert" className="text-[0.75rem] font-medium text-red-700">
              {errors.email}
            </p>
          )}
        </div>

        {/* Statement of Interest Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={messageId}
              className="text-xs font-semibold text-slate-800 uppercase font-mono tracking-wider"
            >
              Statement of Interest & Relevant Experience{" "}
              <span className="text-red-600">*</span>
            </label>
            <span
              className={`text-[0.7rem] font-mono ${
                currentLength < minMessageLength && currentLength > 0
                  ? "text-amber-700 font-semibold"
                  : currentLength > maxMessageLength
                    ? "text-red-700 font-semibold"
                    : "text-slate-500"
              }`}
            >
              {currentLength} / {maxMessageLength} chars (min {minMessageLength})
            </span>
          </div>
          <Textarea
            id={messageId}
            name="message"
            required
            aria-required="true"
            aria-describedby={messageHelpId}
            aria-invalid={errors.message ? "true" : "false"}
            rows={5}
            maxLength={maxMessageLength}
            value={message}
            disabled={status === "submitting" || !isAuthenticated}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setMessage(e.target.value);
              if (errors.message) {
                setErrors((prev) => ({ ...prev, message: undefined }));
              }
            }}
            placeholder="Highlight your background, relevant coursework or skills (e.g. Python, statistics, literature review), and your availability for research lab collaboration..."
            className={`text-xs md:text-sm font-sans ${
              errors.message ? "border-red-400 focus:ring-red-200" : ""
            }`}
          />
          <p id={messageHelpId} className="text-[0.72rem] text-slate-500">
            Explain your motivation, relevant skills, and expected weekly availability (minimum {minMessageLength} characters).
          </p>
          {errors.message && (
            <p role="alert" className="text-[0.75rem] font-medium text-red-700">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit & Context Footer */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[0.72rem] text-slate-500">
            <Info size={14} className="text-slate-400 shrink-0" />
            <span>
              Submission records your interest in the confidential student participation ledger.
            </span>
          </div>

          <Button
            type="submit"
            disabled={status === "submitting" || !isAuthenticated}
            className="btn-academic-primary text-xs py-2.5 px-5 shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            {status === "submitting" ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Submitting interest...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={13} />
                <span>Submit Expression of Interest</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
