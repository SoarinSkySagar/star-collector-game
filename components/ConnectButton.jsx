/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "@/public/idl/idl.json";
import * as anchor from "@project-serum/anchor";
import dynamic from 'next/dynamic';
import Link from 'next/link';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const devnetRpcUrl = web3.clusterApiUrl("devnet");

export default function RegisterUser() {
    const wallet = useAnchorWallet();

    useEffect(() => {
        if (wallet) {
            const connection = new web3.Connection(devnetRpcUrl);
            const provider = new AnchorProvider(connection, wallet, {
                preflightCommitment: "processed"
            });             
            const program = new Program(idl, programID, provider);
        }
    }, [wallet]);

    return (
        <div className='min-h-screen'>
            <WalletMultiButtonDynamic />
            {/* <br /> */}
            <Link className='bg-white text-black p-3 m-6 rounded-lg text-2xl font-bold' href="/play">Play game</Link>
        </div>
    );
}
