import Image from "next/image";
import { photos, type PhotoKey } from "@/lib/photos";

type Props = { name: PhotoKey; className?: string; priority?: boolean; sizes?: string };

export default function Photo({ name, className = "", priority = false, sizes = "(max-width: 820px) 100vw, 50vw" }: Props) {
  const p = photos[name];
  return (
    <div className={`photo ${className}`}>
      <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
    </div>
  );
}
