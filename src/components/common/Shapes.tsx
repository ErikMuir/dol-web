import { twMerge } from "tailwind-merge";
import { DolColorHex } from "@erikmuir/dol-lib/types";

export type ShapeProps = {
  color: DolColorHex;
  sizeInPixels?: number;
  className?: string;
};

export const Donut = ({
  color,
  sizeInPixels = 60,
  className,
}: ShapeProps): React.ReactNode => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeInPixels}
      height={sizeInPixels}
      viewBox="0 0 100 100"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="transparent"
        stroke={color}
        strokeWidth="26"
      />
    </svg>
  );
};

export type ShapesProps = {
  sizeInPixels?: number;
  bounceOnHover?: boolean;
};

export const Shapes = ({
  sizeInPixels = 24,
  bounceOnHover,
}: ShapesProps): React.ReactNode => {
  return (
    <div className="group">
      <div className="group flex gap-1">
        <Circle
          sizeInPixels={sizeInPixels}
          color={DolColorHex.Blue}
          className=""
        />
        <Square
          sizeInPixels={sizeInPixels}
          color={DolColorHex.Green}
          className={twMerge(bounceOnHover ? "group-hover:animate-bounce" : "")}
        />
        <Circle
          sizeInPixels={sizeInPixels}
          color={DolColorHex.Red}
          className=""
        />
        <Square
          sizeInPixels={sizeInPixels}
          color={DolColorHex.Yellow}
          className={twMerge(bounceOnHover ? "group-hover:animate-bounce" : "")}
        />
      </div>
    </div>
  );
};

const Circle = ({
  sizeInPixels,
  color,
  className,
}: ShapeProps): React.ReactNode => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeInPixels}
      height={sizeInPixels}
      viewBox="0 0 100 100"
      className={className}
    >
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="transparent"
        stroke={color}
        strokeWidth="18"
      />
    </svg>
  );
};

const Square = ({
  sizeInPixels,
  color,
  className,
}: ShapeProps): React.ReactNode => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={sizeInPixels}
      height={sizeInPixels}
      viewBox="0 0 100 100"
      className={className}
    >
      <rect
        x="13"
        y="13"
        width="74"
        height="74"
        fill="transparent"
        stroke={color}
        strokeWidth="18"
      />
    </svg>
  );
};
