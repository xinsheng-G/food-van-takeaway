/** Rounds the value v to preserve the e bits */
function my_round(v,e){

    var t=1;

    for(;e>0;t*=10,e--);

    for(;e<0;t/=10,e++);

    return Math.round(v*t)/t;
}

module.exports = {my_round}
