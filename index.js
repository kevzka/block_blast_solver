
class Template{
    constructor(){
        [this.width, this.heigth] = [8, 8];
        this.obj = Array.from({length: this.width * this.heigth}, (v, k) => 0)
    }
}

class Tile{
    constructor(width, obj){
        this.width = width;
        this.obj = Array.from(obj);
        this.heigth = this.obj.length/this.width;
    }
}

function makeMap(){
    map = `
[1][0][0][0][0][0][0][1]
[0][1][0][0][0][0][0][1]
[0][0][1][0][0][0][0][1]
[0][0][0][1][0][0][0][1]
[0][0][0][0][1][0][0][1]
[0][0][0][0][0][1][0][1]
[0][0][0][0][0][0][1][1]
[1][1][1][1][1][1][1][1]`
// map = Array.from({length: width * heigth}, (v, k) => 0)
map = map.replace(/[[]/g, '');
map = map.replace(/]/g, '');
map = map.replace(/\n/g, '');
// map = '1111111000000111111111100000000011011111111111011111010100000000'
// map = '1111111000000111111111100000000011011111000001010000010100000000'
map = Array.from(map);
return {obj: map, width: 8, heigth: 8};
}


function printMap(mapRaw){
    let width = mapRaw.width;
    let map = mapRaw.map || mapRaw.obj;
    let coorY = 0;
    let [on, off] = ['■', ' ']
    let teks = '[+]'
    for(let i = 0; i < width; i++){
        teks += `[${i}]`
    }
    teks += `\n[${coorY}]`
    for(let i in map){
        let symbol = (map[i] != 1) ? off : on;
        symbol = (map[i] > 1)? map[i] : symbol;
        // symbol = map[i];
        if((i)%width==0 && i != 0){
            coorY++
            teks += `\n[${coorY}]`;
        }
        teks += `[${symbol}]`
    }
    console.log(teks)
}

function randomMap(map){
    let tmp = Array.from({length: map.length}, (v,k) => k);
    let newMap = JSON.parse(JSON.stringify(map));
    for(let i = 0; i < 30; i++){
        let random = Math.round(Math.random() * tmp.length);
        newMap[tmp[random]] = 1;
        tmp.splice(random,1);
    }
    
    return newMap
}

function getVector(width, map){
    let cycle = 0;
    let tmp = ''
    let vector = {}
    let newWidth = width+2;
    let newMap = function (){
        let tmp2 = '';
        for(let i in map){
            if((i)%width==0){
                tmp2 += '0';
            }
            tmp2 += map[i];
            if((i)%width==width-1){
                tmp2 += '0';
            }
        }
        for(let i = 0; i < newWidth; i++){
            tmp += `0`;
        }
        tmp2 = tmp + tmp2 + tmp;
        return tmp2;
    }
    newMap = newMap();
    
    // printMap(newWidth, newMap)
    for(let i in newMap){
        if(!(i < newWidth)){
            if(i%newWidth != 0){
                if(i%newWidth != newWidth-1){
                    if(!(i >= (newWidth *((newMap.length/newWidth)-1)))){
                        let topRight    =   newMap[(Number(i)-Number(newWidth))+1]
                        let bottomRight =   newMap[(Number(i)+Number(newWidth))+1]
                        let bottomLeft  =   newMap[(Number(i)+Number(newWidth))-1]
                        let topLeft     =   newMap[(Number(i)-Number(newWidth))-1]
                        let top         =   newMap[Number(i)-Number(newWidth)]  
                        let right       =   newMap[Number(i)+1]      
                        let bottom      =   newMap[Number(i)+Number(newWidth)]  
                        let left        =   newMap[Number(i)-1]      
                        vector[cycle] = [topLeft, top, topRight, left, newMap[i], right, bottomLeft, bottom, bottomRight]
                        // printMap(3, [topLeft, top, topRight, left, newMap[i], right, bottomLeft, bottom, bottomRight]);
                        cycle++
                    }
                }
            }
        }
    }
    return vector;
    // console.log(vector)
    // console.log(cycle)
    
    // i = 6;
    // vector[i] = [map[i], top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft];
    // console.log((Number(i)+Number(width))-1)
    // topRightN =      (Number(i)-Number(newWidth))+1
    // bottomRightN =   (Number(i)+Number(newWidth))+1
    // bottomLeftN =    (Number(i)+Number(newWidth))-1
    // topLeftN =       (Number(i)-Number(newWidth))-1
    // topN =           Number(i)-Number(newWidth)  
    // rightN =         Number(i)+1      
    // bottomN =        Number(i)+Number(newWidth)  
    // leftN =          Number(i)-1      
    // console.log([topLeftN, topN, topRightN, leftN, newMap[i], rightN, bottomLeftN, bottomN, bottomRightN])
    // console.log(newMap[10])
    // console.log(vector);
    // console.log(newMap)
    // printMap(5, Array.from(newMap))
}

