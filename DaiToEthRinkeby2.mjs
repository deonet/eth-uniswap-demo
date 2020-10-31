import { web3, info2 } from "./utils2.mjs";
import { 
    daiTokenAddress ,
    sleepSec ,
    privKey ,
    daiExchangeAddress, addressFrom, daiExchangeAbi } from "./constants2.mjs";
import EthTx from 'ethereumjs-tx'

const daiExchangeContract = new web3.eth.Contract(JSON.parse(daiExchangeAbi), daiExchangeAddress)

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

			web3.eth.getBalance(AddressFrom, function (error, res) {
				if (!error) {
					//console.log('ETH Owned: ' + web3.utils.fromWei( web3.utils.toBN(result).toString() , 'ether')); 
					let jual = web3.utils.fromWei( web3.utils.toBN(res).toString() , 'ether') ;
					//jual = jual / 1 ; 					
                    console.log('ETH Owned (ETH): ', (jual * 1) * (100/100) )

                    sendTransaction([
                        (jualT*1) 
                    ])

				}
			})
			
        }
        else {
            console.log(err); // Dump errors here
        }
    });
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

        info2([sleepSec]);
        setTimeout(() => {
            getTBal([])
            
        },1000*sleepSec)            

    });
}

function scaryClown() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('🤡');
    }, 1000 * 6 );
  });
}

const sendTransaction = async (array) => {

    //console.log(array)

    const TOKENS_SOLD0 = array[0]*(1/100) ;
    const TOKENS_SOLD = web3.utils.toHex(TOKENS_SOLD0 * 10 ** 18); // 0.4DAI
    const MIN_ETH = web3.utils.toHex(5000000000000); // 0.005ETH
    const DEADLINE = 1682393932;

    const tokenToEthEncodedABI = daiExchangeContract.methods
        .tokenToEthSwapInput(TOKENS_SOLD, MIN_ETH, DEADLINE)
        .encodeABI();

    console.log(daiTokenAddress , ' sell token')
    console.log(TOKENS_SOLD0 * 1 , ' sell value')
    let transactionNonce = -1 ;
    
    transactionNonce = await web3.eth.getTransactionCount(addressFrom)
    //const msg=await scaryClown();console.log('Message:',msg);
    
    const transactionObject = {
        nonce: web3.utils.toHex(transactionNonce),
        gasLimit: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(110000000000),
        to: daiExchangeAddress,
        from: addressFrom,
        data: tokenToEthEncodedABI
    };

    try {
        if (transactionNonce > -1) {
            sendSignedTx2(transactionObject)            
        }
    } catch (err) {
        console.error(err)
    }
}

//sendTransaction()
getTBal()