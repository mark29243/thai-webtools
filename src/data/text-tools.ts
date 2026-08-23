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
  },
  {
    id: 'text-to-hex',
    name: 'Text to Hex',
    desc: 'แปลงข้อความเป็นรหัสฐาน 16 (Hexadecimal)',
    icon: 'Binary',
    placeholder: 'พิมพ์ข้อความ...',
    action: (t) => t.split('').map(c => c.charCodeAt(0).toString(16)).join(' ')
  },
  {
    id: 'hex-to-text',
    name: 'Hex to Text',
    desc: 'แปลงรหัสฐาน 16 (Hexadecimal) กลับเป็นข้อความ',
    icon: 'FileText',
    placeholder: 'พิมพ์รหัส Hex (เช่น 68 65 6c 6c 6f)',
    action: (t) => t.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('')
  },
  {
    id: 'extract-emails',
    name: 'Extract Emails',
    desc: 'ดึงอีเมลทั้งหมดที่ซ่อนอยู่ในข้อความยาวๆ ออกมา',
    icon: 'Mail',
    placeholder: 'วางเนื้อหาที่มีอีเมลปะปนอยู่...',
    action: (t) => (t.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/gi) || []).join('\n')
  },
  {
    id: 'extract-urls',
    name: 'Extract URLs',
    desc: 'ดึงลิงก์เว็บไซต์ (URL) ทั้งหมดออกจากข้อความ',
    icon: 'Link',
    placeholder: 'วางเนื้อหาที่มีลิงก์ปะปนอยู่...',
    action: (t) => (t.match(/https?:\/\/[^\s]+/gi) || []).join('\n')
  },
  {
    id: 'sort-lines-alpha',
    name: 'Sort Lines A-Z',
    desc: 'เรียงลำดับบรรทัดตามตัวอักษร A-Z (หรือ ก-ฮ)',
    icon: 'ArrowDownAZ',
    placeholder: 'วางข้อความหลายบรรทัด...',
    action: (t) => t.split('\n').sort((a,b) => a.localeCompare(b)).join('\n')
  },
  {
    id: 'sort-lines-reverse',
    name: 'Sort Lines Z-A',
    desc: 'เรียงลำดับบรรทัดย้อนกลับ Z-A (หรือ ฮ-ก)',
    icon: 'ArrowUpZA',
    placeholder: 'วางข้อความหลายบรรทัด...',
    action: (t) => t.split('\n').sort((a,b) => b.localeCompare(a)).join('\n')
  },
  {
    id: 'shuffle-lines',
    name: 'Shuffle Lines',
    desc: 'สลับบรรทัดแบบสุ่ม (Randomize Lines)',
    icon: 'Shuffle',
    placeholder: 'วางข้อความหลายบรรทัด...',
    action: (t) => {
      const arr = t.split('\n');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('\n');
    }
  },
  {
    id: 'reverse-words',
    name: 'Reverse Words',
    desc: 'สลับตำแหน่งคำในประโยคจากหลังมาหน้า',
    icon: 'ArrowLeftRight',
    placeholder: 'พิมพ์ข้อความ (เช่น hello world -> world hello)',
    action: (t) => t.split(' ').reverse().join(' ')
  },
  {
    id: 'remove-punctuation',
    name: 'Remove Punctuation',
    desc: 'ลบเครื่องหมายวรรคตอนและสัญลักษณ์พิเศษทั้งหมด',
    icon: 'Eraser',
    placeholder: 'พิมพ์ข้อความที่มีเครื่องหมาย !@#$%',
    action: (t) => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  },
  {
    id: 'add-line-numbers',
    name: 'Add Line Numbers',
    desc: 'ใส่ตัวเลขกำกับหน้าบรรทัดทุกบรรทัด',
    icon: 'ListOrdered',
    placeholder: 'วางข้อความหลายบรรทัด...',
    action: (t) => t.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
  },
  {
    id: 'text-to-octal',
    name: 'Text to Octal',
    desc: 'แปลงข้อความเป็นรหัสฐาน 8 (Octal)',
    icon: 'Binary',
    placeholder: 'พิมพ์ข้อความ...',
    action: (t) => t.split('').map(c => c.charCodeAt(0).toString(8)).join(' ')
  },
  {
    id: 'octal-to-text',
    name: 'Octal to Text',
    desc: 'แปลงรหัสฐาน 8 (Octal) กลับเป็นข้อความ',
    icon: 'FileText',
    placeholder: 'พิมพ์รหัส Octal (เช่น 150 145 154)',
    action: (t) => t.split(' ').map(o => String.fromCharCode(parseInt(o, 8))).join('')
  },
  {
    id: 'count-vowels',
    name: 'Count Vowels',
    desc: 'นับสระภาษาอังกฤษ (A, E, I, O, U)',
    icon: 'Sigma',
    placeholder: 'พิมพ์ข้อความภาษาอังกฤษ...',
    action: (t) => {
      const match = t.match(/[aeiou]/gi);
      return `พบสระทั้งหมด: ${match ? match.length : 0} ตัว\nได้แก่: ${(match || []).join(', ')}`;
    }
  },
  {
    id: 'camel-case',
    name: 'Camel Case',
    desc: 'แปลงข้อความเป็น camelCase (เช่น helloWorld)',
    icon: 'CaseSensitive',
    placeholder: 'พิมพ์ข้อความ (เช่น Hello World)',
    action: (t) => t.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '')
  },
  {
    id: 'snake-case',
    name: 'Snake Case',
    desc: 'แปลงข้อความเป็น snake_case (เช่น hello_world)',
    icon: 'CaseSensitive',
    placeholder: 'พิมพ์ข้อความ (เช่น Hello World)',
    action: (t) => t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || t
  },
  {
    id: 'kebab-case',
    name: 'Kebab Case',
    desc: 'แปลงข้อความเป็น kebab-case (เช่น hello-world)',
    icon: 'CaseSensitive',
    placeholder: 'พิมพ์ข้อความ (เช่น Hello World)',
    action: (t) => t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || t
  },
  {
    id: 'pascal-case',
    name: 'Pascal Case',
    desc: 'แปลงข้อความเป็น PascalCase (เช่น HelloWorld)',
    icon: 'CaseSensitive',
    placeholder: 'พิมพ์ข้อความ (เช่น Hello World)',
    action: (t) => t.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('') || t
  },
  {
    id: 'alternating-case',
    name: 'Alternating Case',
    desc: 'สลับตัวพิมพ์เล็ก/ใหญ่ (เช่น hElLo wOrLd)',
    icon: 'WholeWord',
    placeholder: 'พิมพ์ข้อความ...',
    action: (t) => t.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')
  },
  {
    id: 'remove-line-breaks',
    name: 'Remove Line Breaks',
    desc: 'ลบการขึ้นบรรทัดใหม่ทั้งหมด ทำให้ข้อความต่อกันเป็นบรรทัดเดียว',
    icon: 'WrapText',
    placeholder: 'วางข้อความหลายบรรทัด...',
    action: (t) => t.replace(/(\r\n|\n|\r)/gm, ' ')
  },
  {
    id: 'remove-extra-spaces',
    name: 'Remove Extra Spaces',
    desc: 'ลบช่องว่างส่วนเกินที่ติดกันหลายตัวให้เหลือตัวเดียว',
    icon: 'Space',
    placeholder: 'วางข้อความที่มีช่องว่างเยอะๆ...',
    action: (t) => t.replace(/\s+/g, ' ').trim()
  },
  {
    id: 'extract-numbers',
    name: 'Extract Numbers',
    desc: 'ดึงเฉพาะตัวเลขที่อยู่ในข้อความออกมาทั้งหมด',
    icon: 'Binary',
    placeholder: 'วางข้อความที่มีตัวเลขปะปน...',
    action: (t) => (t.match(/\d+/g) || []).join('\n')
  },
  {
    id: 'extract-letters',
    name: 'Extract Letters',
    desc: 'ดึงเฉพาะตัวอักษร (ลบตัวเลขและสัญลักษณ์)',
    icon: 'Type',
    placeholder: 'วางข้อความ...',
    action: (t) => t.replace(/[^a-zA-Z\u0E00-\u0E7F]/g, '')
  },
  {
    id: 'reverse-string',
    name: 'Reverse String',
    desc: 'กลับด้านข้อความจากหลังมาหน้า ทุกตัวอักษร',
    icon: 'ArrowLeftRight',
    placeholder: 'พิมพ์ข้อความ...',
    action: (t) => t.split('').reverse().join('')
  },
  {
    id: 'html-encode',
    name: 'HTML Encode',
    desc: 'แปลงสัญลักษณ์พิเศษเป็น HTML Entities (&lt; &gt;)',
    icon: 'Code2',
    placeholder: 'วางโค้ด HTML...',
    action: (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  },
  {
    id: 'html-decode',
    name: 'HTML Decode',
    desc: 'แปลง HTML Entities กลับเป็นสัญลักษณ์ปกติ',
    icon: 'FileCode',
    placeholder: 'วางโค้ดแบบ HTML Entity...',
    action: (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  }
];
