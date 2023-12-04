"use client";

import * as React from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./proposalVotesList.module.scss";
import { VStack, HStack } from "@/components/Layout/Stack";
import HumanAddress from "@/components/shared/HumanAddress";
import TokenAmountDisplay from "@/components/shared/TokenAmountDisplay";
import Image from "next/image";
import { HoveredVoter } from "@/components/Proposals/ProposalPage/HoveredVoter/HoveredVoter";

export default function ProposalVotesList({
  initialProposalVotes,
  fetchVotesForProposal,
  proposal_id,
  fetchDelegate,
}) {
  const fetching = React.useRef(false);
  const [pages, setPages] = React.useState([initialProposalVotes] || []);
  const [meta, setMeta] = React.useState(initialProposalVotes.meta);
  const [hoveredVoterAddress, setHoveredVoterAddressValue] =
    React.useState(null);
  const [isPending, startTransition] = React.useTransition();
  function setHoveredVoterAddress(value) {
    startTransition(() => setHoveredVoterAddressValue(value));
  }

  const loadMore = async (page) => {
    if (!fetching.current && meta.hasNextPage) {
      fetching.current = true;
      const data = await fetchVotesForProposal(proposal_id, page);
      const existingIds = new Set(proposalVotes.map((v) => v.transactionHash));
      const uniqueVotes = data.votes.filter(
        (v) => !existingIds.has(v.transactionHash)
      );
      setPages((prev) => [...prev, { ...data, votes: uniqueVotes }]);
      setMeta(data.meta);
      fetching.current = false;
    }
  };

  const proposalVotes = pages.reduce((all, page) => all.concat(page.votes), []);

  return (
    <div className={styles.vote_container}>
      {/* Show the hovered voter if there is one */}
      <HoveredVoter
        hoveredVoterAddress={hoveredVoterAddress}
        fetchDelegate={fetchDelegate}
        isPending={isPending}
      />
      <InfiniteScroll
        hasMore={meta.hasNextPage}
        pageStart={0}
        loadMore={loadMore}
        loader={
          <div className="flex justify-center mt-2" key={0}>
            <Image
              src="/images/blink.gif"
              alt="Blinking Agora Logo"
              width={50}
              height={20}
            />
          </div>
        }
      >
        {proposalVotes.map((vote, i) => (
          <VStack key={`vote_${i}`} gap={1} className={styles.vote_row}>
            <VStack>
              <div
                onMouseEnter={() => {
                  console.log("onMouseEnter", vote.address);
                  setHoveredVoterAddress(vote.address);
                }}
              >
                <HStack
                  justifyContent="justify-between"
                  className={styles.voter}
                >
                  <HStack gap={1} alignItems="items-center">
                    <HumanAddress address={vote.address} />
                  </HStack>
                  <HStack
                    gap={1}
                    alignItems="items-center"
                    className={styles.vote_weight}
                  >
                    <TokenAmountDisplay
                      amount={vote.weight}
                      decimals={18}
                      currency="OP"
                    />
                  </HStack>
                </HStack>
              </div>
            </VStack>
            <pre className={styles.vote_reason}>{vote.reason}</pre>
          </VStack>
        ))}
      </InfiniteScroll>
    </div>
  );
}
