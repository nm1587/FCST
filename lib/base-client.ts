import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

export const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

// Helper to get balance
export async function getBalance(address: `0x${string}`) {
    const balance = await publicClient.getBalance({ address });
    return balance;
}

export async function getBaseGasPrice() {
    const gasPrice = await publicClient.getGasPrice();
    return gasPrice;
}
