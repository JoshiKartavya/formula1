export default function RadioMessage() {
  return (
    <div className="bg-white/10 h-[120px] w-[424px] rounded-[16px] flex items-center px-7 gap-[30px] border border-white/10">
      <div className="flex flex-col text-center">
        <span className="font-extrabold text-4xl text-[#20ddbe]">44</span>
        <span className="text-white text-base">Hamilton Radio</span>
      </div>
      <div className="w-px h-[80px] bg-[#d9d9d9]" />
      <div className="text-[20px] text-[#20ddbe] w-[178px] leading-tight">
        “Lewis, It’s Hammer Time!”
      </div>
    </div>
  );
}
