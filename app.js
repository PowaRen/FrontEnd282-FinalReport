//0-9數字中取出4位數的組合
//10*9*8*7 = 5040種組合
//最多讓電腦猜10次
var RandomGenerator = require("./RandomGenerator");
var $ = require('jquery');

var rand = new RandomGenerator();

$(function () {
    //結果歷程顯示區域
    var Result = $("#tx_Result");

    //所有可能的排列組合
    var NumCombins_origin = [];
    //所有可能的排列組合-計算用
    var NumCombins = [];
    //目前幾A幾B
    var intA = 0;
    var intB = 0;
    //猜過的組合及結果
    var NumGuessed = [];
    var NumGuessedA = [];
    var NumGuessedB = [];

    //批次猜題每次答對所花的次數
    var BatchGuessCount = [];

    //電腦每次猜的數字
    var ComGuessNumber = [];

    //產生所有可能的排列組合
    genAllNumberCombin();

    //初始化
    ReinitAndHistoryClean();

    //初始化(重置)
    function reinit() {
        //所有排列組合reset
        NumCombins = [];
        NumCombins = NumCombins_origin.slice();

        //目前幾A幾B
        intA = 0;
        intB = 0;

        //猜過的組合及結果
        NumGuessed = [];
        NumGuessedA = [];
        NumGuessedB = [];

        //依指定長度取得不重複隨機數字
        GuessNumber = GenNumber(4);
    }

    //所有參數重置
    function ReinitAndHistoryClean() {
        //所有參數重置
        reinit();

        //清除歷程紀錄
        Result.val('');
    }

    //產生所有可能組合
    function genAllNumberCombin() {
        for (var index1 = 0; index1 < 10; index1++) {
            for (var index2 = 0; index2 < 10; index2++) {
                for (var index3 = 0; index3 < 10; index3++) {
                    for (var index4 = 0; index4 < 10; index4++) {
                        //只留不重複數字組合
                        var numcombin = [];
                        numcombin = [index1, index2, index3, index4];
                        if (!isDubplicteNum(numcombin)) {
                            NumCombins_origin.push(numcombin);
                        }

                    }
                }
            }
        }
    }


    //檢查是否有重複數字組合
    function isDubplicteNum(numcombin) {
        for (var index = 0; index < numcombin.length; index++) {
            for (var index2 = index + 1; index2 < numcombin.length; index2++) {
                if (numcombin[index] == numcombin[index2]) {
                    return true;
                }
            }
        }
        return false;
    }

    //檢核數字A
    function CheckA(ComNumber, NumberAns) {
        var getA = 0;
        for (var index = 0; index < ComNumber.length; index++) {
            if (ComNumber[index] === NumberAns[index]) {
                getA++;
            }
        }
        return getA;
    }
    //檢核數字B
    function CheckB(ComNumber, NumberAns) {
        var getB = 0;
        for (var indexA = 0; indexA < ComNumber.length; indexA++) {
            for (var indexB = 0; indexB < NumberAns.length; indexB++) {
                if (indexA === indexB)
                    continue;
                if (ComNumber[indexA] === NumberAns[indexB]) {
                    getB++;
                    break;
                }
            }
        }
        return getB;
    }


    //分析指定的兩個數字組的AB數量是否符合
    function CheckABCount(newGuessNumber, oldGuessNumber, Acount, Bcount) {
        //var A = 0;
        //var B = 0;
        var ret = false;
        //A = CheckA(newGuessNumber, oldGuessNumber);
        //B = CheckB(newGuessNumber, oldGuessNumber);
        //console.log("A:" + A + ", B:" + B + ", Acount:" + Acount + ", Bcount:" + Bcount);
        if (Acount === CheckA(newGuessNumber, oldGuessNumber)) {
            ret = true;
        } else {
            return false;
        }
        if (Bcount === CheckB(newGuessNumber, oldGuessNumber)) {
            //if (Acount !== 0 && Bcount !== 0)
            ret = true;
            //else
            //    return false;
        } else {
            return false;
        }


        return ret;
    }


    //按鈕動作
    $("button").click(function () {
        var num = $(this).val();
        numKey(num);
    });

    //按鈕數字判斷
    function numKey(n) {

        //猜數字
        if (n === 'ComGuess') {
            ComGuessRule(true, 0);
        }

        //重新開始
        if (n === 'Reset') {
            if (confirm('您確定要重新開始遊戲嗎!?')) {
                $("#reset").removeClass("highlight");
                ReinitAndHistoryClean();
            }
        }

        //電腦連續猜題
        if (n === "BatchGuess") {
            var totalGuessCount = $("#totalGuessCount").val();

            Result.val("開始 " + totalGuessCount + " 題猜題模擬...\n");

            BatchGuessCount = [];
            // for (var index = 0; index < totalGuessCount; index++) {
            //     reinit();
            //     ComGuessRule(false, index);
            //     //console.log(BatchGuessCount[index]);
            // }

            setTimeout(function () {
                for (var index = 0; index < totalGuessCount; index++) {
                    reinit();
                    ComGuessRule(false, index);
                }
                //加總次數
                var sum = BatchGuessCount.reduce(function (a, b) {
                    return a + b;
                }, 0);
                Result.val(Result.val() + "------------------------------------\n");
                Result.val(Result.val() + "總猜題數為 " + totalGuessCount + " 題\n");
                Result.val(Result.val() + totalGuessCount + " 題猜完，總共花費猜題數為 " + sum + " 次\n");
                Result.val(Result.val() + "平均猜題數為 " + (sum / totalGuessCount) + " 次\n");
            });


        }

    }

    //猜題(是否猜單次, 批次題號由0開始)
    function ComGuessRule(onetime, batchno) {
        for (var guessCount = 0; guessCount < 10; guessCount++) {
            //電腦開始猜數字
            ComGuessNumber = NumCombins[rand.nextInt(0, NumCombins.length - 1)];

            //電腦已猜數字
            NumGuessed[guessCount] = ComGuessNumber;
            //可能組合是否超過1組
            if (NumCombins.length !== 1) {
                intA = CheckA(ComGuessNumber, GuessNumber);
                NumGuessedA[guessCount] = intA;
                intB = CheckB(ComGuessNumber, GuessNumber);
                NumGuessedB[guessCount] = intB;
                if (onetime) {
                    if (intA === 4) {

                        //console.log("電腦已猜到，數字為:" + ComGuessNumber.join(''));
                        $("#reset").addClass("highlight");
                        Result.val(Result.val() + "(" + (guessCount + 1) + ") 電腦已猜到，數字為:" + ComGuessNumber.join('') + "\n");

                        break;
                    } else {
                        //console.log("電腦猜的數字為:" + ComGuessNumber.join('') + ", " + intA.toString() + "A" + intB.toString() + "B");
                        Result.val(Result.val() + "(" + (guessCount + 1) + ") 電腦猜的數字為:" + ComGuessNumber.join('') + ", " + intA.toString() + "A" + intB.toString() + "B" + "\n");
                    }
                } else {
                    if (intA === 4) {
                        //console.log("電腦已猜到，數字為:" + ComGuessNumber.join(''));
                        //$("#reset").addClass("highlight");
                        Result.val(Result.val() + "(" + (batchno + 1) + ") 電腦已猜到，數字為:" + ComGuessNumber.join('') + ",共花費" + (guessCount + 1) + "次\n");
                        BatchGuessCount[batchno] = guessCount + 1;
                        break;
                    }
                }

            } else {
                if (onetime) {
                    $("#reset").addClass("highlight");
                    Result.val(Result.val() + "(" + (guessCount + 1) + ") 電腦已猜到，數字為:" + ComGuessNumber.join('') + "\n");
                    //console.log("電腦已猜到，數字為:" + ComGuessNumber.join(''));
                    break;
                } else {
                    Result.val(Result.val() + "(" + (batchno + 1) + ") 電腦已猜到，數字為:" + ComGuessNumber.join('') + ",共花費" + (guessCount + 1) + "次\n");
                    BatchGuessCount[batchno] = guessCount + 1;
                    break;
                }

            }

            //只留下可能的組合
            var RemainingCount = 0;
            var tmpNumCombins = [];
            tmpNumCombins = NumCombins.slice();

            for (var index = 0; index < tmpNumCombins.length; index++) {
                //判斷指定的兩個數字組的AB數量是否符合
                if (!CheckABCount(tmpNumCombins[index], NumGuessed[guessCount], NumGuessedA[guessCount], NumGuessedB[guessCount])) {
                    NumCombins.splice(index - RemainingCount, 1);
                    RemainingCount++;
                }
            }

        }
    }


    //依指定長度取得隨機一組數字
    function GenNumber(len) {

        var genDone = false;
        var r = [];
        while (!genDone) {
            var num = rand.nextInt(0, 9);
            if (r.indexOf(num) == -1) {
                r.push(num);
            }
            if (r.length == len)
                genDone = true;
        }
        return r;
    }

    //看答案
    $("#getAns").click(function () {
        alert(GuessNumber);
    });

});