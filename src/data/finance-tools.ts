export interface FinanceToolDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  inputs: { name: string; label: string; type: 'number' | 'text'; placeholder?: string; default?: number }[];
  action: (inputs: Record<string, any>) => { result: string; details?: string[] };
}

export const financeTools: FinanceToolDef[] = [
  {
    id: 'vat-calculator',
    name: 'VAT Calculator (คำนวณแวต)',
    desc: 'คำนวณภาษีมูลค่าเพิ่ม 7% (รวม VAT และ ถอด VAT)',
    icon: 'Calculator',
    inputs: [
      { name: 'amount', label: 'จำนวนเงิน', type: 'number', placeholder: 'เช่น 1000', default: 1000 },
      { name: 'vatRate', label: 'อัตรา VAT (%)', type: 'number', placeholder: '7', default: 7 }
    ],
    action: (inputs) => {
      const amount = inputs.amount || 0;
      const vat = inputs.vatRate || 7;
      
      const vatIncluded = amount + (amount * (vat / 100));
      const extractedVat = amount - (amount * (100 / (100 + vat)));
      const baseAmount = amount - extractedVat;

      return {
        result: `ยอดรวม VAT แล้ว: ฿${vatIncluded.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `กรณีถอด VAT จากยอด ${amount.toLocaleString('th-TH')}:`,
          `- ยอดก่อน VAT: ฿${baseAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `- ภาษีมูลค่าเพิ่ม (${vat}%): ฿${extractedVat.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    desc: 'คำนวณส่วนลดสินค้า ว่าลดแล้วเหลือเท่าไหร่ ประหยัดไปกี่บาท',
    icon: 'Percent',
    inputs: [
      { name: 'price', label: 'ราคาสินค้า (บาท)', type: 'number', placeholder: 'เช่น 500', default: 500 },
      { name: 'discount', label: 'ส่วนลด (%)', type: 'number', placeholder: 'เช่น 20', default: 20 }
    ],
    action: (inputs) => {
      const price = inputs.price || 0;
      const discount = inputs.discount || 0;
      
      const saved = price * (discount / 100);
      const finalPrice = price - saved;

      return {
        result: `ราคาหลังหักส่วนลด: ฿${finalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `ประหยัดเงินไปได้: ฿${saved.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'salary-tax',
    name: 'Salary Tax (หัก ณ ที่จ่าย)',
    desc: 'คำนวณหักภาษี ณ ที่จ่าย 3% สำหรับฟรีแลนซ์/บริการ',
    icon: 'Receipt',
    inputs: [
      { name: 'income', label: 'รายได้สุทธิ (บาท)', type: 'number', placeholder: 'เช่น 10000', default: 10000 },
      { name: 'taxRate', label: 'อัตราหัก ณ ที่จ่าย (%)', type: 'number', placeholder: '3', default: 3 }
    ],
    action: (inputs) => {
      const income = inputs.income || 0;
      const rate = inputs.taxRate || 3;
      
      const tax = income * (rate / 100);
      const net = income - tax;

      return {
        result: `รายได้หลังหักภาษี: ฿${net.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `ภาษีหัก ณ ที่จ่าย (${rate}%): ฿${tax.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'loan-emi',
    name: 'Loan & EMI Calculator',
    desc: 'คำนวณยอดผ่อนชำระสินเชื่อรายเดือน (ดอกเบี้ยลดต้นลดดอก)',
    icon: 'Building',
    inputs: [
      { name: 'principal', label: 'วงเงินกู้ (บาท)', type: 'number', default: 1000000 },
      { name: 'rate', label: 'ดอกเบี้ยต่อปี (%)', type: 'number', default: 5 },
      { name: 'years', label: 'ระยะเวลาผ่อน (ปี)', type: 'number', default: 30 }
    ],
    action: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = Number(inputs.rate) || 0;
      const y = Number(inputs.years) || 0;
      if (p === 0 || r === 0 || y === 0) return { result: 'กรุณาระบุข้อมูลให้ครบ' };
      const rMonthly = (r / 100) / 12;
      const n = y * 12;
      const emi = (p * rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
      const totalPayment = emi * n;
      return {
        result: `ผ่อนเดือนละ: ฿${emi.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `จ่ายดอกเบี้ยรวม: ฿${(totalPayment - p).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `ยอดชำระทั้งหมด: ฿${totalPayment.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest (ดอกเบี้ยทบต้น)',
    desc: 'คำนวณดอกเบี้ยทบต้น เพื่อการออมและการลงทุน',
    icon: 'PiggyBank',
    inputs: [
      { name: 'principal', label: 'เงินต้น (บาท)', type: 'number', default: 100000 },
      { name: 'rate', label: 'ผลตอบแทนต่อปี (%)', type: 'number', default: 5 },
      { name: 'years', label: 'ระยะเวลา (ปี)', type: 'number', default: 10 }
    ],
    action: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = Number(inputs.rate) || 0;
      const y = Number(inputs.years) || 0;
      if (p === 0 || r === 0 || y === 0) return { result: 'กรุณาระบุข้อมูลให้ครบ' };
      
      const a = p * Math.pow((1 + r / 100), y);
      
      return {
        result: `เงินรวมสุทธิ: ฿${a.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `เงินต้น: ฿${p.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `ดอกเบี้ยที่ได้รับ: ฿${(a - p).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator (คำนวณส่วนลด)',
    desc: 'คำนวณราคาสินค้าหลังหักส่วนลด และจำนวนเงินที่ประหยัดได้',
    icon: 'Tag',
    inputs: [
      { name: 'price', label: 'ราคาเต็ม (บาท)', type: 'number', default: 1000 },
      { name: 'discount', label: 'ส่วนลด (%)', type: 'number', default: 20 }
    ],
    action: (inputs) => {
      const p = Number(inputs.price) || 0;
      const d = Number(inputs.discount) || 0;
      
      const saved = p * (d / 100);
      const finalPrice = p - saved;
      
      return {
        result: `ราคาที่ต้องจ่าย: ฿${finalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `ส่วนลดที่ได้: ฿${saved.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'tip-calculator',
    name: 'Tip Calculator (แบ่งบิล & ทิป)',
    desc: 'คำนวณค่าอาหารรวมทิป และหารตามจำนวนคน (American Share)',
    icon: 'Users',
    inputs: [
      { name: 'bill', label: 'ค่าอาหารรวม (บาท)', type: 'number', default: 1500 },
      { name: 'tip', label: 'ให้ทิป (%)', type: 'number', default: 10 },
      { name: 'people', label: 'จำนวนคน (คน)', type: 'number', default: 4 }
    ],
    action: (inputs) => {
      const b = Number(inputs.bill) || 0;
      const t = Number(inputs.tip) || 0;
      const p = Number(inputs.people) || 1;
      
      const tipAmount = b * (t / 100);
      const total = b + tipAmount;
      const perPerson = total / p;
      
      return {
        result: `จ่ายคนละ: ฿${perPerson.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `ยอดรวมบิลสุทธิ: ฿${total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `ทิปพนักงาน: ฿${tipAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'salary-to-hourly',
    name: 'Salary to Hourly',
    desc: 'แปลงเงินเดือนเป็นรายชั่วโมง / รายวัน',
    icon: 'Clock',
    inputs: [
      { name: 'salary', label: 'เงินเดือน (บาท)', type: 'number', default: 30000 },
      { name: 'hours', label: 'ชั่วโมงทำงานต่อสัปดาห์', type: 'number', default: 40 }
    ],
    action: (inputs) => {
      const s = Number(inputs.salary) || 0;
      const h = Number(inputs.hours) || 0;
      
      const yearly = s * 12;
      const weekly = yearly / 52;
      const hourly = weekly / h;
      const daily = hourly * 8; // Assuming 8-hour workday
      
      return {
        result: `รายได้ชั่วโมงละ: ฿${hourly.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `รายได้ต่อวัน (8 ชม.): ฿${daily.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `รายได้ต่อสัปดาห์: ฿${weekly.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `รายได้ต่อปี: ฿${yearly.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  }
];
