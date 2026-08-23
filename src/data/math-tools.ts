export interface MathToolDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  inputs: { name: string; label: string; type: 'number' | 'date'; placeholder?: string; default?: string | number }[];
  action: (inputs: Record<string, any>) => { result: string; details?: string[] };
}

export const mathTools: MathToolDef[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator (คำนวณอายุ)',
    desc: 'คำนวณอายุแบบละเอียด แยกเป็น ปี เดือน และ วัน',
    icon: 'CalendarDays',
    inputs: [
      { name: 'dob', label: 'วันเกิด', type: 'date' }
    ],
    action: (inputs) => {
      if (!inputs.dob) return { result: 'กรุณาระบุวันเกิด' };
      const dob = new Date(inputs.dob);
      const today = new Date();
      if (dob > today) return { result: 'วันเกิดไม่สามารถอยู่ในอนาคตได้' };

      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();
      let days = today.getDate() - dob.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      return {
        result: `อายุของคุณ: ${years} ปี ${months} เดือน ${days} วัน`,
        details: [
          `เกิดวันที่: ${dob.toLocaleDateString('th-TH', { dateStyle: 'long' })}`
        ]
      };
    }
  },
  {
    id: 'date-difference',
    name: 'Date Difference (หาระยะห่างวัน)',
    desc: 'คำนวณระยะห่างระหว่าง 2 วันที่ ว่าห่างกันกี่วัน',
    icon: 'CalendarRange',
    inputs: [
      { name: 'date1', label: 'วันที่เริ่มต้น', type: 'date' },
      { name: 'date2', label: 'วันที่สิ้นสุด', type: 'date' }
    ],
    action: (inputs) => {
      if (!inputs.date1 || !inputs.date2) return { result: 'กรุณาระบุวันที่ให้ครบ' };
      const d1 = new Date(inputs.date1);
      const d2 = new Date(inputs.date2);
      
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        result: `ห่างกันทั้งหมด: ${diffDays.toLocaleString('th-TH')} วัน`,
        details: [
          `หรือประมาณ ${(diffDays / 7).toFixed(1)} สัปดาห์`,
          `หรือประมาณ ${(diffDays / 30.44).toFixed(1)} เดือน`
        ]
      };
    }
  },
  {
    id: 'margin-markup',
    name: 'Margin & Markup Calculator',
    desc: 'คำนวณกำไรขั้นต้น (Gross Profit), Margin และ Markup จากต้นทุนและราคาขาย',
    icon: 'LineChart',
    inputs: [
      { name: 'cost', label: 'ต้นทุน (Cost)', type: 'number', default: 100 },
      { name: 'revenue', label: 'ราคาขาย (Revenue)', type: 'number', default: 150 }
    ],
    action: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const rev = Number(inputs.revenue) || 0;
      
      if (cost === 0 || rev === 0) return { result: 'กรุณาระบุข้อมูลให้ครบ' };

      const profit = rev - cost;
      const margin = (profit / rev) * 100;
      const markup = (profit / cost) * 100;

      return {
        result: `กำไรขั้นต้น: ฿${profit.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        details: [
          `Gross Margin (อัตรากำไร): ${margin.toFixed(2)}%`,
          `Markup (บวกเพิ่มจากทุน): ${markup.toFixed(2)}%`
        ]
      };
    }
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    desc: 'คำนวณผลตอบแทนจากการลงทุน (Return on Investment)',
    icon: 'TrendingUp',
    inputs: [
      { name: 'invested', label: 'เงินลงทุน (Invested Amount)', type: 'number', default: 10000 },
      { name: 'returned', label: 'เงินที่ได้กลับมา (Returned Amount)', type: 'number', default: 12000 }
    ],
    action: (inputs) => {
      const inv = Number(inputs.invested) || 0;
      const ret = Number(inputs.returned) || 0;
      
      if (inv === 0) return { result: 'เงินลงทุนต้องมากกว่า 0' };

      const profit = ret - inv;
      const roi = (profit / inv) * 100;

      return {
        result: `ROI (ผลตอบแทน): ${roi.toFixed(2)}%`,
        details: [
          `กำไร/ขาดทุน สุทธิ: ฿${profit.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ]
      };
    }
  },
  {
    id: 'gcd-lcm',
    name: 'GCD & LCM (ห.ร.ม. & ค.ร.น.)',
    desc: 'คำนวณหาร่วมมาก (ห.ร.ม.) และคูณร่วมน้อย (ค.ร.น.)',
    icon: 'Divide',
    inputs: [
      { name: 'num1', label: 'ตัวเลขที่ 1', type: 'number', default: 12 },
      { name: 'num2', label: 'ตัวเลขที่ 2', type: 'number', default: 18 }
    ],
    action: (inputs) => {
      let a = Math.abs(Number(inputs.num1) || 0);
      let b = Math.abs(Number(inputs.num2) || 0);
      if (a === 0 || b === 0) return { result: 'กรุณาระบุตัวเลขที่ไม่ใช่ 0' };

      const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
      const resGcd = gcd(a, b);
      const resLcm = (a * b) / resGcd;

      return {
        result: `ห.ร.ม. คือ ${resGcd}`,
        details: [
          `ค.ร.น. คือ ${resLcm}`
        ]
      };
    }
  },
  {
    id: 'prime-checker',
    name: 'Prime Number Checker',
    desc: 'ตรวจสอบว่าตัวเลขที่ระบุเป็นจำนวนเฉพาะ (Prime Number) หรือไม่',
    icon: 'CheckCircle2',
    inputs: [
      { name: 'num', label: 'ตัวเลข', type: 'number', default: 29 }
    ],
    action: (inputs) => {
      const n = Math.abs(Number(inputs.num) || 0);
      if (n < 2) return { result: `${n} ไม่ใช่จำนวนเฉพาะ` };
      
      let isPrime = true;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          isPrime = false;
          break;
        }
      }

      return {
        result: isPrime ? `${n} เป็นจำนวนเฉพาะ (Prime Number)` : `${n} ไม่ใช่จำนวนเฉพาะ`,
        details: isPrime ? [] : ['เพราะสามารถหารด้วยตัวเลขอื่นลงตัวได้']
      };
    }
  },
  {
    id: 'factorial',
    name: 'Factorial Calculator (n!)',
    desc: 'คำนวณแฟกทอเรียลของตัวเลข',
    icon: 'Activity',
    inputs: [
      { name: 'num', label: 'ตัวเลข (n)', type: 'number', default: 5 }
    ],
    action: (inputs) => {
      const n = Math.floor(Math.abs(Number(inputs.num) || 0));
      if (n > 170) return { result: 'ตัวเลขมากเกินไป (เกินขีดจำกัด)' };
      
      let fact = 1;
      for (let i = 2; i <= n; i++) {
        fact *= i;
      }

      return {
        result: `${n}! = ${fact.toLocaleString()}`
      };
    }
  },
  {
    id: 'exponent',
    name: 'Exponent Calculator (x^y)',
    desc: 'คำนวณเลขยกกำลัง (Base ^ Exponent)',
    icon: 'Superscript',
    inputs: [
      { name: 'base', label: 'ฐาน (Base)', type: 'number', default: 2 },
      { name: 'power', label: 'เลขชี้กำลัง (Exponent)', type: 'number', default: 8 }
    ],
    action: (inputs) => {
      const b = Number(inputs.base) || 0;
      const p = Number(inputs.power) || 0;
      
      const res = Math.pow(b, p);

      return {
        result: `${b}^${p} = ${res.toLocaleString()}`
      };
    }
  },
  {
    id: 'root-calculator',
    name: 'Root Calculator (Square / Cube)',
    desc: 'คำนวณรากที่สอง (Square Root) และรากที่สาม (Cube Root)',
    icon: 'Radical',
    inputs: [
      { name: 'num', label: 'ตัวเลข', type: 'number', default: 144 }
    ],
    action: (inputs) => {
      const n = Number(inputs.num) || 0;
      
      if (n < 0) return { result: 'ตัวเลขติดลบไม่มี Square Root ที่เป็นจำนวนจริง' };

      const sqrt = Math.sqrt(n);
      const cbrt = Math.cbrt(n);

      return {
        result: `รากที่สอง (Square Root): ${sqrt.toLocaleString(undefined, { maximumFractionDigits: 6 })}`,
        details: [
          `รากที่สาม (Cube Root): ${cbrt.toLocaleString(undefined, { maximumFractionDigits: 6 })}`
        ]
      };
    }
  }
];
