export type Unit = {
  id: string
  name: string
  ratio: number // relative to base unit
}

export type ConverterGroup = {
  id: string
  title: string
  description: string
  baseUnit: string
  units: Unit[]
}

export const converters: Record<string, ConverterGroup> = {
  'length': {
    id: 'length',
    title: 'ตัวแปลงหน่วยความยาว (Length Converter)',
    description: 'แปลงหน่วยความยาว เมตร เซนติเมตร นิ้ว ฟุต หลา ไมล์',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'เมตร (Meter)', ratio: 1 },
      { id: 'cm', name: 'เซนติเมตร (Centimeter)', ratio: 0.01 },
      { id: 'km', name: 'กิโลเมตร (Kilometer)', ratio: 1000 },
      { id: 'in', name: 'นิ้ว (Inch)', ratio: 0.0254 },
      { id: 'ft', name: 'ฟุต (Foot)', ratio: 0.3048 },
      { id: 'yd', name: 'หลา (Yard)', ratio: 0.9144 },
      { id: 'mi', name: 'ไมล์ (Mile)', ratio: 1609.344 },
      { id: 'wa', name: 'วา (Wa - Thai)', ratio: 2 },
    ]
  },
  'weight': {
    id: 'weight',
    title: 'ตัวแปลงหน่วยน้ำหนัก (Weight Converter)',
    description: 'แปลงหน่วยน้ำหนัก กิโลกรัม ปอนด์ ออนซ์ กรัม',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'กิโลกรัม (Kilogram)', ratio: 1 },
      { id: 'g', name: 'กรัม (Gram)', ratio: 0.001 },
      { id: 'mg', name: 'มิลลิกรัม (Milligram)', ratio: 0.000001 },
      { id: 'lb', name: 'ปอนด์ (Pound)', ratio: 0.45359237 },
      { id: 'oz', name: 'ออนซ์ (Ounce)', ratio: 0.0283495231 },
      { id: 'ton', name: 'ตัน (Metric Ton)', ratio: 1000 },
    ]
  },
  'area': {
    id: 'area',
    title: 'ตัวแปลงหน่วยพื้นที่ (Area Converter)',
    description: 'แปลงหน่วยพื้นที่ ไร่ งาน ตารางวา ตารางเมตร เอเคอร์',
    baseUnit: 'sqm',
    units: [
      { id: 'sqm', name: 'ตารางเมตร (Sq Meter)', ratio: 1 },
      { id: 'rai', name: 'ไร่ (Rai - Thai)', ratio: 1600 },
      { id: 'ngan', name: 'งาน (Ngan - Thai)', ratio: 400 },
      { id: 'sqwa', name: 'ตารางวา (Sq Wa - Thai)', ratio: 4 },
      { id: 'acre', name: 'เอเคอร์ (Acre)', ratio: 4046.85642 },
      { id: 'hectare', name: 'เฮกตาร์ (Hectare)', ratio: 10000 },
      { id: 'sqft', name: 'ตารางฟุต (Sq Foot)', ratio: 0.09290304 },
    ]
  },
  'data': {
    id: 'data',
    title: 'ตัวแปลงหน่วยข้อมูล (Data Storage Converter)',
    description: 'แปลงหน่วยคอมพิวเตอร์ Byte, KB, MB, GB, TB',
    baseUnit: 'b',
    units: [
      { id: 'b', name: 'Byte (B)', ratio: 1 },
      { id: 'kb', name: 'Kilobyte (KB)', ratio: 1024 },
      { id: 'mb', name: 'Megabyte (MB)', ratio: 1048576 },
      { id: 'gb', name: 'Gigabyte (GB)', ratio: 1073741824 },
      { id: 'tb', name: 'Terabyte (TB)', ratio: 1099511627776 },
    ]
  },
  'time': {
    id: 'time',
    title: 'ตัวแปลงหน่วยเวลา (Time Converter)',
    description: 'แปลงหน่วยเวลา วินาที นาที ชั่วโมง วัน สัปดาห์ เดือน ปี',
    baseUnit: 's',
    units: [
      { id: 'ms', name: 'มิลลิวินาที (Millisecond)', ratio: 0.001 },
      { id: 's', name: 'วินาที (Second)', ratio: 1 },
      { id: 'min', name: 'นาที (Minute)', ratio: 60 },
      { id: 'h', name: 'ชั่วโมง (Hour)', ratio: 3600 },
      { id: 'd', name: 'วัน (Day)', ratio: 86400 },
      { id: 'wk', name: 'สัปดาห์ (Week)', ratio: 604800 },
      { id: 'mo', name: 'เดือน (Month - 30 วัน)', ratio: 2592000 },
      { id: 'yr', name: 'ปี (Year - 365 วัน)', ratio: 31536000 },
    ]
  },
  'speed': {
    id: 'speed',
    title: 'ตัวแปลงหน่วยความเร็ว (Speed Converter)',
    description: 'แปลงหน่วยกิโลเมตร/ชั่วโมง ไมล์/ชั่วโมง เมตร/วินาที',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'เมตร/วินาที (m/s)', ratio: 1 },
      { id: 'kmph', name: 'กิโลเมตร/ชั่วโมง (km/h)', ratio: 0.277777778 },
      { id: 'mph', name: 'ไมล์/ชั่วโมง (mph)', ratio: 0.44704 },
      { id: 'knot', name: 'นอต (Knot)', ratio: 0.514444444 },
      { id: 'mach', name: 'มัค (Mach)', ratio: 343 }
    ]
  },
  'volume': {
    id: 'volume',
    title: 'ตัวแปลงหน่วยปริมาตร (Volume Converter)',
    description: 'แปลงลิตร มิลลิลิตร แกลลอน ถ้วยตวง',
    baseUnit: 'l',
    units: [
      { id: 'l', name: 'ลิตร (Liter)', ratio: 1 },
      { id: 'ml', name: 'มิลลิลิตร (Milliliter)', ratio: 0.001 },
      { id: 'gal', name: 'แกลลอนสหรัฐ (US Gallon)', ratio: 3.78541178 },
      { id: 'qt', name: 'ควอร์ต (Quart)', ratio: 0.946352946 },
      { id: 'pt', name: 'ไพนต์ (Pint)', ratio: 0.473176473 },
      { id: 'cup', name: 'ถ้วยตวง (Cup)', ratio: 0.24 },
      { id: 'floz', name: 'ออนซ์ของเหลว (Fluid Ounce)', ratio: 0.0295735296 },
      { id: 'm3', name: 'ลูกบาศก์เมตร (Cubic Meter)', ratio: 1000 }
    ]
  },
  'pressure': {
    id: 'pressure',
    title: 'ตัวแปลงหน่วยความดัน (Pressure Converter)',
    description: 'แปลง Pascal, Bar, PSI, atm',
    baseUnit: 'pa',
    units: [
      { id: 'pa', name: 'พาสคัล (Pascal)', ratio: 1 },
      { id: 'kpa', name: 'กิโลพาสคัล (kPa)', ratio: 1000 },
      { id: 'bar', name: 'บาร์ (Bar)', ratio: 100000 },
      { id: 'psi', name: 'ปอนด์ต่อตารางนิ้ว (PSI)', ratio: 6894.75729 },
      { id: 'atm', name: 'บรรยากาศ (atm)', ratio: 101325 },
      { id: 'mmhg', name: 'มิลลิเมตรปรอท (mmHg)', ratio: 133.322368 }
    ]
  },
  'energy': {
    id: 'energy',
    title: 'ตัวแปลงหน่วยพลังงาน (Energy Converter)',
    description: 'แปลงจูล แคลอรี่ กิโลวัตต์ชั่วโมง',
    baseUnit: 'j',
    units: [
      { id: 'j', name: 'จูล (Joule)', ratio: 1 },
      { id: 'kj', name: 'กิโลจูล (Kilojoule)', ratio: 1000 },
      { id: 'cal', name: 'แคลอรี (Calorie)', ratio: 4.184 },
      { id: 'kcal', name: 'กิโลแคลอรี (Kcal)', ratio: 4184 },
      { id: 'wh', name: 'วัตต์ชั่วโมง (Wh)', ratio: 3600 },
      { id: 'kwh', name: 'กิโลวัตต์ชั่วโมง (kWh)', ratio: 3600000 },
      { id: 'ev', name: 'อิเล็กตรอนโวลต์ (eV)', ratio: 1.602176634e-19 }
    ]
  },
  'power': {
    id: 'power',
    title: 'ตัวแปลงหน่วยกำลัง (Power Converter)',
    description: 'แปลงวัตต์ กิโลวัตต์ แรงม้า',
    baseUnit: 'w',
    units: [
      { id: 'w', name: 'วัตต์ (Watt)', ratio: 1 },
      { id: 'kw', name: 'กิโลวัตต์ (Kilowatt)', ratio: 1000 },
      { id: 'mw', name: 'เมกะวัตต์ (Megawatt)', ratio: 1000000 },
      { id: 'hp', name: 'แรงม้า (Horsepower)', ratio: 745.699872 }
    ]
  },
  'force': {
    id: 'force',
    title: 'ตัวแปลงหน่วยแรง (Force Converter)',
    description: 'แปลงนิวตัน ปอนด์ฟอร์ซ ไดน์',
    baseUnit: 'n',
    units: [
      { id: 'n', name: 'นิวตัน (Newton)', ratio: 1 },
      { id: 'kn', name: 'กิโลนิวตัน (Kilonewton)', ratio: 1000 },
      { id: 'dyne', name: 'ไดน์ (Dyne)', ratio: 0.00001 },
      { id: 'lbf', name: 'ปอนด์-ฟอร์ซ (Pound-force)', ratio: 4.44822162 },
      { id: 'kgf', name: 'กิโลกรัม-ฟอร์ซ (kgf)', ratio: 9.80665 }
    ]
  },
  'angle': {
    id: 'angle',
    title: 'ตัวแปลงหน่วยมุม (Angle Converter)',
    description: 'แปลงองศา เรเดียน กราเดียน',
    baseUnit: 'deg',
    units: [
      { id: 'deg', name: 'องศา (Degree)', ratio: 1 },
      { id: 'rad', name: 'เรเดียน (Radian)', ratio: 57.2957795 },
      { id: 'grad', name: 'กราเดียน (Gradian)', ratio: 0.9 },
      { id: 'min', name: 'ลิปดา (Minute of arc)', ratio: 0.0166666667 },
      { id: 'sec', name: 'ฟิลิปดา (Second of arc)', ratio: 0.000277777778 }
    ]
  },
  'data-rate': {
    id: 'data-rate',
    title: 'ตัวแปลงหน่วยอัตราข้อมูล (Data Transfer Rate)',
    description: 'แปลง Mbps, Kbps, MB/s, GB/s',
    baseUnit: 'bps',
    units: [
      { id: 'bps', name: 'บิตต่อวินาที (bps)', ratio: 1 },
      { id: 'kbps', name: 'กิโลบิตต่อวินาที (Kbps)', ratio: 1000 },
      { id: 'mbps', name: 'เมกะบิตต่อวินาที (Mbps)', ratio: 1000000 },
      { id: 'gbps', name: 'กิกะบิตต่อวินาที (Gbps)', ratio: 1000000000 },
      { id: 'Bps', name: 'ไบต์ต่อวินาที (B/s)', ratio: 8 },
      { id: 'KBps', name: 'กิโลไบต์ต่อวินาที (KB/s)', ratio: 8000 },
      { id: 'MBps', name: 'เมกะไบต์ต่อวินาที (MB/s)', ratio: 8000000 }
    ]
  },
  'frequency': {
    id: 'frequency',
    title: 'ตัวแปลงหน่วยความถี่ (Frequency Converter)',
    description: 'แปลงเฮิร์ตซ์ กิโลเฮิร์ตซ์ เมกะเฮิร์ตซ์',
    baseUnit: 'hz',
    units: [
      { id: 'hz', name: 'เฮิร์ตซ์ (Hertz)', ratio: 1 },
      { id: 'khz', name: 'กิโลเฮิร์ตซ์ (kHz)', ratio: 1000 },
      { id: 'mhz', name: 'เมกะเฮิร์ตซ์ (MHz)', ratio: 1000000 },
      { id: 'ghz', name: 'กิกะเฮิร์ตซ์ (GHz)', ratio: 1000000000 }
    ]
  }
}
