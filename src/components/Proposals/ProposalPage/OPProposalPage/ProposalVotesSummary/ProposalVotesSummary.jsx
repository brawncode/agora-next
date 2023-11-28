import { VStack, HStack } from "@/components/Layout/Stack";
import styles from "./proposalVotesSummary.module.scss";
import { TokenAmountDisplay } from "@/lib/utils";
import ProposalTimeStatus from "@/components/Proposals/Proposal/ProposalTimeStatus";
import ProposalVotesBar from "../ProposalVotesBar/ProposalVotesBar";

export default function ProposalVotesSummary({ proposal }) {
  return (
    <VStack gap={2} className={styles.proposal_votes_summary_container}>
      <HStack justifyContent="justify-between" className="mt-2">
        <div className="gl_votes_for">
          FOR {TokenAmountDisplay(proposal.proposalResults.for, 18, "OP")}
        </div>
        <div className="gl_votes_against">
          AGAINST{" "}
          {TokenAmountDisplay(proposal.proposalResults.against, 18, "OP")}
        </div>
      </HStack>
      <ProposalVotesBar proposal={proposal} />
      <HStack justifyContent="justify-between" className="text-gray-4f">
        <div>QUORUM {TokenAmountDisplay(proposal.quorum, 18, "OP")}</div>
        <ProposalTimeStatus
          proposalStatus={proposal.status}
          proposalEndTime={proposal.end_time}
        />
      </HStack>    
    </VStack>
  );
}
