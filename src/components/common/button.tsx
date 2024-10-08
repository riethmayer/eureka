export enum ButtonType {
  default = "default",
  play = "play",
  pause = "pause",
  resume = "resume",
}

const icons = {
  [ButtonType.default]: null,
  [ButtonType.play]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  ),
  [ButtonType.pause]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  ),
  [ButtonType.resume]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  ),
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: keyof typeof icons;
  children: React.ReactNode;
};

export const Button = (
  { variant, children, ...props }: Props,
) => (
  <button
    className="flex w-52 justify-center text-white py-4 px-8 font-semibold rounded-lg ease-in-out bg-[#6b2070] hover:-transform-y-1 hover:scale-110 hover:bg-[#8f2297] duration-300"
    {...props}
  >
    {icons[variant]}
    {children}
  </button>
);

export default Button;