angular.module("SWallet.filters").filter("currencyConvertor", function () {
    String.prototype.splice = function (idx, rem, s) {
        return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
    };
    return function (amount) {
        if (!amount) return '';
        amount = amount.toString();
        switch (amount.length) {
  case 4:
      return parseInt(amount.splice(1, 0, ','));
      break;
  case 5:
      return parseInt(amount.splice(2, 0, ','));
      break;
  case 6:
      return parseInt(amount.splice(3, 0, ','));
      break;
  /*case 7:
    return amount[0] + amount[1] + "Laks";
    break;
case 8:
    return amount[1] + "Cr";
    break;*/

  }

        return parseInt(amount);

    }
})