export function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[140px] animate-pulse [animation-delay:1s]" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-pink-500/10 blur-[100px] animate-pulse [animation-delay:3s]" />
    </div>
  );
}
