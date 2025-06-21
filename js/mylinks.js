"use strict"

import RequestBuilder, { HttpStatus } from "./requests-util.js";

class Entry {
    constructor(obj) {
        this.url = obj.url;
        this.icon = obj.icon;
        this.alt = obj.platform;
        this.text = obj.username;
    }
}

async function getLinks() {
    const request = new RequestBuilder()
        .url("https://www.ancliz.me:25666/public/mylinks.json")
        .build();
    const response = await request();
    if(response.status === HttpStatus.OK) {
        return response.json().then(data => {
            return data.map(item => new Entry(item));
        });
    } else {
        console.error((await response.json()).message);
    }
    return undefined;
}

async function createLinks() {
    const entries = await getLinks();
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