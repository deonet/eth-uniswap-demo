import * as fs from "fs";
let student=JSON.parse(fs.readFileSync(
'C:/data2/secret3.txt'));
//console.log(student);
const public2 = student.public;

import EthTx from 'ethereumjs-tx'

import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb'
let db = lowdb(new FileSync(public2 + 'dbSold.json'));

let size2 = 
db.get('posts')
  .size()
  .value()

console.log('dbSold size',size2)

db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()

db.defaults({ posts: [], })
  .write()

let db1=public2 + 'db2.json';
db1 = lowdb(new FileSync(db1));

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.addMinutez = function(m) {
  this.setTime(this.getTime() + (m*60*1000));
  return this;
}


const getNewT = async (params) => {
    db.read()

    db1.read()
    //console.log('db1 State has been updated')

    let tokens1 = 
    db1.get('tokens')
    .size()
    .value();
    console.log('tokens size =',tokens1)

    var d1 = new Date().addMinutez((7*60)+0);
    var countD = 5

    for (let index = 0; index < countD; index++) {
        const el = (tokens1 - countD) + index  ;
        console.log('token[]', el )

        let a = db1.get('tokens[' + el + ']')
        .value();

        console.log('token db1: ', a.title )

        //var splitted = a.inputDt.replace(' ',":").split(":", 100 ); 
        //console.log(splitted)    
        //var d3 = new Date().addHours(0);
        //d3.setHours(splitted[3]*1);
        //d3.setMinutes(splitted[4]*1);
        //d3 = d3.addMinutez((7*60)+10);
        var d3 = new Date(a.inputDt);
        d3.addHours(7);         
        console.log(d3 , ' input date')
        d3.addMinutez(20);         
        console.log(d3 , ' target sell after 20 minutes')
        console.log(d1 , ' current time +7')
        
        //console.log('date input: ', d3)
        var action2 = d1 > d3;
        var addressUniq0 = a['addressUniq']
        var title0 = a['title']

        let arrayData5 = db.get('posts')
        .filter({
            token0: addressUniq0 ,
        })
        .sortBy('token')
        .take(5000)
        .value()

        //console.log(arrayData5.length)
        if (arrayData5.length == 0) {
            break;
        }else{
            console.log('sold already @ ', 
                arrayData5[0].transactionHash );
            action2 = false ;
        }
        
    }
    let arrayData3 = []
    arrayData3['addressUniq'] = addressUniq0
    arrayData3['title'] = title0
    arrayData3['action'] = action2

    console.log( arrayData3 )
    
    return arrayData3

}




import UniswapV2Abi from "./IUniswapV2Router02.mjs";

import { web3, info2 } from "./utils2.mjs";
import { 
    sleepSec ,
    privKey ,
    daiExchangeAddress, addressFrom, daiExchangeAbi } from "./constants2.mjs";

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

let value2 = 10
const TOKENS_SOLD = web3.utils.toHex(value2 * 10 ** 18); // 0.4DAI
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

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

const sendSignedTx2 = (transactionObject,params) =>{

    console.log(params)

    let tokenName = params['title']
    let token0 = params['addressUniq']

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

        let newData = { 
            tokenName : tokenName ,
            token0 : token0 ,
            token : TokenContractAddress2 ,
            tokenValue : value2
        };

        for (let key in receipt) {
            let value = receipt[key];
            // Use `key` and `value`
            //console.log(key);console.log(' => ' , (typeof value) )
            if('object' !== (typeof value) ){
                newData["" + key ] = (value) 
            }
        }
        //newA.push({productId : 1 , price : 100 , discount : 10});

        db.get('posts')
        .push(newData)
        .write()

        info2([sleepSec]) 
        setTimeout(() => { getTBal() }, 1000 * sleepSec )

    });    
    /**
     * 
    .on('receipt', console.log);
     */
}

const sendTransaction = async (params) => {

    const tokenToEthEncodedABI2 = uniswapV2Contract.methods
    .swapExactTokensForETH(
        TOKENS_SOLD ,
        MinimumTokens, [TokenContractAddress2 , WETHContractAddress], addressFrom, 
        Math.floor((Date.now() + 100000) / 1000)
    )
    .encodeABI({
        from: addressFrom,
    });

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
            sendSignedTx2(transactionObject, params)            
        }
    } catch (err) {
        console.error(err)
    }
}

const getTBal = async (array) => {

    var data = await getNewT();
    
    var AddressFrom = addressFrom   
    var contractAddr = daiTokenAddress   
    var tknAddress = (addressFrom).substring(2)    
    var contractData = ('0x70a08231000000000000000000000000' + tknAddress)

    console.log('Getting contract tokens balance.....')
    console.log("My Address: " + AddressFrom )
    console.log("Token address : " + contractAddr)
    //console.log('sell token to address: ', daiExchangeAddress )

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

            data['contractAddr'] = contractAddr 
            if(data.action){
                console.log('data.action =' , data.action)
                sendTransaction(data)
            }else{
                info2([sleepSec]) 
                setTimeout(() => { getTBal() }, 1000 * sleepSec )
            }
			
        }
        else {
            console.log(err); // Dump errors here
        }
    });
}

//sendTransaction()
//info2([sleepSec])
getTBal()


