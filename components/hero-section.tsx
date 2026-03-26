import { GlitchText } from "@/components/glitch-text";

export function HeroSection() {
  return (
    <section className="px-6 pt-6 sm:px-10 sm:pt-10">
      <GlitchText
        text="Evan Zierk"
        tag="h1"
        className="font-extralight leading-none"
        style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
        highlightRange={[0, 4]}
      />
    </section>
  );
}
