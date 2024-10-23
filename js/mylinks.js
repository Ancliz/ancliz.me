class Entry {
    constructor(url, icon, alt, text) {
        this.url = url;
        this.icon = icon;
        this.alt = alt;
        this.text = text;
    }
}

function createLinks() {
    const entries = [
        new Entry("https://github.com/Ancliz", "../ico/github-mark-white.png", "GitHub", "ancliz"),
        new Entry("https://bsky.app/profile/ancliz.bsky.social", "../ico/bluesky-social.png", "Bluesky", "ancliz"),
        new Entry("https://www.youtube.com/@Ancliz", "../ico/youtube-2.png", "Youtube", "ancliz"),
        new Entry("https://x.com/AncliziL", "../ico/x-logo-white.png", "X (Twitter)", "anclizil")
    ]

    const element = document.getElementById("my-links");
    const fragment = document.createDocumentFragment();

    entries.forEach(entry => {
        const anchor = document.createElement('a');
        anchor.href = entry.url;
        anchor.target = "_blank";
        anchor.className = `flex items-center py-2 px-4 rounded-lg transition duration-300
                            transform hover:text-white hover:scale-105
                            text-gray-300 text-4xl font-bold`

        const img = document.createElement("img");
        img.src = entry.icon;
        img.alt = entry.alt;
        img.className = "h-8 w-8 mr-4";

        anchor.appendChild(img);
        anchor.appendChild(document.createTextNode(entry.text));
        fragment.appendChild(anchor);
    });

    element.appendChild(fragment);

}

document.addEventListener('DOMContentLoaded', () => {
   createLinks();
});