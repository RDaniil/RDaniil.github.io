var MAX_MFLOAT_MANT = 9999999999;//Мантисса должна иметь столько цифр, сколько макс. длина
var MAX_MFLOAT_EXP = 4;	
var MAX_MFLOAT_LENGTH = 10;		


var mFloat = function(sign, mant, exp, val){
	this.sign = sign;
	this.mant = mant;
	this.exp  = exp;
	this.val = val;
}

var pINF  = new mFloat(0, MAX_MFLOAT_MANT, 0, "pINF");
var mINF  = new mFloat(1, -MAX_MFLOAT_MANT, 0, "mINF");
var pZERO = new mFloat(0, 0, 0, "pZERO");
var mZERO = new mFloat(1, 0, 0, "mZERO");
var fNaN  = new mFloat(1, MAX_MFLOAT_MANT, 0, "fNaN");
var a = new mFloat(1, 1, 1, "");
var b = new mFloat(1, 1, 1, "");


mFloat.prototype.checkNumber = function()
{
	if(this.mant > MAX_MFLOAT_MANT){
		alert("Its +INF");
		this.assign(pINF);
		alert("Tst "+ this.mant);
		return this;
	}
	if(this.mant < -MAX_MFLOAT_MANT){
		this.assign(mINF);
		return;
	}
	if(this.mant == 0 && this.exp == 0){
		if(this.sign == 1)
			this.assign(mZERO);
		else
			this.assign(pZERO);
		return;
	}
}

mFloat.prototype.assign = function(number)
{
	this.sign = number.sign;
	this.mant = number.mant;
	this.exp = number.exp;
	this.val = number.val;
}

mFloat.prototype.checkEqual = function(number)
{
	return (this.sign == number.sign && this.mant == number.mant && this.exp == number.exp );
}

mFloat.prototype.isSpecial = function(number)
{
	return this.checkEqual(pINF) || this.checkEqual(mINF) || this.checkEqual(pZERO) || this.checkEqual(mZERO) || this.checkEqual(fNaN);
}

mFloat.prototype.assignIfSpecial = function(number)
{
	if(!this.isSpecial())
		return;
	if(this.checkEqual(pINF)){
		this.assign(pINF);
		return;
	}
	if(this.checkEqual(mINF)){
		this.assign(mINF);
		return;
	}
	if(this.checkEqual(pZERO)){
		this.assign(pZERO);
		return;
	}
	if(this.checkEqual(mZERO)){
		this.assign(mZERO);
		return;
	}
	if(this.checkEqual(fNaN)){
		this.assign(fNaN);
		return;
	}
}

mFloat.prototype.convertNum =  function(arrNum)
{
	//var regExMant = /-*[0-9]{6}/;
	this.sign = arrNum[0];
	this.mant = Number(arrNum[1]);
	this.exp  = Number(arrNum[2]);
}


mFloat.prototype.updateValue =  function()
{
	if(this.isSpecial()){
		this.checkNumber();
		alert("Exp: " + this.exp + " mant: " + this.mant + " value: " + this.val);
		return;
	}
	var expVal = Math.pow(10, Number(this.exp));

	//Выделение значащей точной части мантиссы
	var strMant = this.mant.toString();
	this.mant = Number(strMant.substring(0,MAX_MFLOAT_LENGTH+1));

	//Полное значение числа, обрезается до занчащего 
	var fullNum = this.mant * expVal;
	//Вернет округленное значение числа длины MAX_MFLOAT_LENGTH+1
	var strNum = fullNum.toPrecision(MAX_MFLOAT_LENGTH+1);
	alert("Test str = "+ this.mant);
	this.val = strNum.substring(0,MAX_MFLOAT_LENGTH+1);
	
	alert("In UPD value Exp: " + this.exp + " mant: " + this.mant + " value: " + this.val);
}

