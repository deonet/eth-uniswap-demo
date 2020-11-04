import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb'

import UniswapV2Abi from "./IUniswapV2Router02.mjs";

import EthTx from 'ethereumjs-tx'

import { 
    privKey ,
    daiExchangeAbi, daiExchangeAddress, addressFrom, infuraURL } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

const sleepSec=6*1

let db =
'C:/Users/gold1tb/Documents/GitHub/a02/uniswap-skim/public/db2.json';
db = lowdb(new FileSync(db));

let db2 = 'dbBuy2.json';
db2 = lowdb(new FileSync(db2));

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const toContract = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const UniswapV2ContractAddress = toContract; 
let daiExchangeAddress2 = toContract;

const path1 ="0xc778417E063141139Fce010982780140Aa0cD5Ab";
const WETHContractAddress= path1

const uniswapV2Contract = new web3.eth.Contract(UniswapV2Abi, UniswapV2ContractAddress);

const ETH_SOLD = web3.utils.toHex(1000000000000000); // 0.1ETH
const MIN_TOKENS = web3.utils.toHex(0.0000000002 * 10 ** 18); // 0.2 DAI

Date.prototype.addMinutez = function(m) {
    this.setTime(this.getTime() + (m*60*1000));
    return this;
}
    
const sendSignedTx2 = async (array) => {
    let transactionObject = array[0]
    let obj5 = array[1]

    console.log(array[1])
    
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
        let newData = { 
            tokenName : obj5.title ,
            token0 : "token0" ,
            addressUniq : obj5.addressUniq ,
            tokenValue : 'value2',
            hash : hash
        };
        db2.read();
        let buyCount = db2.get('posts').size().value();
        if (!buyCount )db2.defaults({ posts: [], }).write();        
        db2.get('posts').push( newData ).write();

    })    
    .on("receipt", (receipt) => {
        //console.log(receipt);
        console.log(
            `transaction received on the network`
        );
        setTimeout(() => { msg();
        }, 1000 * (sleepSec) );
    
    });
}

const sendTransaction = async (params) => {

    const path2 = '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'; // MKR
    const TokenContractAddress2 = path2 
    
    const DEADLINE = 1682393932;
    
    const exchangeEncodedABI = daiExchangeContract.methods.ethToTokenSwapInput(MIN_TOKENS, DEADLINE).encodeABI()

    const exchangeEncodedABI2 = uniswapV2Contract.methods
    .swapExactETHForTokens(MIN_TOKENS, [WETHContractAddress, TokenContractAddress2], addressFrom, DEADLINE)
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
        data: exchangeEncodedABI2,
        value: ETH_SOLD
      };

    try{
        if ( transactionNonce !== -1) {
            sendSignedTx2([
                transactionObject ,
                params
            ])            
        }
    }catch(err){
        console.error(err)
    }
}

function who() {

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('joker');
      }, 200);
    });
  }
  
  function what() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('lurks');
      }, 300);
    });
  }
  
  function where() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('in the shadows');
      }, 1000 * (1) );
    });
  }

async function what2() {
  db.read();
    let tokens1 = await 
    db.get('tokens')
    .size()
    .value();
    console.log(tokens1,'token total')

    let loop = 15 

    for (let index = 0; index < loop; index++) {
        const element = tokens1 - loop + index ;
        const element2 = await
        db.get('tokens['+(element)+']')
          .value() ;

        let obj2 = {}

        const compare1 = await
        db2.get('posts')
          .filter({addressUniq: element2.addressUniq })
          .sortBy('addressUniq')
          .take(50)
          .value();
        
        let DateFriendly = new Date(element2.inputDt)

        console.log( element , element2.addressUniq , compare1.length 
        ) ;
          
        let action2

        if (compare1.length===0) {
          console.log(DateFriendly.addMinutez(7*60),'@ input');
          console.log(DateFriendly.addMinutez(10) , '@ target buy');
          let current1 = new Date().addMinutez(7*60)
          action2 = current1 > DateFriendly  
          console.log(current1,'@ current +7',action2);
          //console.log();              
          
            //console.log( compare1.length ) ;
          obj2.addressUniq = element2.addressUniq ;
          obj2.title = element2.title ;
          obj2.inputDtSkim = element2.inputDt ;
          
          if(action2){
            //db2.get('posts').push( obj2 ).write() ;
            return new Promise(resolve => {
                resolve(obj2);
            });
          }
          break;           
        
        }else{
          //console.log( compare1.length ) ;
        }
        //console.log('a', action2 )
    }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(false);
    }, 3);
  });
}

  async function msg() {
    const a = await who();
    console.log(`${ a } `);
    const b = await what();
    console.log(`${ a } ${ b } `);
    const c = await where();  
    console.log(`${ a } ${ b } ${ c }`);

    const obj3 = await what2();
    //console.log(obj3);

    if (obj3) {
        sendTransaction(obj3)        
    }
    else{
        setTimeout(() => { msg();
        }, 1000 * (sleepSec) );
    }

  }
  
  msg(); // 🤡 lurks in the shadows <-- after 1 second

//sendTransaction()