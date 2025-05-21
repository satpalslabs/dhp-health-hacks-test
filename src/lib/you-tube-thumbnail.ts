function youtube_parser(url: string): string {
    const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const _url = match && match[7].length == 11 ? match[7] : "";
    return "https://img.youtube.com/vi/" + _url + "/mqdefault.jpg"
}
export default youtube_parser;

export function getYouTubeVideoId(url: string): string | null {
    const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}