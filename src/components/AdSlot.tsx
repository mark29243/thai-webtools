export function AdSlot({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center p-4 min-h-[100px] text-gray-400 text-sm ${className}`}>
      <span>[ พื้นที่โฆษณา AdSense ]</span>
    </div>
  )
}
