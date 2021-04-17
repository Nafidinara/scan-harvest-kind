const axios = require('axios');
var lodash = require('lodash');

// replace the value below with the Telegram token you receive from @BotFather
// const token = "1624397507:AAFdlyiFSbaWqGNsLLM3Wo3M60p-IFFpuLQ";
// const token = "1501556810:AAFnBz0lJYBHCXArecgd3iGjzzVl2mcqcZU";
// const token = "1704071215:AAFaNUguK4fXdQT5GMB3zq-VOAoZi8RdFzQ";
const apikey = "N32IIV7CPUPHJH4ATA83D7IJZ7Y37VJ6II";
const contract = "0xe3ba88c38d2789fe58465020cc0fb60b70c10d32";
const address = "0xd57079d80b57cd18a0fad9c7b5af4d39c016d5f5"
const from = "0x0000000000000000000000000000000000000000";

var newArray = [];
var arrayTime = [];
var arrayGroup = [];
var hashArray = [];
var baseArray = [];


async function getTransaction(){
axios.get('https://api.bscscan.com/api', {
    params: {
      apikey:apikey,
      sort:'desc',
      offset:20,
      page:1,
      contractaddress:contract,
      address:address,
      module:'account',
      action:'tokentx'
    }
  })
  .then( function (response) {
    response.data.result.reverse().forEach((data,index) => {
        var d = {};
        d.hash = data.hash;
        d.time  = data.timeStamp;
        d.amount = data.value;
        d.from = data.from;
        d.to = data.to;

        hashArray.push(d.hash);
        newArray.push(d);

        // if(d.from === from && d.to === address){
            // if(lodash.includes(arrayTime,d.time) == false){
            //     console.log('masuk time');
            //     arrayTime.push(d.time);
            // }
        // }
      });
    //   console.log(lodash.uniq(newArray));
        arrayGroup = lodash.groupBy(newArray, 'hash');
        manageArray(Array.from(new Set(hashArray)),arrayGroup);
    })
  }

  function manageArray(arr,arrayGroup){
    let datas = JSON.parse(JSON.stringify(arrayGroup));
    // console.log(datas);
    // return;
    arr.forEach((data,index) => {
    //   console.log(datas[data]);
        setData(datas[data]);
    });
}

function setData(data){
  let dataSend = {};
//   console.log(data);
//   return;
try {
    if(data[0].from == from){
        // console.log('masuuk kondisi satu');
        if(data[1].to == address){
          dataSend.hash = data[0].hash;
          dataSend.time  = data[0].time;
          dataSend.amount = data[0].amount;
          dataSend.from = data[1].from;
          dataSend.to = data[0].to;
        }if(data[1].from == address){
          dataSend.hash = data[0].hash;
          dataSend.time  = data[0].time;
          dataSend.amount = data[0].amount;
          dataSend.from = data[1].to;
          dataSend.to = data[0].to;
        }
    }if(data[1].from == from){
    //   console.log('masuuk kondisi dua');
      if(data[0].to == address){
          dataSend.hash = data[1].hash;
          dataSend.time  = data[1].time;
          dataSend.amount = data[1].amount;
          dataSend.from = data[0].from;
          dataSend.to = data[1].to;
        }if(data[0].from == address){
          dataSend.hash = data[1].hash;
          dataSend.time  = data[1].time;
          dataSend.amount = data[1].amount;
          dataSend.from = data[0].to;
          dataSend.to = data[1].to;
        }
    }

    if(lodash.includes(arrayTime,dataSend.time) == false){
        baseArray.push(dataSend);
        arrayTime.push(dataSend.time);
      }
  
  //   if((data[0].time)*1 > tt){
  //     tt=data[0].time;
  //     baseArray.push(dataSend);
  //     console.log(baseArray);
  //     // console.log('tambah data');
  //   }
  
} catch (error) {
    console.log('data cuma satu : '+data[0].hash);
}
}

        
setInterval(() => {
     getTransaction();
     console.log(JSON.stringify(baseArray));
}, 3000);
// getTransaction();