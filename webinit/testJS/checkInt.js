var a = 9;
var b = 101;
var output = (((a/10) % 1) === 0)
						? parseInt(a/10)
						: parseInt(a/10) + 1;
var output1 = (((b/10) % 1) === 0)
						? parseInt(b/10)
						: parseInt(b/10) + 1;
console.log(a,output);
console.log(b,output1);
