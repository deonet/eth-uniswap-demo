import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb' ;
let db = lowdb(new FileSync('dbAppr.json'));
db.defaults({ posts: [], }).write() ;

import EthTx from 'ethereumjs-tx'

import { 
  privKey ,
  daiTokenAbi, daiTokenAddress, daiExchangeAddress, addressFrom } from './constants.mjs';
import { sendSignedTx, web3 } from './utils.mjs';

let daiTokenAddress2 = 
'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' ; // daiTokenAddress

let daiExchangeAddress2 = 
'0x7a250d5630b4cf539739df2c5dacb4c659f2488d' ; // daiExchangeAddress

const daiTokenContract = new web3.eth.Contract(
    JSON.parse(daiTokenAbi),
    daiTokenAddress2
  );

let approveUnit=979;

  const TOKENS = web3.utils.toHex(approveUnit * 10 ** 18); // 1 DAI

  //const approveEncodedABI = daiTokenContract.methods.approve('0x7a250d5630b4cf539739df2c5dacb4c659f2488d', TOKENS).encodeABI()
  
  const approveEncodedABI = daiTokenContract.methods.approve(daiExchangeAddress2, TOKENS).encodeABI();

const sendSignedTx2 = (transactionObject,params) =>{
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
              let obj={};
              obj.transactionHash = receipt.transactionHash ;
              obj.addressUniq = params.addressUniq ;
              obj.addressUniq2 = params.addressUniq2 ;
              db.get('posts').push( obj ).write();
              
              var sleepSec=60*1;
              let dt=new Date();
              dt.setMinutes(dt.getMinutes() + (sleepSec/60) );
              console.log(dt,'sleep');
              console.log(dt.getMinutes(),'sleep');
              setTimeout(() => { 
                sendTransaction() ;}, 1000 * (sleepSec) );
          });
  
  } catch (error) { 
    console.log('eror');   
    setTimeout(() => { 
      sendTransaction() ;}, 1000 * (sleepSec) );
  }

}

function getTokenAddress() {
  let address1 = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

  let abc='';
  abc = abc + "\n\r" + "what to allows? " ;
  abc = abc + "\n\r" + "token: " + (address1) ;
  abc = abc + "\n\r" + "" + new Date() ;       
  console.log(abc,'');

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(address1);
    }, 1000 * (5) );
  });
}

async function getSkim(){
  db.read();
  
  let dbSkim ='../uniswap-skim/public/db2.json';
  dbSkim = lowdb(new FileSync(dbSkim));
    
    dbSkim.read();
    let tokens1 = await 
    dbSkim.get('tokens')
    .size()
    .value();
    console.log(tokens1,'token total');

    let loop = 15 

    for (let index = 0; index < loop; index++) {
      const element = tokens1 - loop + index ;
      const element2 = await
        dbSkim.get('tokens['+(element)+']')
          .value() ;
      
      const compare1 = await
      db.get('posts')
          .filter({addressUniq: element2.addressUniq })
          .sortBy('addressUniq')
          .take(50)
          .value();

      let logs2='';
      logs2=logs2 + element + ' '; 

      if (compare1.length===0) {
        console.log( logs2,'');      
        //console.log(element2.addressUniq,'');      
        //console.log('blm');
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(element2);
          }, 1000 * (5) );
        });
        break;
      }
      logs2=logs2 + element2.title + ' '; 
      logs2=logs2 + '\r\n ' + element2.addressUniq + ' '; 
      console.log( logs2,'');      
    }

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(false);
      }, 1000 * (5) );
    });
}

function getApproveEncodedABI(daiTokenAddress2) {
  let daiTokenContract2 = new web3.eth.Contract(
    JSON.parse(daiTokenAbi),
    daiTokenAddress2
  );  
  let approveEncodedABI2 = daiTokenContract2.methods.approve(daiExchangeAddress2, TOKENS).encodeABI();
  
  let abc='';
  abc = abc + "\n\r" + "approve(address spender, uint256 rawAmount)";
  abc = abc + "\n\r" + "[0] " + (daiExchangeAddress2) ;
  abc = abc + "\n\r" + "[1] " + (approveUnit) ;   
  console.log(abc,'');

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(approveEncodedABI2);
    }, 1000 * (5) );
  });
}

const sendTransaction = async () => {
  let isSendSignedTx = true ;
  
  let action2 = await getSkim() ;
  console.log(action2);
  
  let transactionNonce = -1 ;
  transactionNonce = await web3.eth.getTransactionCount(addressFrom) ;

  daiTokenAddress2 = await getTokenAddress();
  let approveEncodedABI3 = await getApproveEncodedABI(daiTokenAddress2);

    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(10000000000),
        to: daiTokenAddress2,
        from: addressFrom,
        data: approveEncodedABI3
      };

      if (!action2)isSendSignedTx=false;

      if (transactionNonce == -1)isSendSignedTx=false;

    try{
      if (isSendSignedTx) {
        let params1 = action2 ;
        params1.addressUniq2 = daiTokenAddress2 ;  
        sendSignedTx2(transactionObject,params1);        
      }else{
        setTimeout(() => { 
        sendTransaction() ;}, 1000 * (60*1) );
      }
    }catch(err){
        console.error(err)
    }
}

sendTransaction()

