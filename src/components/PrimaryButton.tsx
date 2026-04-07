type ButtonStyle = "primary" | "secondary" | "tertiary";

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
  buttonStyle = "primary",
}: ButtonType) {
  return (
    <button
      className={`rounded-full inline-flex justify-center items-center bg-${buttonStyle} h-9.5 px-4 outline-1 outline-offset-6 outline-transparent transition-all duration-100 hover:outline-${buttonStyle}-text active:outline-offset-0 hover:outline-offset-2 hover:*:scale-[1.03] active:*:scale-[0.97] ease-out cursor-pointer text-${buttonStyle}-text gap-1.5`}
    >
      <p
        className={`text-sm inline-flex justify-center *:stroke-3 transition-all duration-100 items-center gap-1.5 font-semibold capitalize tracking-tight leading-0 text-${buttonStyle}-text`}
      >
        {!placeAfter && children}
        {text}
        {placeAfter && children}
      </p>
    </button>
  );
}