//Приведение порядка объекта к порядку exp
mFloat.prototype.ToExp = function(exp)
{
	if(this.exp >= exp){
		var difference =  this.exp - exp;
		for (var i = 0; i < difference; i++) {
			this.mant *= 10;
			this.exp--;
		}
		// var formatMantStr = this.mant.toString();
		// this.mant = formatMantStr.substring(0, MAX_MFLOAT_LENGTH+1);
		return;
	}

	if(this.exp < exp){
		var difference =  exp - this.exp;
		for (var i = 0; i < difference; i++) {
			this.mant /= 10;
			this.exp++;
		}
		// var formatMantStr = this.mant.toString();
		// this.mant = formatMantStr.substring(0, MAX_MFLOAT_LENGTH+1);
		return;
	}
}

// var t = new mFloat(0, 42342343423, 2, "");
// t.updateValue();
// t.checkNumber();
// alert(t.mant);
// t.ToExp(0);
// t.updateValue();

function confirmInput()
{
	var sign1, sign2;
	var mantArea1 = document.getElementById('mantArea1');
	var expArea1 = document.getElementById('expArea1');
	var mantArea2 = document.getElementById('mantArea2');
	var expArea2 = document.getElementById('expArea2');
	if(mantArea1.value.charAt(1) == "-")
		sign1 = 1;
	else 
		sign1 = 0;
	if(mantArea2.value.charAt(1) == "-")
		sign2 = 1;
	else 
		sign2 = 0;
	var aTmp = new mFloat(sign1, mantArea1.value, expArea1.value, ""); 
	a.assign(aTmp);
	a.updateValue();
	var bTmp = new mFloat(sign2, mantArea2.value, expArea2.value, ""); 
	b.assign(bTmp);
	b.updateValue();
}

function add()
{
	a.ToExp(b.exp);

	if(a == fNaN || b == fNaN){
		var result = fNaN;
		return result;
	}

	var sum = Number(a.val) + Number(b.val);
	var ten = Math.pow(10, a.exp);
	sum /= ten;
	alert("TEST TEST : " + a.mant + " " + b.mant + " " + sum);
	var sign;
	if(sum > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, sum, a.exp, "");
	result.updateValue();
	alert("Rsult of operation: " + a.val  + " + " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	return;
	
}

function sub()
{
	a.ToExp(b.exp);

	if(a == fNaN || b == fNaN){
		var result = fNaN;
		return;
	}

	var res = Number(a.val) - Number(b.val);
	var ten = Math.pow(10, a.exp);
	res /= ten;

	alert("TEST TEST : " + res);
	var sign;
	if(res > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, res, a.exp, "");
	result.updateValue();
	alert("Rsult of operation: " + a.val  + " - " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	return;
}
function mul()
{
	if(a == fNaN || b == fNaN){
		var result = fNaN;
		return;
	}

	var prodMant = Number(a.mant) * Number(b.mant);
	var prodExp = Number(a.exp) + Number(b.exp);

	var sign;
	if(prodMant > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, prodMant, prodExp, "");
	result.updateValue();
	alert("Rsult of operation: " + a.val + " * " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	return;
	
}
function div()
{
	if(a == fNaN || b == fNaN){
		var result = fNaN;
		return;
	}

	var quotMant = Number(a.mant) / Number(b.mant);
	var quotExp = Number(a.exp) - Number(b.exp);

	var sign;
	if(quotMant > 0)
		sign = 0;
	else 
		sign = 1;

	var result = new mFloat(sign, quotMant, quotExp, "");
	result.updateValue();
	alert("Rsult of operation: " + a.val + " / " + b.val + " Exp: " + result.exp + " mant: " + result.mant + " value: " + result.val + " sign: " + result.sign);

	return;
	
}


// insertpINF1();
// insertmINF1();
// insertpZero1();
// insertmZero1();
// insertNaN1();
// insertpINF2();
// insertmINF2();
// insertpZero2();
// insertmZero2();
// insertNaN2();