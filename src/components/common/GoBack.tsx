import { MdArrowBack } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export type GoBackProps = {
  handleClick: () => void;
};

export const GoBack = ({ handleClick }: GoBackProps): React.ReactElement => {
  return (
    <div
      className={twMerge(
        "flex items-center gap-1 py-1 px-2 pr-4",
        "rounded-full cursor-pointer",
        "bg-gray-medium/25 hover:bg-gray-medium/50 duration-500",
        "text-xs uppercase",
      )}
      onClick={handleClick}
    >
      <MdArrowBack size={20} />
      <span>Back</span>
    </div>
  );
};