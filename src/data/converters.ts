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
  }
}
