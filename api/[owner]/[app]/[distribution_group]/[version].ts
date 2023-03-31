export const config = {
  runtime: "edge",
};

interface AppCenterPublicRelease {
  id: number | string;
  short_version: string;
  version: string;
}

interface AppCenterPublicReleaseDownloadInfo {
  download_url: string;
}

const urls = {
  getPublicReleases: ({
    owner,
    app,
    distributionGroup,
  }: {
    owner: string;
    app: string;
    distributionGroup: string;
  }) =>
    `https://install.appcenter.ms/api/v0.1/apps/${owner}/${app}/distribution_groups/${distributionGroup}/public_releases`,

  getPublicRelease: ({
    owner,
    app,
    distributionGroup,
    releaseId,
  }: {
    owner: string;
    app: string;
    distributionGroup: string;
    releaseId: number | string;
  }) =>
    `https://install.appcenter.ms/api/v0.1/apps/${owner}/${app}/distribution_groups/${distributionGroup}/releases/${releaseId}`,
};

const get = <T>(url: string): Promise<T> =>
  fetch(url).then((response) => response.json());

const handler = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const owner = searchParams.get("owner")!;
  const app = searchParams.get("app")!;
  const distributionGroup = searchParams.get("distribution_group")!;
  const version = searchParams.get("version")!;

  const releases = await get<AppCenterPublicRelease[]>(
    urls.getPublicReleases({ owner, app, distributionGroup })
  );

  const { id: releaseId } =
    releases.find(
      (x) => x.version === version || x.short_version === version
    ) || {};

  if (!releaseId) {
    return new Response(
      JSON.stringify({
        error: "public release not found.",
      }),
      {
        status: 404,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const release = await get<AppCenterPublicReleaseDownloadInfo>(
    urls.getPublicRelease({ owner, app, distributionGroup, releaseId })
  );

  return Response.redirect(release.download_url);
};

export default handler;
