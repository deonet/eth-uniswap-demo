import * as fs from "fs";
let student=JSON.parse(fs.readFileSync(
'C:/data2/secret3.txt'));
//console.log(student);
const public2 = student.public;

import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb'

import UniswapV2Abi from "./IUniswapV2Router02.mjs";

import EthTx from 'ethereumjs-tx'

import { 
    privKey ,
    daiExchangeAbi, daiExchangeAddress, addressFrom, infuraURL } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

const sleepSec=60*2;

let db = public2 + 'db2.json';
db = lowdb(new FileSync(db));

let db2 = public2 + 'dbBuy2.json';
db2 = lowdb(new FileSync(db2));

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

const toContract = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
const UniswapV2ContractAddress = toContract; 
let daiExchangeAddress2 = toContract;

const path1 ="0xc778417E063141139Fce010982780140Aa0cD5Ab";
const WETHContractAddress= path1

const uniswapV2Contract = new web3.eth.Contract(UniswapV2Abi, UniswapV2ContractAddress);

const ETH_SOLD = web3.utils.toHex(1000000000000000); // 0.1ETH
const MIN_TOKENS = web3.utils.toHex(0.0000000000002 * 10 ** 18); // 0.2 DAI

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
    const serializedEthTx = transaction.serialize().toString("hex");

  try {      

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
        new Timer();
        setTimeout(() => { msg();
        }, 1000 * (sleepSec) );    
    });

  } catch (error) {
      setTimeout(() => { msg();
      }, 1000 * (sleepSec) );          
  }

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

    let transactionNonce = -1 ;

    try {
      transactionNonce = await web3.eth.getTransactionCount(addressFrom);
    } catch (er) {
      console.log('transactionNonce fail')
    }

    try{
      if ( transactionNonce !== -1) {

        const transactionObject = {
          nonce: web3.utils.toHex(transactionNonce),
          gasLimit: web3.utils.toHex(6000000),
          gasPrice: web3.utils.toHex(10000000000),
          to: daiExchangeAddress2,
          from: addressFrom,
          data: exchangeEncodedABI2,
          value: ETH_SOLD
        };      
  
        console.log('transactionNonce',transactionNonce);
        sendSignedTx2([
                transactionObject ,
                params
            ]);
        }
    }catch(err){
      console.log('catch');
        console.error(err);
        
        setTimeout(() => { msg();
        }, 1000 * (sleepSec) );
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
          
        let action2

        if (compare1.length===0) {

          console.log( element , element2.addressUniq , 
            compare1.length ,
            element2.title
          ) ;
  
          console.log(DateFriendly.addMinutez(0),'@ input');
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

function printProgress(progress){
  //for (let index = 0; index < 99999; index++) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress + '' + '');      
  //}
}

class Timer {
  constructor() {
    this.counter = (((sleepSec-1)*10)*1)  ;

      let intervalId = setInterval(() => {
          this.counter = this.counter - 1;
          //console.log(this.counter);
          printProgress(this.counter);
          if(this.counter === 0){
            printProgress('');
            clearInterval(intervalId);
          }
      }, 1000 / 10  )
  }
}

  async function msg() {
    console.log('')
    console.log('sell eth, buy token')
    console.log(sleepSec, 'sleep Seconds')
    
    const a = await who();
    console.log(`${ a } `);
    //printProgress(`${ a } `);
    const b = await what();
    console.log(`${ a } ${ b } `);
    //printProgress(`${ a } ${ b }`);
    const c = await where();  
    console.log(`${ a } ${ b } ${ c }`);
    //printProgress(`${ a } ${ b } ${ c }`);
    //console.log('')

    const obj3 = await what2();
    //console.log(obj3);

    if (obj3) {
      console.log('object?',true);
        sendTransaction(obj3)        
    }
    else{
      console.log('object?',false);
      new Timer();
        setTimeout(() => { msg();
        }, 1000 * (sleepSec) );
    }

  }
  
  msg(); // 🤡 lurks in the shadows <-- after 1 second

//sendTransaction()