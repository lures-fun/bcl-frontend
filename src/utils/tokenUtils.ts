import { NokeyWallet } from '@nokey-wallet/adapter';

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
const encryptKey = process.env.NEXT_PUBLIC_ENCRYPT_KEY!;

export const fetchTokenBalance = async (walletAddress: string) => {
  const wallet = new NokeyWallet(rpcUrl, encryptKey);
  const tokenBalance =
    (await wallet.getTokenBalance({
      walletAddress: walletAddress,
      mintAddress: process.env.NEXT_PUBLIC_ADMIN_MINT_ADDRESS!,
      isTokenExtension: true,
    })) ?? '0';
  return tokenBalance;
};
