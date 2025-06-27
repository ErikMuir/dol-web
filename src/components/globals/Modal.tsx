import React, { PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ClickAwayListener from "react-click-away-listener";
import { MdClose } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export type BaseModalProps = {
  id: string;
  show: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  showClose?: boolean;
};

export const Modal = ({
  id,
  show,
  onClose,
  title,
  className,
  showClose,
  children,
}: PropsWithChildren<BaseModalProps>) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, [setIsBrowser]);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div
      id={`${id}-modal`}
      className={twMerge(
        "modal-overlay z-20",
        "fixed top-0 left-0",
        "w-full h-full overflow-x-hidden",
        "flex justify-center items-center",
        "bg-black/75",
        className
      )}
    >
      <ClickAwayListener
        onClickAway={() => {
          onClose();
        }}
      >
        <div className="modal-wrapper">
          <div className="modal relative mx-8 p-4 rounded-xl bg-dol-black z-10 shadow-md">
            {showClose && (
              <button
                type="button"
                className={twMerge(
                  "absolute top-0 right-0",
                  "flex items-center",
                  "m-2 p-2 rounded-full",
                  "text-gray-medium bg-dol-black",
                  "hover:text-gray-light hover:bg-gray-dark duration-500",
                )}
                onClick={handleCloseClick}
              >
                <MdClose />
              </button>
            )}
            <div className="text-xl font-light text-center my-0">{title}</div>
            {children}
          </div>
        </div>
      </ClickAwayListener>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")!
    );
  } else {
    return null;
  }
};

export default Modal;
