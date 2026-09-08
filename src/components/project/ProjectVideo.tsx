/**
 * Project video. Embeds an iframe for provider embed URLs (YouTube, Vimeo, Mux
 * player) and falls back to a <video> for direct .mp4/.webm links. Renders
 * nothing if no URL. Editors paste an embeddable URL in Studio.
 */
export function ProjectVideo({ url }: { url?: string }) {
  if (!url) return null;
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url);

  return (
    <div className="mt-12">
      <div className="bg-line relative aspect-video w-full overflow-hidden rounded-lg">
        {isFile ? (
          <video controls className="h-full w-full" src={url} />
        ) : (
          <iframe
            src={url}
            title="Project video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
