import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PRIVATE_ADDRESS, TOKEN_MINT_ADDRESS } from "./address.js";
import bs58 from "bs58";
import { Keypair, PublicKey, Connection } from "@solana/web3.js";
const connection = new Connection("http://api.devnet.solana.com");



export async function mintTokens(fromAccount, toAccount, amount) {
  try {
    const uint8Array = bs58.decode(PRIVATE_ADDRESS);
    const payer = Keypair.fromSecretKey(uint8Array);
    const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintPublicKey,
      new PublicKey(toAccount)
    );

    const mintAmount = BigInt(amount * 10 ** 9);

    await mintTo({
        connection,
        payer,
        mint:TOKEN_MINT_ADDRESS,
        destination:recipientTokenAccount.address,
        authority:payer,
        amount:mintAmount,
        multiSigners:[],
        programId:TOKEN_PROGRAM_ID,
    });
   
  } catch (err) {
    console.log(err);
    throw err;
  }
}
