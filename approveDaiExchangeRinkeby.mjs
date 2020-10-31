import { daiTokenAbi, daiTokenAddress, daiExchangeAddress, addressFrom } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

let daiTokenAddress2 = 
'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' ;// daiTokenAddress

let daiExchangeAddress2 = 
'0x7a250d5630b4cf539739df2c5dacb4c659f2488d' ; // daiExchangeAddress

const daiTokenContract = new web3.eth.Contract(
    JSON.parse(daiTokenAbi),
    daiTokenAddress2
  );

  const TOKENS = web3.utils.toHex(999 * 10 ** 18); // 1 DAI

  //const approveEncodedABI = daiTokenContract.methods.approve('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', TOKENS).encodeABI()
  
  const approveEncodedABI = daiTokenContract.methods.approve(daiExchangeAddress2, TOKENS).encodeABI()

  const sendTransaction = async () => {
    const transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiTokenAddress2,
        from: addressFrom,
        data: approveEncodedABI
      };

    try{
        sendSignedTx(transactionObject)
    }catch(err){
        console.error(err)
    }
}

sendTransaction()

