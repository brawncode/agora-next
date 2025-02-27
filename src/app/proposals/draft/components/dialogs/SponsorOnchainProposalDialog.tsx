import { VStack } from "@/components/Layout/Stack";
import { useRouter } from "next/navigation";
import { useWaitForTransactionReceipt } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { icons } from "@/assets/icons/icons";
import Tenant from "@/lib/tenant/tenant";
import { UpdatedButton } from "@/components/Button";
import { getBlockScanUrl } from "@/lib/utils";

const SponsorOnchainProposalDialog = ({
  redirectUrl,
  txHash,
  closeDialog,
}: {
  redirectUrl: string;
  txHash: `0x${string}`;
  closeDialog: () => void;
}) => {
  const tenant = Tenant.current();
  const { isLoading } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const router = useRouter();
  return (
    <VStack alignItems="items-center">
      <VStack className="w-full bg-white rounded-xl">
        <VStack>
          <VStack className="w-full">
            <Image
              src={
                isLoading ? tenant.ui.assets.pending : tenant.ui.assets.success
              }
              className="w-full mb-3"
              alt={isLoading ? "Pending" : "Success"}
            />
            <div className="mb-2 text-2xl font-black">
              {isLoading ? "Creating your proposal ..." : "Proposal complete!"}
            </div>
            {isLoading && (
              <div className="mb-5 text-base text-secondary">
                It might take up to a minute for the changes to be reflected.
              </div>
            )}
            {!isLoading && (
              <div className="text-base text-secondary mb-5">
                It may take a few minutes for the proposal to be indexed and
                appear on Agora.
              </div>
            )}
            <div>
              <UpdatedButton
                fullWidth={true}
                type="primary"
                isLoading={isLoading}
                onClick={async () => {
                  // TODO: redirect to the proposal page once we have indexing available
                  router.push(redirectUrl);
                  closeDialog();
                }}
              >
                {isLoading
                  ? "Saving your proposal onchain..."
                  : "View Proposals"}
              </UpdatedButton>
            </div>
            {!isLoading && (
              <div className="flex flex-row justify-between items-center mt-4">
                <span className="text-secondary">
                  View transaction on block explorer
                </span>
                <div className="flex flex-row items-center space-x-2">
                  <Link href={`${getBlockScanUrl(txHash)}`}>
                    <Image
                      src={icons.link}
                      height="16"
                      width="16"
                      alt="link icon"
                    />
                  </Link>
                </div>
              </div>
            )}
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default SponsorOnchainProposalDialog;
