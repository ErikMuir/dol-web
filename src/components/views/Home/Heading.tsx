export const Heading = (): React.ReactElement => {
  return (
    <div className="text-center">
      <div className="pb-1">Welcome to</div>
      <div className="flex items-center gap-2">
        <div className="text-4xl uppercase tracking-[4px]">Duke</div>
        <div className=" uppercase tracking-[4px]">of</div>
        <div className="text-4xl uppercase tracking-[4px]">Lizards</div>
      </div>
      <div className="w-20 my-4 border-b border-dol-light mx-auto"></div>
      <div className="text-xl">A Most Glorious Collection</div>
    </div>
  );
};
