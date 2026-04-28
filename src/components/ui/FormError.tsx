import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import CustomWiggle from "gsap/dist/CustomWiggle";
import CustomEase from "gsap/dist/CustomEase";

gsap.registerPlugin(CustomEase, CustomWiggle);

type FormErrorType = {
  message: string;
};
export default function FormError({ message }: FormErrorType) {
  const error = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.set(error.current, { autoAlpha: 0, y: 5 });
    const tl = gsap
      .timeline()
      .to(error.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
      .to(error.current, {
        duration: 0.75,
        x: 5,
        ease: "wiggle({type:easeOut, wiggles:8})",
      });
  });

  return (
    <p
      ref={error}
      className="text-red-500 font-medium w-fit leading-none px-2 py-0.5 rounded-md text-sm"
    >
      {message}
    </p>
  );
}
