export type InterestSubmissionResult = {
  error?: string;
  success?: string;
  code?: "already_submitted" | "unavailable";
};

export type InterestSubmissionAction = (
  formData: FormData,
) => Promise<InterestSubmissionResult>;

export async function submitInterestThroughAction(
  action: InterestSubmissionAction | undefined,
  formData: FormData,
): Promise<InterestSubmissionResult> {
  if (!action) {
    return {
      error:
        "Interest submission is temporarily unavailable. Your message has not been saved.",
      code: "unavailable",
    };
  }
  return action(formData);
}
