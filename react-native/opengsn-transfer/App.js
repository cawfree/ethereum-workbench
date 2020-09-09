import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { Web3HttpProvider, OpenGSN } from "@react-native-anywhere/anywhere";

import TransferFunds from "./build/contracts/TransferFunds";

// TODO: This is kind of redundant; check the output format?
const { RelayProvider: { RelayProvider }, GSNConfigurator: { resolveConfigurationGSN } } = OpenGSN;

export default function App() {
  useEffect(
    () => {
      (async () => {
        // XXX: These will need to be defined by the API.
        const forwarderAddress = "0xD39A600331C2Fc4CdEE41C248F7fffe2bb783b63";
        const paymasterAddress = "0x5c0B8a1f30a460465fEEf54bf054c3D64f066071";

        const httpProvider = new Web3HttpProvider("http://localhost:8545");
        const deploymentProvider = new ethers.providers.Web3Provider(httpProvider);
        const factory = new ethers.ContractFactory(TransferFunds.abi, TransferFunds.bytecode, deploymentProvider.getSigner());

        const deployment = await factory.deploy(forwarderAddress);
        const deploymentResult = await deployment.deployed();

        // XXX: We will need to manage this on the API.
        const initializeContractWithFunds = async ({ contractAddress }) => {
          // XXX: These are defined by ganache, and represent the environment configuration that would
          //      rest on the API.
          const address = "0xe92D582fFf4a9a3f29F8A4BA294fe73D1854DFB6";
          const privateKey = "0x010ca9eff75fd977a5c5436ac2181248bb684805f98c53994a7fc0fd70ec2486";
          
          const wallet = new ethers.Wallet(privateKey, deploymentProvider);

          // XXX: Create a transaction using the amount we want to use.
          const transaction = {
            gasLimit: ethers.BigNumber.from("2000000"),
            to: contractAddress,
            value: ethers.utils.parseEther("1.0"),
          };

          await wallet.connect(deploymentProvider);

          const balance = await wallet.getBalance();
          console.warn(balance);
          const transactionResult = await wallet.sendTransaction(transaction);
          console.warn("Populated contract!");
        };
 
        console.warn("Deployed the contract!");

        const config = await resolveConfigurationGSN(
          httpProvider,
          { verbose: true, forwarderAddress, paymasterAddress },
        );
        // TODO; fetch from those with balances
        const gsnProvider = new RelayProvider(httpProvider, config);
        const etherProvider = new ethers.providers.Web3Provider(gsnProvider);
        const etherSigner = etherProvider.getSigner(address);
        const transferFunds = deployment.connect(etherSigner);

        const {address: customContractAddress} = transferFunds;

        await initializeContractWithFunds({ contractAddress: customContractAddress });

        const wallet = new ethers.Wallet(Buffer.from("1".repeat(64), "hex"));
        const { address } = wallet;

        gsnProvider.addAccount({
          address,
          privateKey: Buffer.from(wallet.privateKey.replace("0x", ""), "hex"),
        });
        
        const addressToPay = "0x727E2666662A7DE652F206269fEb258748834aa1";

        transferFunds.on(
          "Transfer",
          async (toAddress, amount) => {
            console.warn({ toAddress, addressToPay });
            const balance = await etherProvider.getSigner(toAddress).getBalance();
            console.warn("Next balance:", balance);
          },
        );
        const balance = await etherProvider.getSigner(addressToPay).getBalance();

        transferFunds.on("InsufficientFunds", () => console.warn("Insufficient funds!"));

        // XXX: Transfer funds to the target address.
        await transferFunds.transferFunds(addressToPay, "1");
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
      <Text>OpenGSN TransferFunds Example</Text>
    </View>
  );
}
