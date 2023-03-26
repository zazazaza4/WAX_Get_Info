import axios from "axios";
import fs from "fs";

import { GET_TOKENS, POST_CURRENCY_BALANCE } from "./consts.js";

async function getBalanceWax(wallet) {
  const res = await axios
    .post(`${POST_CURRENCY_BALANCE}`, {
      code: "eosio.token",
      account: wallet,
      symbol: "WAX",
    })
    .then((response) => {
      return response.data[0];
    })
    .catch((error) => {
      return new Error(error);
    });

  return res;
}

async function getTokens(wallet) {
  const res = await axios
    .get(`${GET_TOKENS}${wallet}`)
    .then((response) => {
      return response.data.balances;
    })
    .catch((error) => {
      return new Error(error);
    });

  return res;
}

async function getInfoAccount(wallet) {
  let wax = "";
  let tokens = [];
  await getBalanceWax(wallet).then((res) => {
    wax = res;
  });
  await getTokens(wallet).then((res) => {
    tokens = res;
  });

  const data = await {
    wallet,
    wax,
    tokens,
  };

  return data;
}

function createFile(account) {
  const { wallet, wax, tokens } = account;
  let tokensContent = ``;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const { amount, contract, currency, decimals } = token;

    tokensContent += `
    ---- ${currency} ---- \n
    amount: ${amount} \n
    contract: ${contract} \n
    decimals: ${decimals} \n
    `;
  }

  const content = `
  WAX: ${wax}\n
  ${tokensContent}
`;

  fs.writeFile(`${wallet}.txt`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${wallet}.txt has been created!`);
  });
}

async function main() {
  const promises = accounts.map((account) => getInfoAccount(account));
  const results = await Promise.all(promises);

  for (const acc of results) {
    await createFile(acc);
  }
}

main();
