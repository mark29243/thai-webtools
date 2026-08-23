const generateDates = () => {
  const dates = [];
  let d = new Date();
  for(let i=0; i<48; i++) {
    // just dummy test to see if getLotteryAward works
  }
}
fetch('https://www.glo.or.th/api/lottery/getLotteryAward', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({date: '2024-03-01'})
}).then(r=>r.text()).then(console.log)
