import EthTx from 'ethereumjs-tx'

import { 
    privKey ,
    sleepSec ,
    daiExchangeAbi, daiExchangeAddress, addressFrom, infuraURL } from './constants2.mjs';
import { info2, web3 } from './utils2.mjs';

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

//const ETH_SOLD = web3.utils.toHex(ETH_SOLDgwei); // 0.1ETH
const MIN_TOKENS = web3.utils.toHex(0.000000000002 * 10 ** 18); // 0.2 DAI
//const DEADLINE = 1682393932;

//const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKENS, DEADLINE).encodeABI()

const sendSignedTx2 = (transactionObject) =>{
    let transaction = new EthTx.Transaction(transactionObject, {'chain':'rinkeby'})
    const privateKey = Buffer.from(privKey, "hex")
    transaction.sign(privateKey)
    const serializedEthTx = transaction.serialize().toString("hex")

    try {        

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
            info2([sleepSec]);
            setTimeout(() => {getBal()}, 1000 * sleepSec );
        });

    } catch (error) {
        info2([sleepSec]);
        setTimeout(() => {getBal()}, 1000 * sleepSec );        
    }



}

const sendTransaction = async (array) => {
    
    let ETH_SOLDgwei = 100000000000000 ;

    if( array !== undefined ){
        if( array[0] !== undefined ){
            //console.log(array)

            /**
             * 
            console.log(
                web3.utils.fromWei(
                    array[0].toString() ,'ether') );
             */
            ETH_SOLDgwei = array[0] 

        }
    }

    const ETH_SOLD = web3.utils.toHex(ETH_SOLDgwei); // 0.1ETH
    const DEADLINE = Math.floor((Date.now() + 100000) / 1000) ;

    const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKENS, DEADLINE).encodeABI()

    console.log(
        'Sell (ETH): ' + 
            web3.utils.fromWei(
            ETH_SOLDgwei.toString() ,'ether')  );

    //const transactionNonce = await web3.eth.getTransactionCount(addressFrom)

    console.log('send to contract',daiExchangeAddress)
    
    web3.eth.getTransactionCount(addressFrom, function(err, transactionNonce ){
        if (!err) {
            const transactionObject = {
                nonce: web3.utils.toHex(transactionNonce),
                gasLimit: web3.utils.toHex(6000000),
                gasPrice: web3.utils.toHex(110000000000),
                to: daiExchangeAddress,
                from: addressFrom,
                data: exchangeEncodedABI,
                value: ETH_SOLD
            };
            try{
                sendSignedTx2(transactionObject)
            }catch(err){
                console.error(err)
            }
        }
    });
}

const getBal = async () => {
    console.log('My address:' , addressFrom)
    web3.eth.getBalance( addressFrom, function (err, result) {
        if (!err) {
            //console.log('ETH Owned: ' + web3.utils.fromWei( web3.utils.toBN(result).toString() , 'ether')); 
            let jual = web3.utils.fromWei( web3.utils.toBN(result).toString() , 'ether') ;
            //jual = jual / 1 ; 					
            console.log('ETH Owned (ETH): ', (jual * 1) * (100/100) )

            sendTransaction([
                result * (0.1/100) 
            ])
            
        }
    });
}

//sendTransaction()
getBal()
