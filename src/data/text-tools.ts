export interface TextToolDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  placeholder: string;
  action: (text: string) => string;
}

export const textTools: TextToolDef[] = [
  {
    id: 'uppercase',
    name: 'Uppercase Converter',
    desc: 'แปลงข้อความภาษาอังกฤษเป็นตัวพิมพ์ใหญ่ทั้งหมด (UPPERCASE)',
    icon: 'CaseUpper',
    placeholder: 'พิมพ์ข้อความที่นี่ (เช่น hello world)',
    action: (t) => t.toUpperCase()
  },
  {
    id: 'lowercase',
    name: 'Lowercase Converter',
    desc: 'แปลงข้อความภาษาอังกฤษเป็นตัวพิมพ์เล็กทั้งหมด (lowercase)',
    icon: 'CaseLower',
    placeholder: 'พิมพ์ข้อความที่นี่ (เช่น HELLO WORLD)',
    action: (t) => t.toLowerCase()
  },
  {
    id: 'capitalize',
    name: 'Capitalize Words',
    desc: 'แปลงตัวอักษรแรกของทุกคำให้เป็นตัวพิมพ์ใหญ่ (Capitalize)',
    icon: 'Type',
    placeholder: 'พิมพ์ข้อความที่นี่ (เช่น hello world)',
    action: (t) => t.replace(/\b\w/g, (c) => c.toUpperCase())
  },
  {
    id: 'reverse-text',
    name: 'Reverse Text',
    desc: 'กลับหลังหันข้อความ จากหน้าไปหลัง',
    icon: 'ArrowLeftRight',
    placeholder: 'พิมพ์ข้อความที่ต้องการกลับหลัง...',
    action: (t) => t.split('').reverse().join('')
  },
  {
    id: 'remove-spaces',
    name: 'Remove Extra Spaces',
    desc: 'ลบช่องว่างส่วนเกินที่ซ้ำซ้อนให้เหลือช่องว่างเดียว',
    icon: 'Space',
    placeholder: 'พิมพ์ข้อความที่มี    ช่องว่าง    เยอะๆ...',
    action: (t) => t.replace(/\s+/g, ' ').trim()
  },
  {
    id: 'remove-newlines',
    name: 'Remove Line Breaks',
    desc: 'ลบการขึ้นบรรทัดใหม่ทั้งหมดให้เป็นบรรทัดเดียว',
    icon: 'WrapText',
    placeholder: 'พิมพ์ข้อความที่มี\nการขึ้นบรรทัดใหม่...',
    action: (t) => t.replace(/(\r\n|\n|\r)/gm, ' ')
  },
  {
    id: 'slugify',
    name: 'URL Slug Generator',
    desc: 'แปลงข้อความเป็นรูปแบบ URL Slug (เช่น hello-world)',
    icon: 'Link',
    placeholder: 'พิมพ์ข้อความ เช่น Hello World 2026',
    action: (t) => t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
  },
  {
    id: 'camelcase',
    name: 'camelCase Converter',
    desc: 'แปลงข้อความให้อยู่ในรูป camelCase',
    icon: 'Code',
    placeholder: 'พิมพ์ข้อความ เช่น Hello World',
    action: (t) => t.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '')
  },
  {
    id: 'snakecase',
    name: 'snake_case Converter',
    desc: 'แปลงข้อความให้อยู่ในรูป snake_case',
    icon: 'Code2',
    placeholder: 'พิมพ์ข้อความ เช่น Hello World',
    action: (t) => t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || t
  },
  {
    id: 'morse-code',
    name: 'Text to Morse Code',
    desc: 'แปลงข้อความภาษาอังกฤษเป็นรหัสมอร์ส',
    icon: 'Radio',
    placeholder: 'พิมพ์ข้อความ (เช่น SOS)',
    action: (t) => {
      const morseDict: Record<string, string> = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----', ' ': '/'
      };
      return t.toUpperCase().split('').map(c => morseDict[c] || c).join(' ');
    }
  }
];
