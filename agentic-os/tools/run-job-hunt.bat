@echo off
REM Run the job-hunt skill headlessly with Claude Code.
REM Use this file with Windows Task Scheduler (see README.md).
chcp 65001 >nul
cd /d "%~dp0.."
if not exist "outputs\jobs" mkdir "outputs\jobs"
claude -p "Use the job-hunt skill to find today's jobs and write the report." --allowedTools "Read,Write,Edit,Glob,Grep,WebSearch,WebFetch" >> "outputs\jobs\run.log" 2>&1
