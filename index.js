const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const board = [['ABCE'],['SFCS'],['ADEE']];
searchWord('./file', board);

function searchWord (filePath, arr) {

    // read file line by line
    const instream = fs.createReadStream(filePath);
    const outstream = new stream;
    const rl = readline.createInterface(instream, outstream);
    rl.on('line', (line) => {
        startCheck(arr, line);
    });

    rl.on('close', () => {});
}

function startCheck (arr, word) {
    const firstChar = word[0];
    let flag = false;

    // find the first word location x,y
    arr.map((a, i) => {
        const ar = a[0].split(firstChar);
        if (ar.length > 1) {
            let index = -1;
            ar.map((str, j) => {
                if (j < ar.length-1) {
                    index += str.length + 1;
                    checkPair(arr, i, index, word, 1, `$${i}_${index}`, (result)=>{
                        if (result) {
                            flag = true;
                        }
                    });
                }
            });
        } 
    });

    // print search result
    if (flag) {
        console.log(true);
    } else {
        console.log(false);
    }
}

function checkPair (arr, x, y, str, ind, markStr, cb){

    // all str had checked ok
    if (str.length === ind) {
        return cb(true);
    }
    const pairChar = str[ind];
    let checkFlag = false;

    // get near 4 items x,y
    const pairItemsO = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
    const pairItems = pairItemsO.filter((item) => (

        // x,y cant over array range
        item[0]>=0 && item[1]>=0 && item[0] < arr.length && item[1] < arr[item[0]][0].length
    ));
    
    // check near 4 items
    pairItems.map((item) => {
        markInt = '$' + item[0] + '_' + item[1];
        if (arr[item[0]][0][item[1]] === pairChar && markStr.indexOf(markInt) < 0) {
            let mark = markStr || '';
            mark += markInt;
            checkPair(arr, item[0], item[1], str, ind+1, mark ,cb);
            checkFlag = true;
        }
    });
    if (!checkFlag) {
        return cb(false);
    }
}
