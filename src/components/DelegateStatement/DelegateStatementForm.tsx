"use client";

import DelegateCard from "@/components/Delegates/DelegateCard/DelegateCard";
import DelegateStatementFormSection from "./DelegateStatementFormSection";
import TopIssuesFormSection from "./TopIssuesFormSection";
import OtherInfoFormSection from "./OtherInfoFormSection";
import { Button } from "@/components/ui/button";
import { type UseFormReturn, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { Delegate } from "@/app/api/common/delegates/delegate";
import {
  fetchDelegate,
  submitDelegateStatement,
  fetchVoterStats,
} from "@/app/delegates/actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type DelegateStatementFormValues } from "./CurrentDelegateStatement";
import Tenant from "@/lib/tenant/tenant";
import TopStakeholdersFormSection from "@/components/DelegateStatement/TopStakeholdersFormSection";
import { useSmartAccountAddress } from "@/hooks/useSmartAccountAddress";
import { useBlockNumber } from "wagmi";

export default function DelegateStatementForm({
  form,
}: {
  form: UseFormReturn<DelegateStatementFormValues>;
}) {
  const router = useRouter();
  const { ui } = Tenant.current();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber();
  const walletClient = useWalletClient();
  const messageSigner = useSignMessage();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [delegate, setDelegate] = useState<Delegate | null>(null);
  const [voterStats, setVoterStats] = useState<any | null>(null);

  const { data: scwAddress } = useSmartAccountAddress({ owner: address });

  const hasTopIssues = Boolean(
    ui.governanceIssues && ui.governanceIssues.length > 0
  );
  const hasStakeholders = Boolean(
    ui.governanceStakeholders && ui.governanceStakeholders.length > 0
  );

  const agreeCodeConduct = useWatch({
    control: form.control,
    name: "agreeCodeConduct",
  });

  useEffect(() => {
    async function fetchData() {
      if (address) {
        const [_delegate, _voterStats] = await Promise.all([
          fetchDelegate(address as string),
          fetchVoterStats(address as string, Number(blockNumber)),
        ]);
        setDelegate(_delegate);
        setVoterStats(_voterStats);
      }
    }

    fetchData();
  }, [address]);

  async function onSubmit(values: DelegateStatementFormValues) {
    if (!agreeCodeConduct) {
      return;
    }
    if (!walletClient) {
      throw new Error("signer not available");
    }

    values.topIssues = values.topIssues.filter((issue) => issue.value !== "");

    const {
      daoSlug,
      discord,
      delegateStatement,
      email,
      twitter,
      warpcast,
      topIssues,
      topStakeholders,
    } = values;

    // User will only sign what they are seeing on the frontend
    const body = {
      agreeCodeConduct: values.agreeCodeConduct,
      daoSlug,
      discord,
      delegateStatement,
      email,
      twitter,
      warpcast,
      topIssues,
      topStakeholders,
      scwAddress,
    };

    const serializedBody = JSON.stringify(body, undefined, "\t");
    const signature = await messageSigner
      .signMessageAsync({
        message: serializedBody,
      })
      .catch((error) => console.error(error));

    if (!signature) {
      setSubmissionError("Signature failed, please try again");
      return;
    }

    const response = await submitDelegateStatement({
      address: address as `0x${string}`,
      delegateStatement: values,
      signature,
      message: serializedBody,
      scwAddress,
    }).catch((error) => console.error(error));

    if (!response) {
      setSubmissionError(
        "There was an error submitting your form, please try again"
      );
      return;
    }

    router.push(`/delegates/${address}?dssave=true`);
  }

  const canSubmit =
    !!walletClient &&
    !form.formState.isSubmitting &&
    !!form.formState.isValid &&
    !!agreeCodeConduct;

  return (
    <div className="flex flex-col sm:flex-row-reverse items-center sm:items-start gap-16 justify-between mt-12 w-full max-w-full">
      {delegate && (
        <div className="flex flex-col static sm:sticky top-16 shrink-0 w-full sm:max-w-xs">
          <DelegateCard
            delegate={delegate}
            totalProposals={voterStats?.total_proposals}
            lastTenProps={voterStats?.last_10_props}
          />
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="flex flex-col bg-neutral border rounded-xl border-line shadow-newDefault">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DelegateStatementFormSection form={form} />
              {hasTopIssues && <TopIssuesFormSection form={form} />}
              {hasStakeholders && <TopStakeholdersFormSection form={form} />}
              <OtherInfoFormSection form={form} />

              <div className="flex flex-col sm:flex-row justify-end sm:justify-between items-stretch sm:items-center gap-4 py-8 px-6 flex-wrap">
                <span className="text-sm text-primary">
                  Tip: you can always come back and edit your profile at any
                  time.
                </span>

                <Button
                  variant="elevatedOutline"
                  className="py-3 px-4"
                  disabled={!canSubmit}
                  type="submit"
                >
                  Submit delegate profile
                </Button>
                {form.formState.isSubmitted && !agreeCodeConduct && (
                  <span className="text-red-700 text-sm">
                    You must agree with the code of conduct to continue
                  </span>
                )}
                {submissionError && (
                  <span className="text-red-700 text-sm">
                    {submissionError}
                  </span>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
