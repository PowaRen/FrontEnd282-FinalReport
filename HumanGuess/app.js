var RandomGenerator = require('./RandomGenerator');
var $ = require('jquery');

var rand = new RandomGenerator();


$(function () {
    //遊戲答案
    var RndNum = [];
    //目前輸入字數
    var index = 0;
    //已猜答案次數
    var guessNum = 0;
    //目前已輸入答案array
    var numlist = [];
    //是否完成遊戲flag
    var won = false;
    //結果歷程顯示區域
    var Result = $("#tx_Result");

    //init
    reinit();

    //重置
    function reinit() {
        //依指定長度取得不重複隨機數字
        RndNum = GenNumber(4);
        index = 0;
        guessNum = 0;
        numlist = [];
        won = false;
        //清除畫面上已輸入的數字
        ClearArray();
        //清除歷程紀錄
        Result.val('');
    }

    //清除array & textbox
    function ClearArray() {
        numlist = [];
        for (var num = 1; num <= 4; num++) {
            $("#inputNum_" + num).val('');
            index = 0;
        }
    }

    //按鈕動作
    $("button").click(function () {
        var num = $(this).text();
        if (!won || num === "Reset")
            numKey(num);

    });

    //按鈕數字判斷
    function numKey(n) {
        //輸入0~9且不重複
        if (n >= 0 && n <= 9 && numlist.indexOf(n) == -1) {
            index++;
            if (index <= 4 && index > 0) {
                $("#inputNum_" + index).val(n);
                numlist.push(n);
            } else {
                index = 4;
            }
        }

        //刪除
        if (n === '<') {
            $("#inputNum_" + index).val('');
            if (index > 0) {
                numlist.pop();
                index--;
            }
        }

        //猜數字
        if (n === 'Guess' && numlist.length == 4) {
            guessNum++;
            //Result.val(" " + guessNum + "    " + numlist.join('') + "   " + CheckNumber() + "\n" + Result.val());
            Result.val(" " + guessNum + "\t" + numlist.join('') + "\t" + CheckNumber() + "\n" + Result.val());
            //清除array & textbox
            ClearArray();

            if (won) {
                $("#reset").addClass("highlight");
                alert("恭喜您答對了!!");
            }


        }

        //重新開始
        if (n === 'Reset') {
            if (confirm('您確定要重新開始遊戲嗎!?')) {
                $("#reset").removeClass("highlight");
                reinit();
            }
        }

    }

    //檢核數字
    function CheckNumber() {
        var Acount = 0;
        var Bcount = 0;
        var ret = "";
        for (var indexA = 0; indexA < RndNum.length; indexA++) {
            for (var indexB = 0; indexB < numlist.length; indexB++) {
                if (indexA == indexB && RndNum[indexA] === numlist[indexB]) {
                    Acount++;
                } else if (indexA != indexB && RndNum[indexA] === numlist[indexB]) {
                    Bcount++;
                }
            }
        }
        if (Acount == 4) {
            won = true;
        } else {
            won = false;
        }

        ret = Acount + "A" + Bcount + "B";
        return ret;
    }



    //取得隨機數字
    function GenNumber(len) {

        var genDone = false;
        var r = [];
        while (!genDone) {
            var num = rand.nextInt(0, 9).toString();
            if (r.indexOf(num) == -1) {
                r.push(num);
            }
            if (r.length == len)
                genDone = true;
        }
        //$(".headrow").text(r+":"+won);
        return r;
    }

    //看答案
    $("#getAns").click(function () {
        alert(RndNum);
    });


});