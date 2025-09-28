import { MdArrowBack } from "react-icons/md";
import { DolButton } from "./DolButton";

export type GoBackProps = {
  handleClick: () => void;
};

export const GoBack = ({ handleClick }: GoBackProps): React.ReactElement => {
  return (
    <DolButton
      color="gray"
      size="sm"
      roundedFull
      onClick={handleClick}
      className="flex items-center gap-1 pl-3"
    >
      <MdArrowBack size={20} />
      <span>Back</span>
    </DolButton>
  );
};