"use strict"

import { RequestBuilder, httpException, HttpStatus } from "https://www.ancliz.me:25666/public/ankyjs/0.0.1/library.esm.js";

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
    }
    throw new httpException(response.status, await response.json().message)
}

async function createLinks() {
    const element = document.getElementById("my-links");
    element.innerHTML = "";
    try {
        const entries = await getLinks();
        const fragment = document.createDocumentFragment();
            
        entries.forEach(entry => {
            const anchor = document.createElement('a');
            anchor.href = entry.url;
            anchor.target = "_blank";
            anchor.className = `flex items-center py-2 px-4 rounded-lg
                                transition duration-300
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
    } catch(error) {
        return { error, element }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const result = await createLinks();
    if(result?.error) {
        console.error(result.error.message);
        const message = document.createElement("div");
        message.className = `flex flex-col justify-center items-center
                                    text-center h-screen text-4xl font-bold
                                    text-gray-300`;
        message.innerHTML = "Failed to load page.<br>Please try again later.";
        result.element.appendChild(message);
    }    
});