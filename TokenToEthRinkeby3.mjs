import EthTx from 'ethereumjs-tx'

import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb'
let db = lowdb(new FileSync('dbSold.json'));

let size2 = 
db.get('posts')
  .size()
  .value()

console.log('size',size2)

//db.get('posts')
//  .push({ id: 1, title: 'lowdb is awesome'})
//  .write()
//db.defaults({ posts: [], })
//  .write()

import UniswapV2Abi from "./IUniswapV2Router02.mjs";

import { web3, sendSignedTx } from "./utils.mjs";
import { 
    privKey ,
    daiExchangeAddress, addressFrom, daiExchangeAbi } from "./constants.mjs";

let daiTokenAddress = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"

const toContract = 
'0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const UniswapV2ContractAddress = toContract; 
let daiExchangeAddress2 = toContract;

const path1 ="0xc778417E063141139Fce010982780140Aa0cD5Ab";
const WETHContractAddress= path1

const path2 = daiTokenAddress;
const TokenContractAddress2 = path2 

//const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const uniswapV2Contract = new web3.eth.Contract(UniswapV2Abi, UniswapV2ContractAddress);

const TOKENS_SOLD = web3.utils.toHex(1 * 10 ** 18); // 0.4DAI
const MIN_ETH = web3.utils.toHex(5000000000000); // 0.005ETH
const DEADLINE = 1682393932;

//const tokenToEthEncodedABI = daiExchangeContract.methods
//    .tokenToEthSwapInput(TOKENS_SOLD, MIN_ETH, DEADLINE)
//    .encodeABI();

const TokenDecimalNumber = 18
const MinimumTokens = web3.utils.toHex( 
    0.000001 * 10 ** TokenDecimalNumber);

/**
 * Function: swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)
 */
const tokenToEthEncodedABI2 = uniswapV2Contract.methods
.swapExactTokensForETH(
    TOKENS_SOLD ,
    MinimumTokens, [TokenContractAddress2 , WETHContractAddress], addressFrom, 
    Math.floor((Date.now() + 100000) / 1000)
)
.encodeABI({
    from: addressFrom,
});	

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
        db.get('posts')
        .push({ 
            hash :  hash ,
        })
        .write()

    })
    .on("receipt", (receipt) => {
        console.log(
            `transaction received on the network`
        );
        //info2([sleepSec])
        //setTimeout(() => {getBal() }, 1000 * sleepSec );

    });
}

const sendTransaction = async () => {

    let transactionNonce = -1

    transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiExchangeAddress2,
        from: addressFrom,
        data: tokenToEthEncodedABI2
    };

    try {
        if (transactionNonce > -1 ) {
            sendSignedTx2(transactionObject)            
        }
    } catch (err) {
        console.error(err)
    }
}

const getTBal = async (array) => {

    var AddressFrom = addressFrom   
    var contractAddr = daiTokenAddress   
    var tknAddress = (addressFrom).substring(2)    
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress)

    console.log('Getting contract tokens balance.....')
    console.log("My Address: " + AddressFrom )
    console.log("Token address : " + contractAddr)
    console.log('sell token to address: ', daiExchangeAddress )

    await web3.eth.call({
        to: contractAddr, // Contract address, used call the token balance of the address in question
        data: contractData // Combination of contractData and tknAddress, required to call the balance of an address 
        }, function(err, result) {
        if (result) { 
            let percenJual = 0.1   ;
            var tokens = web3.utils.toBN(result).toString(); // Convert the result to a usable number string
            console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether')); 			
            let jualT = web3.utils.fromWei(tokens, 'ether')   
            //console.log( (jualT * 1) * (percenJual/100) )

            sendTransaction()
			
        }
        else {
            console.log(err); // Dump errors here
        }
    });
}

//sendTransaction()
getTBal()
