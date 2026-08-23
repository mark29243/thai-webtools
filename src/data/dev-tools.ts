export interface DevToolDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  placeholder: string;
  action: (text: string) => string;
}

export const devTools: DevToolDef[] = [
  {
    id: 'html-minifier',
    name: 'HTML Minifier',
    desc: 'บีบอัดโค้ด HTML ให้มีขนาดเล็กที่สุด โดยตัดช่องว่างออก',
    icon: 'Code2',
    placeholder: 'วางโค้ด HTML ที่นี่...',
    action: (t) => t.replace(/(<!--.*?-->)|(>[\s\n\r]+<)|([\s\n\r]+)/g, (match, comment, tags, spaces) => {
      if (comment) return '';
      if (tags) return '><';
      if (spaces) return ' ';
      return match;
    }).trim()
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    desc: 'บีบอัดโค้ด CSS ลบช่องว่างและคอมเมนต์เพื่อลดขนาดไฟล์',
    icon: 'FileCode',
    placeholder: 'วางโค้ด CSS ที่นี่...',
    action: (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,])\s*/g, '$1').replace(/;\}/g, '}').trim()
  },
  {
    id: 'js-minifier',
    name: 'JS Minifier (Basic)',
    desc: 'บีบอัดโค้ด JavaScript พื้นฐาน (ลบช่องว่างและบรรทัดใหม่)',
    icon: 'TerminalSquare',
    placeholder: 'วางโค้ด JavaScript ที่นี่...',
    action: (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,\=\+\-\*\/\(\)])\s*/g, '$1').trim()
  },
  {
    id: 'html-stripper',
    name: 'HTML Stripper',
    desc: 'ลบแท็ก HTML ทั้งหมดออก เหลือแต่ข้อความเพียวๆ (Plain Text)',
    icon: 'Eraser',
    placeholder: 'วางโค้ด HTML ที่นี่...',
    action: (t) => t.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim()
  },
  {
    id: 'json-stringify',
    name: 'JSON Stringify (One line)',
    desc: 'แปลง JSON Object ให้เป็นบรรทัดเดียว (Minify)',
    icon: 'Braces',
    placeholder: 'วาง JSON ที่นี่...',
    action: (t) => {
      try {
        return JSON.stringify(JSON.parse(t));
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    }
  }
];
