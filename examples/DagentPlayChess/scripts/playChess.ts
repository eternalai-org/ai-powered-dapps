import { ethers, network } from "hardhat";
import { DagentPlayChess } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { assert } from "chai";
import { BaseWallet, JsonRpcProvider, SigningKey } from "ethers";
import { gameLoop, printBoard, Board } from "./processBoard";

const config = network.config as any;

async function main() {
  const networkName = network.name.toUpperCase();
  let privateKey = config.senderKey;
  let rpcUrl = config.url;
  const aiPlayingChessDagentAddress = config.aiPlayingChessDagent;

  assert(
    aiPlayingChessDagentAddress,
    `Missing ${networkName}_AI_POWERED_PLAYING_CHESS_DAGENT_ADDRESS from environment variables!`
  );
  assert(
    privateKey,
    `Missing ${networkName}_PRIVATE_KEY from environment variables!`
  );
  assert(rpcUrl, `Missing ${networkName}_RPC_URL from environment variables!`);

  const player = await createWallet(privateKey, rpcUrl);

  const contractFactory = await ethers.getContractFactory("DagentPlayChess");
  const aiPoweredDagent = contractFactory.attach(
    aiPlayingChessDagentAddress
  ) as DagentPlayChess;

  console.log(`Let's play chess with Dagent...`);
  console.log(`Player address: ${player.address}`);
  console.log("------------------------");
  // await clearGame(aiPoweredDagent, player);

  await createGame(aiPoweredDagent, player);
  printBoard(currentBoard);

  gameLoop(await playChess(aiPoweredDagent, player, "b2-b4"));
  gameLoop(await waitToGetDagentMove(aiPoweredDagent, player));
  gameLoop(await playChess(aiPoweredDagent, player, "Nb1-c3"));
  gameLoop(await waitToGetDagentMove(aiPoweredDagent, player));
}

export async function createGame(
  aiPoweredDagent: DagentPlayChess,
  player: BaseWallet
) {
  console.log(`Create game...`);
  const txCheck = await aiPoweredDagent.connect(player).createGame();
  const receipt = await txCheck.wait();

  console.log("Tx hash: ", receipt?.hash);
  console.log("Tx status: ", receipt?.status == 1 ? "Success" : "Failed");
  console.log("------------------------");
  let inferResult;
  let inferId = 0;
  if (receipt?.status == 1) {
    // Get inference ID
    inferId = getInferId(receipt)[0];
    console.log("Wait for Dagent constructing a game...");
    console.log("- Inference ID: ", inferId);

    // Wait for inference result
    while (true) {
      await sleep(30000);
      try {
        inferResult = await aiPoweredDagent
          .connect(player)
          .fetchInferenceResult(inferId);
        break;
      } catch (e: any) {
        console.log(e.message.split('"')[1].split('"')[0]);
        // console.log(e.message);
        continue;
      }
    }
    console.log("Dagent: ", ethers.toUtf8String(inferResult));
    console.log("Let's play...");
  } else {
    console.log("Failed to create a game.");
    process.exit(1);
  }
}

async function playChess(
  aiPoweredDagent: DagentPlayChess,
  player: BaseWallet,
  move: string
) {
  try {
    console.log("------------------------");
    console.log("My move: ", move);
    const tx = await aiPoweredDagent.connect(player).play(move);
    const receipt = await tx.wait();
    console.log("Tx hash: ", receipt?.hash);
    console.log("Tx status: ", receipt?.status == 1 ? "Success" : "Failed");
  } catch (e: any) {
    console.log(e.message);
  }
  return move;
}

export async function waitToGetDagentMove(
  aiPoweredDagent: DagentPlayChess,
  player: BaseWallet
) {
  // Get inference ID
  let inferResult;
  let inferId = await aiPoweredDagent
    .connect(player)
    .currentInferId(player.address);
  console.log("------------------------");
  console.log("Wait for dagent move...");
  console.log("- Inference ID: ", inferId);

  // Wait for inference result
  while (true) {
    await sleep(30000);

    try {
      inferResult = await aiPoweredDagent
        .connect(player)
        .fetchInferenceResult(inferId);
      break;
    } catch (e: any) {
      console.log(e.message.split('"')[1].split('"')[0]);
      // console.log(e.message);
      continue;
    }
  }
  const move = ethers.toUtf8String(inferResult);
  console.log("Dagent move: ", move);
  return move;
}

export async function clearGame(
  aiPoweredDagent: DagentPlayChess,
  player: BaseWallet
) {
  await aiPoweredDagent.connect(player).clearPlayingContext();
}

export function getInferId(receipt: ethers.TransactionReceipt): number[] {
  return receipt.logs
    .filter(
      (log: any) =>
        log.topics[0] ===
          ethers.id("NewInference(uint256,address,address,uint256,uint256)") &&
        isAddressEq(log.address, config.promptSchedulerAddress)
    )
    .map((log: any) => {
      return parseInt(log.topics[1], 16);
    });
}

async function createWallet(
  privateKey: string,
  rpcUrl: string
): Promise<BaseWallet> {
  const wallet = new BaseWallet(
    new SigningKey(privateKey),
    new JsonRpcProvider(rpcUrl)
  );

  return wallet;
}

function isAddressEq(a: Address, b: Address): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export let currentBoard: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
