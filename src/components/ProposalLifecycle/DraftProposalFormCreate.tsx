"use client";

import React, { useContext } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-proposal-draft";

import { ProposalLifecycleDraftContext } from "@/contexts/ProposalLifecycleDraftContext";

import DraftProposalAbstract from "./DraftProposalAbstract";
import DraftProposalTypeChoice from "./DraftProposalTypeChoice";
import DraftProposalTransaction from "./DraftProposalTransaction";
import DraftProposalCreateButton from "./DraftProposalCreateButton";
import DraftProposalTitleInput from "./DraftProposalTitleInput";
import DraftProposalDescriptionInput from "./DraftProposalDescriptionInput";
import { ProposalDraft } from "@prisma/client";

const staticText = {
  heading: "Create proposal draft",
  description:
    "Use this draft to create and share the proposal you’d like to submit",
  proposalTypeExplanation:
    "Passed on-chain, Executable Proposals execute code related to ENS and ENS DAO contracts, as voted on by the DAO.",
  proposalTitlePlaceholder: "[EPx.x][Executable] My proposal title...",
  proposalDescriptionPlaceholder:
    "A short (1-2 sentence) description of the proposal...",
  proposalAbstractPlaceholder:
    "Here’s what my proposal aims to achieve (p.s. I like markdown formatting)...",
  proposedTransactionDescription:
    "Proposed transactions will execute after a proposal passes and then gets executed. If you skip this step, a transfer of 0 ETH to you (the proposer) will be added.",
  createButtonExplanation:
    "This will post your draft to both the ENS forums and request an update to the ENS DAO docs.",
  checkmarkInfo:
    "Both of these are required. Please uncheck only if you’ve already completed these manually.",
};

interface DraftProposalFormCreateProps {
  setStage: React.Dispatch<
    React.SetStateAction<"draft-temp-check" | "draft-create" | "draft-submit">
  >;
  proposal: ProposalDraft;
  updateProposal: (
    proposal: ProposalDraft,
    updateData: Partial<ProposalDraft>
  ) => void;
}

const DraftProposalFormCreate: React.FC<DraftProposalFormCreateProps> = (
  props
) => {
  return (
    <div className="">
      <AccordionItem
        value="draft-create"
        className="w-full rounded-2xl border border-gray-eo shadow-sm"
      >
        <AccordionTrigger>
          <h2 className="text-2xl font-black">{staticText.heading}</h2>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-4f px-6 pb-7 max-w-[620px]">
            {staticText.description}
          </p>
          <DraftProposalTypeChoice
            label="Proposal type"
            explanation={staticText.proposalTypeExplanation}
            proposal={props.proposal}
            updateProposal={props.updateProposal}
          />
          <DraftProposalTitleInput
            label="Title"
            placeholder={staticText.proposalTitlePlaceholder}
            proposal={props.proposal}
            updateProposal={props.updateProposal}
          />
          <DraftProposalDescriptionInput
            label="Description"
            placeholder={staticText.proposalDescriptionPlaceholder}
            proposal={props.proposal}
            updateProposal={props.updateProposal}
          />
          <DraftProposalAbstract
            label="Abstract"
            placeholder={staticText.proposalAbstractPlaceholder}
            proposal={props.proposal}
            updateProposal={props.updateProposal}
          />
          <DraftProposalTransaction
            label="Proposed transaction"
            description={staticText.proposedTransactionDescription}
          />
          <DraftProposalCreateButton
            description={staticText.createButtonExplanation}
            checkmarkInfo={staticText.checkmarkInfo}
            setStage={props.setStage}
            proposal={props.proposal}
            updateProposal={props.updateProposal}
          />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default DraftProposalFormCreate;
