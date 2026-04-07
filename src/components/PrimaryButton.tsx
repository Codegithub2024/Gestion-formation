type ButtonStyle = "blue" | "amber" | "pink" | "red";

type ButtonType = {
  text: string;
  children?: React.ReactNode;
  placeAfter?: boolean;
  buttonStyle?: ButtonStyle;
};

export default function PrimaryButton({
  text,
  children,
  placeAfter,
  buttonStyle = "blue",
}: ButtonType) {
  const style = {
    blue: "bg-primary-blue text-primary-blue-text hover:outline-primary-blue-text",
    amber:
      "bg-primary-amber text-primary-amber-text hover:outline-primary-amber-text",
    pink: "bg-primary-pink text-primary-pink-text hover:outline-primary-pink-text",
    red: "bg-primary-red-text text-primary-red hover:outline-primary-red",
  };
  return (
    <button
      className={`rounded-full inline-flex justify-center items-center h-9 px-4 outline-1 outline-offset-6 outline-transparent transition-all duration-150 active:outline-offset-0 hover:outline-offset-2 hover:*:scale-[1.05] active:*:scale-[0.95] ease-out cursor-pointer ${style[buttonStyle]}`}
    >
      <p
        className={`text-sm inline-flex justify-center *:stroke-3 transition-all duration-150 items-center gap-1.5 font-semibold capitalize tracking-tight leading-0`}
      >
        {!placeAfter && children}
        {text}
        {placeAfter && children}
      </p>
    </button>
  );
}
