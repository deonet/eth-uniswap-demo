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
        resolve('joker');
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

          console.log( element , element2.addressUniq , compare1.length ) ;
            
          if (compare1.length===0) {
            //console.log( compare1.length ) ;
            obj2.addressUniq = element2.addressUniq ;
            obj2.inputDt = Date.now() ;
            obj2.title = element2.title ;
            db2.get('posts')
                .push( obj2 )
                .write() ;
                break;           
          }else{
            //console.log( compare1.length ) ;
          }

      }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('lurks');
      }, 300);
    });
  }
  
function where() {
    var d1 = new Date().addMinutez((60*7)+ (sleepSec/60) );
    console.log(d1 , 'sleep')

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('in the shadows');
      }, 1000 * (sleepSec/10) );
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
    const c = await where();
  
    console.log(`${ a } ${ b } ${ c }`);
    msg()
  }
  
  msg(); // 🤡 lurks in the shadows <-- after 1 second