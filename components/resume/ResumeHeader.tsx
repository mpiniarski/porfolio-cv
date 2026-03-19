import { shortUrl } from "@/lib/resumeData";
import type { CvSocialNetwork } from "@/lib/resumeData";
import { Mail, Linkedin, Github, MapPin } from "lucide-react";

function NetworkIcon({ network }: { network: string }) {
  const n = network.toLowerCase();
  if (n.includes("linkedin")) return <Linkedin className="h-3 w-3 shrink-0 text-slate-500" />;
  if (n.includes("github")) return <Github className="h-3 w-3 shrink-0 text-slate-500" />;
  return null;
}

type Props = {
  headline: string;
  name: string;
  portfolio?: string;
  location: string;
  email: string;
  socialNetworks: CvSocialNetwork[];
  pageNumber: number;
  totalPages: number;
};

export function ResumeHeader({
  headline,
  name,
  portfolio,
  location,
  email,
  socialNetworks,
  pageNumber,
  totalPages,
}: Props) {
  return (
    <header className="relative mb-5 border-b-2 border-slate-800 pb-3">
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1">
          <p className="mb-1 text-lg font-semibold tracking-wide text-slate-600 uppercase">{headline}</p>
          <h1 className="mb-2 text-3xl tracking-tight">{name}</h1>
          {portfolio ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-slate-700">Portfolio: {portfolio}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 text-right text-xs text-slate-700">
          <div className="flex items-center justify-end gap-1.5">
            <span>{location}</span>
            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
          </div>
          <a className="flex items-center justify-end gap-1.5 hover:underline" href={`mailto:${email}`}>
            <span>{email}</span>
            <Mail className="h-3 w-3 shrink-0 text-slate-500" />
          </a>
          {socialNetworks.map((item) => (
            <a
              key={item.network}
              className="flex items-center justify-end gap-1.5 hover:underline"
              href={item.username}
            >
              <span>{shortUrl(item.username)}</span>
              <NetworkIcon network={item.network} />
            </a>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-4.5 right-0 text-[9px] text-slate-400">
        Page {pageNumber} of {totalPages}
      </div>
    </header>
  );
}
