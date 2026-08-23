export interface FinanceToolDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  inputs: { name: string; label: string; type: 'number' | 'text'; placeholder: string; default?: number }[];
  action: (inputs: Record<string, number>) => { result: string; details?: string[] };
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
    name: 'Loan Calculator (ผ่อนชำระ)',
    desc: 'คำนวณค่างวดผ่อนบ้าน ผ่อนรถ หรือสินเชื่อเงินกู้ (แบบลดต้นลดดอกคร่าวๆ)',
    icon: 'Landmark',
    inputs: [
      { name: 'principal', label: 'ยอดเงินกู้ (บาท)', type: 'number', placeholder: '100000', default: 1000000 },
      { name: 'rate', label: 'ดอกเบี้ยต่อปี (%)', type: 'number', placeholder: '5', default: 5 },
      { name: 'years', label: 'ระยะเวลาผ่อน (ปี)', type: 'number', placeholder: '10', default: 10 }
    ],
    action: (inputs) => {
      const p = inputs.principal || 0;
      const r = (inputs.rate || 0) / 100 / 12; // monthly interest rate
      const n = (inputs.years || 0) * 12; // number of months
      
      if (p === 0 || n === 0) return { result: 'ค่างวดต่อเดือน: ฿0' };
      
      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;

      return {
        result: `ค่างวดต่อเดือน (EMI): ฿${emi.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `รวมจ่ายดอกเบี้ยทั้งหมด: ฿${totalInterest.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `ยอดชำระรวม (ต้น+ดอก): ฿${totalPayment.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  }
];
