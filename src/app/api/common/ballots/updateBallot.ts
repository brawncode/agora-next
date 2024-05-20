import { cache } from "react";
import { addressOrEnsNameWrap } from "../utils/ensName";
import prisma from "@/app/lib/prisma";

type BallotContent = {
  metric_id: string;
  allocation: number;
  locked: boolean;
};

const updateBallotMetricApi = async (
  data: BallotContent,
  roundId: number,
  ballotCasterAddressOrEns: string
) =>
  addressOrEnsNameWrap(updateBallotMetricForAddress, ballotCasterAddressOrEns, {
    data,
    roundId,
  });

async function updateBallotMetricForAddress({
  data,
  roundId,
  address,
}: {
  data: BallotContent;
  roundId: number;
  address: string;
}) {
  // Create ballot if it doesn't exist
  await prisma.ballots.upsert({
    where: {
      address_round: {
        address,
        round: roundId,
      },
    },
    update: {
      updated_at: new Date(),
    },
    create: {
      round: roundId,
      address,
    },
  });
  return prisma.allocations.upsert({
    where: {
      address_round_metric_id: {
        metric_id: data.metric_id,
        round: roundId,
        address,
      },
    },
    update: {
      allocation: data.allocation,
      locked: data.locked,
      updated_at: new Date(),
    },
    create: {
      metric_id: data.metric_id,
      round: roundId,
      address,
      allocation: data.allocation,
      locked: data.locked,
    },
  });
}

const deleteBallotMetricApi = async (
  metricId: string,
  roundId: number,
  ballotCasterAddressOrEns: string
) =>
  addressOrEnsNameWrap(deleteBallotMetricForAddress, ballotCasterAddressOrEns, {
    metricId,
    roundId,
  });

async function deleteBallotMetricForAddress({
  metricId,
  roundId,
  address,
}: {
  metricId: string;
  roundId: number;
  address: string;
}) {
  return prisma.allocations.deleteMany({
    where: {
      metric_id: metricId,
      address,
      round: roundId,
    },
  });
}

const updateBallotOsMultiplierApi = async (
  multiplier: number,
  roundId: number,
  ballotCasterAddressOrEns: string
) =>
  addressOrEnsNameWrap(
    updateBallotOsMultiplierForAddress,
    ballotCasterAddressOrEns,
    {
      multiplier,
      roundId,
    }
  );

async function updateBallotOsMultiplierForAddress({
  multiplier,
  roundId,
  address,
}: {
  multiplier: number;
  roundId: number;
  address: string;
}) {
  return prisma.ballots.upsert({
    where: {
      address_round: {
        address,
        round: roundId,
      },
    },
    update: {
      os_multiplier: multiplier,
      updated_at: new Date(),
    },
    create: {
      round: roundId,
      address,
      os_multiplier: multiplier,
    },
  });
}

const updateBallotOsOnlyApi = async (
  toggle: boolean,
  roundId: number,
  ballotCasterAddressOrEns: string
) =>
  addressOrEnsNameWrap(updateBallotOsOnlyForAddress, ballotCasterAddressOrEns, {
    toggle,
    roundId,
  });

async function updateBallotOsOnlyForAddress({
  toggle,
  roundId,
  address,
}: {
  toggle: boolean;
  roundId: number;
  address: string;
}) {
  return prisma.ballots.upsert({
    where: {
      address_round: {
        address,
        round: roundId,
      },
    },
    update: {
      os_only: toggle,
      updated_at: new Date(),
    },
    create: {
      round: roundId,
      address,
      os_only: toggle,
    },
  });
}

export const updateBallotMetric = cache(updateBallotMetricApi);
export const deleteBallotMetric = cache(deleteBallotMetricApi);
export const updateBallotOsMultiplier = cache(updateBallotOsMultiplierApi);
export const updateBallotOsOnly = cache(updateBallotOsOnlyApi);
