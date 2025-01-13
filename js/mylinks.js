"use strict"

import { RequestBuilder } from "./requests-util.js";

class Entry {
    constructor(url, icon, alt, text) {
        this.url = url;
        this.icon = icon;
        this.alt = alt;
        this.text = text;
    }
}

async function getLinks(sourceUrl) {
    const request = new RequestBuilder().url(sourceUrl).build();
    const response = await request();
    const subject = await response.json();

    return subject.map(subjectData =>
        new Entry(subjectData.url, subjectData.icon_src, subjectData.platform, subjectData.handle)
    );
}

async function createLinks(source) {

    const entries = await getLinks(source);

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
	// When backend implemented, will be set to endpoint
	createLinks("../links.json");
});
