export interface SiteFooterProps {
  cv: {
    email: string;
  };
  social_networks: Array<{ network: string; username: string }>;
}

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function getSocialIcon(network: string) {
  const n = network.toLowerCase();
  if (n === "linkedin") return LinkedInIcon;
  if (n === "github") return GitHubIcon;
  return null;
}

export function SiteFooter({ cv, social_networks }: SiteFooterProps) {
  return (
    <footer className="mt-12 border-t border-zinc-200 pt-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-600">
        <a
          href={`mailto:${cv.email}`}
          className="inline-flex items-center gap-2 transition hover:text-zinc-900"
          aria-label={`Email: ${cv.email}`}
        >
          <MailIcon className="shrink-0 text-zinc-500" />
          <span>{cv.email}</span>
        </a>
        {social_networks.map((item) => {
          const Icon = getSocialIcon(item.network);
          return (
            <a
              key={item.network}
              href={item.username}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-zinc-900"
              aria-label={`${item.network} profile`}
            >
              {Icon ? (
                <Icon className="shrink-0 text-zinc-500" />
              ) : null}
              <span>{item.network}</span>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        For roles, collaboration, or questions about complex frontend
        architecture and design systems, feel free to reach out by email or via
        LinkedIn.
      </p>
    </footer>
  );
}
