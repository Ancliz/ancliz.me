export default class Debug {
    static BITMASK = (1 << 2) - 1;
    static PARTICLE_DEBUG = 1 << 0;
    static MOUSE_DEBUG = 1 << 1;

    #setupParticle(overlay) {
        const particleDiv = document.createElement("div");
        particleDiv.id = "debug-overlay-particle";
        overlay.appendChild(particleDiv);
    }

    #setupMouse(overlay) {
        const mouseDiv = document.createElement("div");
        mouseDiv.id = "debug-overlay-mouse";
        overlay.appendChild(mouseDiv);

        document.addEventListener("mousemove", (event) => {
            const overlay = document.getElementById("debug-overlay-mouse");
            overlay.innerHTML = `
                <h4>Mouse Info</h4>
                <p>Position: (${event.clientX.toFixed(2)}, ${event.clientY.toFixed(2)})</p>
            `;
        });
    }

    constructor(flags) {
        if(flags) {
            let overlay = document.createElement("div");
            overlay.id = "debug-overlay";
            overlay.style.position = "absolute";
            overlay.style.top = "10px";
            overlay.style.right = "10px";
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
            overlay.style.color = "white";
            overlay.style.padding = "10px";
            overlay.style.borderRadius = "5px";
            overlay.style.zIndex = "1000";
            
            const methods = new Map();
            methods.set(1, this.#setupParticle);
            methods.set(2, this.#setupMouse);

            flags &= Debug.BITMASK;

            for(let i = flags; i > 0; i--) {
                if(flags & i) {
                    if(methods.get(i) !== undefined) {
                        methods.get(i).call(this, overlay);
                    }
                }
            }
                        
            document.body.appendChild(overlay);
        }
    }
    
    static debugParticle(particle) {
        const overlay = document.getElementById("debug-overlay-particle");
        if(overlay) {
            overlay.innerHTML = `
                <h4>Particle Info</h4>
                <p>Position: (${particle.coords.x.toFixed(3)}, ${particle.coords.y.toFixed(3)})</p>
                <p>Speed X: ${particle.speedX.toFixed(3)}</p>
                <p>Speed Y: ${particle.speedY.toFixed(3)}</p>
                <p>Size: ${particle.size.toFixed(2)}</p>
            `;  
        }
    }
    
}