function bot(block, mapRaw){
    // detek <--------------------
    let map = mapRaw.obj;
    let [mapWidth, mapHeigth] = [mapRaw.width, map.length/mapRaw.width];
    let [blockWidth, blockHeigth] = [block.width, block.obj.length/block.width];
    let end = false
    let y = 0;
    
    function check(){
        let iWidth = Number(mapWidth)-Number(blockWidth)+1;
        let iHeigth = Number(mapHeigth)-Number(blockHeigth)+1;
        let layer = {};
        let nextStep = false;
        
        //mencek apakah ada ruang yang cukup
        for(let l = 0; l < iHeigth; l++){
            let teks = '';
            // console.log('\n layer \n')
            for(let i = 0; i < iWidth; i++){
                for(let j = 0; j < blockHeigth; j++){
                    layer[j] = [];
                    for(let k = 0; k < blockWidth; k++){
                        layer[j][k] = Number(map[i+k+(mapWidth * j)+(mapWidth * l)]);
                    }
                    if(j != 0){
                        layer[0] = layer[0].concat(layer[j]);
                        delete layer[j]
                    }
                }
                let tmpBlock = {
                    map: layer[0],
                    width: blockWidth
                }
                
                //check jika tidak ada ruang yang cukup
                tmpBlock.map.map(function (ch, ci) {if(ch + Number(block.obj[ci]) > 1){nextStep = true}})
                if(nextStep == false){
                    mapRaw = putTile({x: i, y: l, map: mapRaw}, block)
                    iWidth = 0
                    iHeigth = 0
                }
                nextStep = false;
            }
        }
    }
    check();
    return mapRaw;
    // printMap(mapRaw)
    
    // console.log('\n')
    // printMap(mapRaw)
}

function putTile(coor, block){
    let [map, coorX, coorY] = [coor.map, coor.x, coor.y];
    let [mapWidth, mapHeigth] = [map.width, map.obj.length/map.width]
    let [blockWidth, blockHeigth] = [block.width, block.obj.length/block.width];
    let arr = Array.from(block.obj);
    let num = 0;
    
    //format index to mapLengthIndex
    for(let j=0; j<(block.obj.length/blockWidth)-1; j++){
        for(let i=0; i<mapWidth-blockWidth; i++){
            arr.splice(blockWidth+((mapWidth-blockWidth+blockWidth)*j),0,0)
        }
    }
    
    arr = arr.map(i => Number(i))
    coor.map.obj = coor.map.obj.map(i => Number(i))
    for(let i = 0; i < arr.length; i++){
        coor.map.obj[i+coorX+(coorY*mapWidth)] += arr[i];
    }
    
    // printMap(map);
    // printMap(block);
    return map;
}

function botplay(block1, block2, block3, mapRaw){
    
}

function delRowCol(mapRaw){
    let map = mapRaw.obj;
    let [mapWidth, mapHeigth] = [mapRaw.width, mapRaw.heigth]
    printMap(mapRaw)
    let checkWidth = 0;
    let checkHeigth = 0;
    let del = [];
    for(let i = 0; i < mapHeigth; i++){
        for(let j = 0; j < mapWidth; j++){
            checkWidth += Number(map[j+(mapWidth*i)]);
        }
        if(checkWidth == mapWidth){
            for(let j = 0; j < mapWidth; j++){
                del.push(j+(mapWidth*i))
            }
        }
        checkWidth = 0;
    }
    
    for(let i = 0; i < mapWidth; i++){
        for(let j = 0; j < mapHeigth; j++){
            checkHeigth += Number(map[i+(mapWidth*j)]);
        }
        if(checkHeigth == mapHeigth){
            for(let j = 0; j < mapHeigth; j++){
                del.push(i+(mapWidth*j))
            }
        }
        checkHeigth = 0;
    }
    del.map(i => map[i] = 0)
    printMap(mapRaw)
    // console.log(del)
    // checkWidth = 0;
}


function test(){
    let map = new Template();
    
    let testmappp = makeMap();
    let block1 = new Tile(3, '111111111')
    let block2 = new Tile(2, '111010')
    let block3 = new Tile(4, '1111')
    
    delRowCol(makeMap());
    // console.log(block3)

    // printMap(testmappp)
    // console.log('\n')
    // testmappp = bot(block1, testmappp)
    // printMap(testmappp)
    // console.log('\n')
    // testmappp = bot(block2, testmappp)
    // printMap(testmappp)
    // console.log('\n')
    // testmappp = bot(block3, testmappp)
    // printMap(testmappp)

    // putTile({x:0, y:0, map: map}, block1);
    // printMap(width, makeMap());
    // putTile(block2, makeMap());
    // printMap(width, map)
    // getVector(test.width, test.obj);
    
    
    // 6289525325777
}
test();