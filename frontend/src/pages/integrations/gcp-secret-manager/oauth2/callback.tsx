import { useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import {
  useAuthorizeIntegration
} from "@app/hooks/api";

export default function GCPSecretManagerOAuth2CallbackPage() {
    console.log("GCPSecretManagerOAuth2CallbackPage");
    const router = useRouter();
    const { mutateAsync } = useAuthorizeIntegration();

    const { code, state } = queryString.parse(router.asPath.split("?")[1]);

  useEffect(() => {
    (async () => {
      try {
        // validate state
        
        console.log("gcp oauth2 callback page");
        console.log("gcp oauth2 callback page code: ", code);
        console.log("gcp oauth2 callback page state: ", state);

        if (state !== localStorage.getItem("latestCSRFToken")) return;
        localStorage.removeItem("latestCSRFToken");
        const integrationAuth = await mutateAsync({
          workspaceId: localStorage.getItem("projectData.id") as string,
          code: code as string,
          integration: "gcp-secret-manager"
        });
        
        console.log("integrationAuth: ", integrationAuth);

        router.push(`/integrations/gcp-secret-manager/create?integrationAuthId=${integrationAuth._id}`);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return <div />;
}

GCPSecretManagerOAuth2CallbackPage.requireAuth = true;
