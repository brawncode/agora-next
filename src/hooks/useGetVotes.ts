import { useQuery } from "@tanstack/react-query";
import Tenant from "@/lib/tenant/tenant";
import { getPublicClient } from "@/lib/viem";

export const VOTES_QK = "proposalThreshold";

export const useGetVotes = ({
  address,
  blockNumber,
  enabled,
}: {
  address: `0x${string}`;
  blockNumber: bigint;
  enabled: boolean;
}) => {
  const client = getPublicClient(Tenant.current().contracts.governor.chain.id);

  const { contracts } = Tenant.current();
  const { data, isFetching, isFetched } = useQuery({
    enabled: enabled,
    queryKey: [VOTES_QK, address, blockNumber.toString()],
    queryFn: async () => {
      const votes = (await client.readContract({
        abi: contracts.governor.abi,
        address: contracts.governor.address as `0x${string}`,
        functionName: "getVotes",
        args: [address, blockNumber ? blockNumber - BigInt(1) : BigInt(0)],
      })) as unknown as bigint;

      return votes;
    },
  });

  return { data, isFetching, isFetched };
};
