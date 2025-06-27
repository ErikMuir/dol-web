import { FaCheck } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { DolColorHex } from "@erikmuir/dol-lib/types";

export const SuccessStatusIcon = (): React.ReactNode => {
  return <FaCheck title="success" color={DolColorHex.Green} />;
};

export const FailureStatusIcon = (): React.ReactNode => {
  return <VscChromeClose title="failure" color={DolColorHex.Red} />;
};
