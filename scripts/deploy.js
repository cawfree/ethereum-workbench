#!/usr/bin/env node

import {argv} from "yargs";

import {web3, address} from "./setup";
import {deploy} from "../src";

const {contract: path} = argv;

deploy(web3, address, path);
