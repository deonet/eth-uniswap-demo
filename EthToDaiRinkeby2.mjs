import { 
    privKey ,
    sleepSec ,
    daiExchangeAbi, daiExchangeAddress, addressFrom, infuraURL } from './constants2.mjs';
//import { sendSignedTx, web3 } from './utils.mjs';
import { sendSignedTx, web3 } from './utils2.mjs';
import EthTx from 'ethereumjs-tx'

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const sendTransaction2 = async (params) => {
    console.log(params);
    console.log( 'getTransactionCount')

    const ETH_SOLDgwei = params[1]

    const ETH_SOLD = web3.utils.toHex(ETH_SOLDgwei); // 0.1ETH
    const MIN_TOKENS = web3.utils.toHex(0.00000002 * 10 ** 18); // 0.2 DAI
    const DEADLINE = Math.floor((Date.now() + 100000) / 1000) ;
    
    const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKENS, DEADLINE).encodeABI()    
    
    //const transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    const transactionNonce = params[0]

    console.log(transactionNonce*1)

    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(100000000000),
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

//sendTransaction()

var handleReceipt = (error, receipt) => {
    if (error) console.error(error);
    else {
      console.log( web3.utils.fromWei(receipt,'ether') * 1 );
      //res.json(receipt);
    }
}

export const getBal = async (params) => {

    console.log(addressFrom , ' balance (ETH) = ')
    
    web3.eth.getBalance( addressFrom ,function(error,result){

        if(!error){
            handleReceipt(error,result);

            let sell1 = result * (0.1/100)
            console.log( 
            web3.utils.fromWei(
            sell1.toString(),'ether')*1 ,' ETH (sell)')

            web3.eth.getTransactionCount(addressFrom, function(error, txCount) {
                if(!error){
                    sendTransaction2([
                        txCount ,
                        sell1 
                    ])

                }

            });

        }
     })

}

function info2(array){
    let diff 
    if( array === undefined ){
        diff = 60
    }    
    else{
        diff = array[0] ; // array[0]
    }
    console.log('sleep (secs): ', diff);
    var d = new Date()
    d.setHours(d.getHours() + 7 )

    console.log(d, ' now')

    //console.log(d.getTime())
    d.setSeconds(d.getSeconds() + diff)
    
    console.log(d,' next')
	
    console.log('')

}

const sendSignedTx2 = (transactionObject) =>{
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
            info2([
                sleepSec
            ]);
            setTimeout(() => {
                getBal([]) ;
            }, 1000 * sleepSec );
        });
        //.on('receipt', console.log); 
        
    
}

getBal([])