import type { CvSocialNetwork } from "@/lib/resumeData";

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
        </div>

        <div className="flex w-fit shrink-0 flex-col items-start gap-0.5 text-left text-[9px] text-slate-700">
          <div>Location: {location}</div>
          <a className="hover:underline" href={`mailto:${email}`}>
            Email: {email}
          </a>
          {portfolio ? (
            <a className="hover:underline" href={portfolio}>
              Portfolio: {portfolio}
            </a>
          ) : null}
          {socialNetworks.map((item) => (
            <a
              key={item.network}
              className="hover:underline"
              href={item.username}
            >
              {item.network}: {item.username}
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
