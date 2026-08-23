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
  }
];
