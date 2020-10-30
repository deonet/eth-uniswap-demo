import Web3 from 'web3';
import EthTx from 'ethereumjs-tx'
//import { privKey, infuraURL } from './constants.mjs'
import { 
    addressFrom ,
    sleepSec ,
    privKey, infuraURL } from './constants2.mjs'

export const web3 = new Web3(
    new Web3.providers.HttpProvider(infuraURL)
)

export const sendSignedTx = (transactionObject) =>{
    let transaction = new EthTx.Transaction(transactionObject, {'chain':'rinkeby'})
    const privateKey = Buffer.from(privKey, "hex")
    transaction.sign(privateKey)
    const serializedEthTx = transaction.serialize().toString("hex")
    
    
        web3.eth.sendSignedTransaction(`0x${serializedEthTx}`)
        .on("transactionHash", async (hash) => {
            console.log(
                `transaction sent to the network, waiting for confirmations, ${JSON.stringify(
                    hash
                )}`
            );
        })
        .on("receipt", (receipt) => {
            console.log(
                `transaction received on the network`
            );
        });
        //.on('receipt', console.log); 
        
        info2([
            sleepSec
        ]);
    
}

/**
 * 
 *         info2([
            sleepSec
        ])
    
        setTimeout(() => {
            getBal([]) ;
        }, 1000 * sleepSec );

 */
