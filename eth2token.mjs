import UniswapV2Abi from "./IUniswapV2Router02.mjs";

import FileSync from 'lowdb/adapters/FileSync.js';
import lowdb from 'lowdb'
let db =
'C:/Users/gold1tb/Documents/GitHub/a02/uniswap-skim/public/db2.json';
db = lowdb(new FileSync(db));

let db2 =
'dbBuy.json';
db2 = lowdb(new FileSync(db2));

import { 
    sleepSec ,
    privKey ,
    daiExchangeAddress, addressFrom, daiExchangeAbi } from "./constants2.mjs";

Date.prototype.addMinutez = function(m) {
this.setTime(this.getTime() + (m*60*1000));
return this;
}

function who() {
    console.log('');
    console.log('sleep (secs)',sleepSec);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Alligator.io');
      }, 200 );
    });
  }
  
async function what(array) {
      console.log(array)
      let loop = 15 

      for (let index = 0; index < loop; index++) {
          const element = array.tokens1 - loop + index ;
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
            obj2.inputDt = Date.now() ;
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

          console.log('a', action2 )

      }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('lurks' );
      }, 300);
    });
  }
  
function contract2(params){

  const toContract = 
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
  const UniswapV2ContractAddress = toContract; 
  let daiExchangeAddress2 = toContract;

  const uniswapV2Contract = 
  new web3.eth.Contract(UniswapV2Abi, UniswapV2ContractAddress);

  const path1 ="0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const WETHContractAddress= path1

  const path2 = '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85'; // MKR
  const TokenContractAddress2 = path2 

  const tokenToEthEncodedABI2 = uniswapV2Contract.methods
    .swapExactETHForTokens(
        MinimumTokens, 
        [WETHContractAddress , TokenContractAddress2 ], addressFrom, 
        Math.floor((Date.now() + 100000) / 1000)
    )
    .encodeABI({
        from: addressFrom,
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('in the shadows');
      }, 1000 * (sleepSec/1) );
    });
}

function where() {
  var d1 = new Date().addMinutez((60*7)+ (sleepSec/60) );
  console.log(d1 , 'sleep')

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('in the shadows');
    }, 1000 * (sleepSec/1) );
  });
}

  async function msg() {
    const a = await who();

    db2.read()
    let buyCount = await 
    db2.get('posts')
    .size()
    .value();
    if (!buyCount) {
        console.log('0')
        db2.defaults({ posts: [], })
        .write()
    }

    db.read()

    let tokens1 = await 
    db.get('tokens')
    .size()
    .value();
    //console.log('tokens size =',tokens1)
    let obj={}
    obj.tokens1 = tokens1
    obj.buyCount = buyCount

    const b = await what(obj);
    const contract1 = await contract2(b);
    
    const c = await where();
  
    console.log(`${ a } ${ b } ${ c }`);
    msg()
  }
  
  msg(); // 🤡 lurks in the shadows <-- after 1 second