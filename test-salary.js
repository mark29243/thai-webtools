console.log('=== TESTING SALARY CALCULATOR MATH ===\n');

function calcSalary(salary, days, hours, ot15Hours, allowance, pvdRate) {
  const hourlyRate = (salary / days) / hours;
  const ot15Val = ot15Hours * (hourlyRate * 1.5);
  const gross = salary + ot15Val + allowance;

  const ssoVal = Math.min(salary * 0.05, 750);
  const pvdVal = (salary * pvdRate) / 100;

  // Annual tax estimate
  const annualGross = gross * 12;
  const annualExpense = Math.min(annualGross * 0.5, 100000);
  const annualPersonal = 60000;
  const annualSSO = ssoVal * 12;
  const annualPVD = pvdVal * 12;
  const taxable = Math.max(0, annualGross - annualExpense - annualPersonal - annualSSO - annualPVD);

  let annualTax = 0;
  if (taxable > 150000) {
    if (taxable <= 300000) {
      annualTax = (taxable - 150000) * 0.05;
    } else if (taxable <= 500000) {
      annualTax = (150000 * 0.05) + ((taxable - 300000) * 0.10);
    }
  }
  const taxVal = annualTax / 12;

  const totalDeductions = ssoVal + pvdVal + taxVal;
  const net = gross - totalDeductions;

  return { hourlyRate, ot15Val, gross, ssoVal, pvdVal, taxVal, totalDeductions, net };
}

const res = calcSalary(35000, 30, 8, 10, 2000, 5);
console.log('Salary 35k with 10hrs OT & 2k allowance:');
console.log(' - Hourly Rate:', res.hourlyRate.toFixed(2));
console.log(' - OT 1.5x (10 hrs):', res.ot15Val.toFixed(2));
console.log(' - Gross Income:', res.gross.toFixed(2));
console.log(' - Social Security:', res.ssoVal.toFixed(2));
console.log(' - Provident Fund (5%):', res.pvdVal.toFixed(2));
console.log(' - Monthly Tax:', res.taxVal.toFixed(2));
console.log(' - Total Deductions:', res.totalDeductions.toFixed(2));
console.log(' - Net Take-Home Pay:', res.net.toFixed(2));

if (res.gross > 39000 && res.ssoVal === 750 && res.pvdVal === 1750 && res.net > 35000) {
  console.log('\n✅ Salary Calculator calculation logic PASSED!');
} else {
  console.error('\n❌ Salary calculation FAILED!');
}

console.log('=== TEST COMPLETED ===');
