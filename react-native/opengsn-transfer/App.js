import React, { useEffect } from "react";
import { Buffer } from "buffer";
import { View, Text } from "react-native";
import { ethers } from "ethers";
import Web3 from "@react-native-anywhere/web3";
import { RelayProvider, resolveConfigurationGSN } from "@react-native-anywhere/gsn";

import Counter from "./build/contracts/Counter";

export default function App() {
  useEffect(
    () => {
      (async () => {
        // XXX: You need to get these values from starting `ganache-cli` and then running `yarn-gsn`!
        const forwarderAddress = "0x5e361E1ea676A932431cA529050F7D40076712Aa";
        const paymasterAddress = "0xbc6aE31E4bb631FE799D56dB26adAef301496948";

        const web3provider = new Web3.providers.HttpProvider("http://localhost:8545");
        const deploymentProvider = new ethers.providers.Web3Provider(web3provider);
        const factory = new ethers.ContractFactory(
          Counter.abi,
          Counter.bytecode,
          deploymentProvider.getSigner(),
        );

        const deployment = await factory.deploy(forwarderAddress);
        await deployment.deployed();

        const config = await resolveConfigurationGSN(
          web3provider,
          {
            verbose: true,
            forwarderAddress,
            paymasterAddress,
          },
        );

        const gsnProvider = new RelayProvider(web3provider, config);

        const account = new ethers.Wallet(Buffer.from("1".repeat(64), "hex"));
        const { address: from } = account;
        gsnProvider.addAccount({
          address: from,
          privateKey: Buffer.from(account.privateKey.replace("0x", ""), "hex"),
        });

        const etherProvider = new ethers.providers.Web3Provider(gsnProvider);
        const counter = deployment.connect(etherProvider.getSigner(from));
        const countBefore = await counter.counter();
        await counter.increment();
        const countAfter = await counter.counter();

        console.warn('delta is', countBefore, countAfter);
      })();
    },
    [],
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Universal React with Expo</Text>
    </View>
  );
}
