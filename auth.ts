import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Session } from "next-auth";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const rawConfiguredAuthUrl =
  process.env.AUTH_URL?.replace(/\/$/, "") ??
  process.env.NEXTAUTH_URL?.replace(/\/$/, "");
const isProduction = process.env.NODE_ENV === "production";

function getSafeConfiguredAuthUrl() {
  if (!rawConfiguredAuthUrl) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(rawConfiguredAuthUrl);
    const isLocalHost =
      parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";

    if (isProduction && isLocalHost) {
      return undefined;
    }

    return rawConfiguredAuthUrl;
  } catch {
    return undefined;
  }
}

const configuredAuthUrl = getSafeConfiguredAuthUrl();
const hasGoogleOAuthConfig = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);
const isLocalAuthBypassEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.AUTH_BYPASS_LOCAL === "true";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  trustHost: true,
  providers: hasGoogleOAuthConfig
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : [],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const effectiveBaseUrl = configuredAuthUrl ?? baseUrl;

      // Guard against invalid callback URLs that can produce /undefined in cloud.
      if (!url || url === "undefined") {
        return `${effectiveBaseUrl}/api/auth/signin?callbackUrl=%2F`;
      }

      if (url.startsWith("/")) {
        return `${effectiveBaseUrl}${url}`;
      }

      try {
        const target = new URL(url);
        if (target.origin === effectiveBaseUrl) {
          return url;
        }
      } catch {
        return `${effectiveBaseUrl}/api/auth/signin?callbackUrl=%2F`;
      }

      return effectiveBaseUrl;
    },
  },
});

export async function getSession() {
  if (isLocalAuthBypassEnabled) {
    const localSession: Session = {
      user: {
        name: "Local Developer",
        email: "local@example.dev",
        image:
          "https://ui-avatars.com/api/?name=Local+Developer&background=0f766e&color=ffffff",
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    return localSession;
  }

  return auth();
}

export { isLocalAuthBypassEnabled };
