# Agentic OS (ทดลอง) — ผู้ช่วยหางานบน Windows

ระบบผู้ช่วย AI ส่วนตัวแบบเริ่มเล็ก ตอนนี้มี 3 ส่วน:
- **ความจำ:** โฟลเดอร์นี้เปิดเป็น Obsidian vault ได้เลย (`raw/` `wiki/` `outputs/`) และมี `CLAUDE.md` เป็นแผนที่
- **Skill แรก:** `job-hunt` หางาน freelance ที่ตรงกับทักษะของคุณ แล้วสรุปลง `outputs/jobs/`
- **ตั้งเวลา:** ใช้ Windows Task Scheduler รัน skill ให้ทุกเช้า

ส่วนที่ยังไม่ได้ทำ: ตัวคัดงาน (router) และเสียง

> ⚠️ ตอนนี้อยู่ใน repo `thai-webtools` เพื่อทดลอง ถ้าใช้ดีแล้วควรย้ายไป repo ของตัวเอง
> เพราะ Claude Code จะโหลด `CLAUDE.md` ของ thai-webtools (เรื่อง Next.js) มาด้วย

## 1. ติดตั้ง (ครั้งเดียว)

1. ติดตั้ง [Git for Windows](https://git-scm.com/download/win) และ [Node.js LTS](https://nodejs.org)
2. ติดตั้ง Claude Code ตามคู่มือทางการที่ https://code.claude.com/docs แล้วเปิด PowerShell พิมพ์ `claude` เพื่อล็อกอินครั้งแรก
3. ติดตั้ง [Obsidian](https://obsidian.md)
4. ดาวน์โหลดโปรเจกต์:
   ```powershell
   cd $HOME\Documents
   git clone -b agentic-os https://github.com/mark29243/thai-webtools.git
   ```
5. ใน Obsidian เลือก **Open folder as vault** แล้วเลือก `Documents\thai-webtools\agentic-os`

## 2. ใส่ข้อมูลของคุณ

เปิด `wiki/profile.md` ใน Obsidian แล้วแก้ทักษะ เรตราคา และงานที่ไม่รับให้เป็นของจริง
(ตอนนี้เป็นค่าตัวอย่าง) ถ้าอยากเพิ่มเว็บหรือคำค้น ให้แก้ `wiki/job-sources.md`

## 3. ลองรันเอง

```powershell
cd $HOME\Documents\thai-webtools\agentic-os
claude
```
แล้วพิมพ์ `หางานให้หน่อย` รายงานจะอยู่ที่ `outputs/jobs/วันที่.md` เปิดดูใน Obsidian ได้ทันที

## 4. ตั้งให้รันเองทุกเช้า (Task Scheduler)

1. ดับเบิลคลิก `tools\run-job-hunt.bat` เพื่อทดสอบก่อน 1 ครั้ง ถ้ามีไฟล์รายงานโผล่ใน `outputs\jobs` แปลว่าใช้ได้
   (ถ้าพัง ดู error ใน `outputs\jobs\run.log`)
2. เปิด **Task Scheduler** → **Create Basic Task**
3. ตั้งชื่อ `Job Hunt` → เลือก **Daily** → ตั้งเวลา เช่น 07:40
4. Action: **Start a program** → Program คือ path เต็มของ `run-job-hunt.bat`
   เช่น `C:\Users\ชื่อคุณ\Documents\thai-webtools\agentic-os\tools\run-job-hunt.bat`
5. กด Finish คอมต้องเปิดอยู่ตอนถึงเวลา ถ้าอยากให้รันตอนเปิดเครื่องทีหลัง
   ให้เปิด task → แท็บ Settings → ติ๊ก **Run task as soon as possible after a scheduled start is missed**

## โครงสร้าง

```
agentic-os/
├── CLAUDE.md                 แผนที่ให้ Claude อ่านก่อนทำงาน
├── raw/                      ของดิบ (Claude อ่านอย่างเดียว)
├── wiki/
│   ├── profile.md            ทักษะ/เรต/งานที่ไม่รับ ← แก้ไฟล์นี้ก่อน
│   └── job-sources.md        เว็บและคำค้น
├── outputs/jobs/             รายงานหางานรายวัน
├── tools/run-job-hunt.bat    สคริปต์สำหรับ Task Scheduler
└── .claude/skills/job-hunt/  ขั้นตอนของ skill
```

## ขั้นต่อไป
- เพิ่ม skill ใหม่: สร้างโฟลเดอร์ใน `.claude/skills/ชื่อ/SKILL.md` แล้วเพิ่มชื่อใน `CLAUDE.md`
- ตัวคัดงาน: ส่งงานง่ายไปโมเดลเล็กเพื่อประหยัด
- เสียง: faster-whisper ฟังภาษาไทยได้ แต่ต้องหาตัวอ่านออกเสียงที่มีเสียงไทย
