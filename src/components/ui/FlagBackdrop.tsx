import Flag from "@/components/ui/Flag";

export default function FlagBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <Flag className="absolute -right-32 -top-32 h-[36rem] w-auto rotate-12 opacity-[0.045]" />
      <Flag className="absolute -bottom-28 -left-28 h-[26rem] w-auto -rotate-6 opacity-[0.04]" />
      <div className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bf-yellow/[0.05] blur-3xl" />
    </div>
  );
}
