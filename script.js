document.addEventListener("DOMContentLoaded", () => {
    
   
    const overlay = document.getElementById("transition-overlay");
    const links = document.querySelectorAll(".transition-link");

    // Slide+fade in when page loads
    requestAnimationFrame(() => {
        document.body.classList.add("loaded");
    });

    // Helper function to handle outgoing transitions safely
    function handlePageExit(targetUrl) {
        if (overlay) {
            overlay.classList.add("active");
        }
        document.body.classList.remove("loaded");

        // Wait for the CSS animation finish (600ms) before changing page
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 600);
    }

    // Trigger transition when clicking normal header/footer transition-links
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const href = this.getAttribute("href");
            if (href) handlePageExit(href);
        });
    });


    const projects = document.querySelectorAll(".mae[data-project]");

    projects.forEach(project => {
        project.addEventListener("click", (e) => {
            // Ignore if they somehow clicked an actual link anchor deep inside
            if (e.target.tagName === 'A') return;

            const projectKey = project.getAttribute("data-project");
            if (projectKey && galleryData[projectKey]?.images?.length) {
                // Generates destination url and funnels it through the transition animation
                const targetUrl = `gallery.html?project=${projectKey}`;
                handlePageExit(targetUrl);
            }
        });
    });


    const galleryData = {

        "pensarMenos": {
            title: "pensarMenos Type",
            text:"Typography made for the 'Pensar Menos' postcards, music and photos by Oscar Correia.",
            images: ["./imgsGallery/eclipture1.jpg", "./imgsGallery/eclipture2.jpg", "./imgsGallery/eclipture3.jpg", "./imgsGallery/eclipture4.jpg", "./imgsGallery/eclipture5.jpg"]
        },
        "eclipture": {
            title: "eclipture posters",
            images: ["./imgsGallery/eclipture1.jpg", "./imgsGallery/eclipture2.jpg", "./imgsGallery/eclipture3.jpg", "./imgsGallery/eclipture4.jpg", "./imgsGallery/eclipture5.jpg"]
        },
        "aovivo_aviao": {
            title: "aovivo_aviao",
            text: "Animation and posters for a couple of shows at Avião, Bairro Alto.",
            images: ["./imgsGallery/aviao_live_martim_2.jpg", "./imgsGallery/aviao_live_oscar.jpg", "./imgsGallery/aviao_live_rebenta.jpg", "./imgsGallery/aovivo_2.mp4"]
        },
        "chaos": {
            title: "CNTRL+CHAOS Magazine, 2025",
            text:"CTRL + CHAOS. Is Anarchy a utopia or merely a tool for spiritual or political liberation? Either way, it is certainly a stance toward art and Design. We believe that today, more than ever, it is important to be at least minimally Anarchic, especially if we work in the arts. Questioning social, political, and artistic norms is what distinguishes interesting Design from uninteresting Design. Anarchic aesthetics are those that refuse to follow trends, algorithms, or predictable briefs. It is Design born from the urgency of expression, rather than the need to please. It is understanding that every creative gesture is an affirmation of freedom—and, therefore, of responsibility. Anarchy, in this sense, is not chaos, but the refusal of blind obedience. Design, when aware of its power, can be a tool for emancipation. A piece of Design can and should be a political act. Choosing what to communicate, how to communicate, and to whom to communicate defines which side of history the Designer chooses to stand on. In this publication, we aim to showcase two groups (The Black Mask and Up Against The Wall Motherfuckers and Adbusters), from different decades, who were influential in the thinking and making of Anarchic Design. In order to reinforce the Anarchic ideas of these groups, we have included other case studies as secondary articles that fall within the scope of Anarchic Design.",
            images: ["./imgsGallery/chaos_1.jpeg", "./imgsGallery/chaos_2.jpeg", "./imgsGallery/chaos_3.jpeg", "./imgsGallery/chaos_4.jpeg", "./imgsGallery/publicacao_anarca_DC.jpg", "./imgsGallery/publicacao_anarca_DC2.jpg", "./imgsGallery/publicacao_anarca_DC3.jpg", "./imgsGallery/publicacao_anarca_DC4.jpg", "./imgsGallery/publicacao_anarca_DC5.jpg", "./imgsGallery/publicacao_anarca_DC6.jpg", "./imgsGallery/publicacao_anarca_DC7.jpg", "./imgsGallery/publicacao_anarca_DC8.jpg", "./imgsGallery/publicacao_anarca_DC9.jpg", "./imgsGallery/publicacao_anarca_DC10.jpg", "./imgsGallery/publicacao_anarca_DC11.jpg", "./imgsGallery/publicacao_anarca_DC12.jpg" ]
        },
        "workart": {
            title: "Motion Graphic, 2025",
            images: ["../imgs/workArt.gif"]
        },
        
    };
   
    projectData.images.forEach(src => {
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
    
      if (isVideo) {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true; // or autoplay, muted, loop, playsinline
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        container.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = src;
        container.appendChild(img);
      }
    });

    projects.forEach(project => {
        const projectData = galleryData[project.getAttribute("data-project")];
        const image = project.querySelector("img");

        if (!projectData?.images?.length || !image) return;

        project.classList.add("has-gallery");

        const imageWrap = document.createElement("span");
        imageWrap.className = "project-image-wrap";
        image.before(imageWrap);
        imageWrap.appendChild(image);

        const indicator = document.createElement("span");
        indicator.className = "gallery-indicator";
        indicator.textContent = "*";
        indicator.setAttribute("aria-label", "More project content");
        imageWrap.appendChild(indicator);

        const positionIndicator = () => {
            const projectRect = project.getBoundingClientRect();

            if (window.matchMedia("(max-width: 600px)").matches) {
                const textRect = project.querySelector("#texto1").getBoundingClientRect();
                indicator.style.left = "";
                indicator.style.right = "0px";
                indicator.style.top = `${textRect.top - projectRect.top}px`;
                return;
            }

            const imageRect = image.getBoundingClientRect();
            indicator.style.right = "";
            indicator.style.left = `${imageRect.right - projectRect.left + 8}px`;
            indicator.style.top = `${imageRect.top - projectRect.top}px`;
        };

        positionIndicator();
        image.addEventListener("load", positionIndicator);
        window.addEventListener("resize", positionIndicator);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const activeProjectKey = urlParams.get('project');
    const imageContainer = document.getElementById("gallery-content");

    if (imageContainer) {
        if (activeProjectKey && galleryData[activeProjectKey]) {
            const project = galleryData[activeProjectKey];

            if (typeof project.text === "string" && project.text.trim()) {
                const description = document.createElement("p");
                description.className = "gallery-description";
                description.textContent = project.text;
                imageContainer.appendChild(description);
            }

            project.images.forEach(imagePath => {
                const imgElement = document.createElement("img");
                imgElement.loading = "lazy";
                imgElement.decoding = "async";
                imgElement.src = imagePath;
                imgElement.alt = project.title;
                imgElement.style.width = "60%";
                imgElement.style.display = "block";
                imgElement.style.marginBottom = "25px";
                imageContainer.appendChild(imgElement);
            });
        }
    }


    const movingImage = document.querySelector(".detail-moving-image");

    if (movingImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const moveImage = (instant = false) => {
            const maxLeft = Math.max(0, window.innerWidth - movingImage.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - movingImage.offsetHeight);

            if (instant) {
                movingImage.style.transition = "none";
            }

            if (window.matchMedia("(max-width: 600px)").matches) {
                const padding = 12;
                const corners = [
                    [padding, padding],
                    [maxLeft - padding, padding],
                    [padding, maxTop - padding],
                    [maxLeft - padding, maxTop - padding]
                ];
                const [left, top] = corners[Math.floor(Math.random() * corners.length)];

                movingImage.style.left = `${Math.max(0, left)}px`;
                movingImage.style.top = `${Math.max(0, top)}px`;

                if (instant) {
                    movingImage.offsetWidth;
                    requestAnimationFrame(() => {
                        movingImage.style.transition = "";
                    });
                }
                return;
            }

            movingImage.style.left = `${Math.random() * maxLeft}px`;
            movingImage.style.top = `${Math.random() * maxTop}px`;

            if (instant) {
                movingImage.offsetWidth;
                requestAnimationFrame(() => {
                    movingImage.style.transition = "";
                });
            }
        };

        const scheduleNextMove = () => {
            moveImage();
            window.setTimeout(scheduleNextMove, 4000 + Math.random() * 3000);
        };

        if (movingImage.complete && movingImage.naturalWidth > 0) {
            scheduleNextMove();
        } else {
            movingImage.addEventListener("load", scheduleNextMove, { once: true });
        }

        window.addEventListener("resize", () => moveImage(true));
    }


    
    const cursor = document.getElementById("custom-cursor");

    if (cursor) {
        document.addEventListener("mousemove", (e) => {
            // Combines tracking coordinates and centering corrections into one calculation string
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

            createTrailDot(e.clientX, e.clientY);
        });
    }

    function createTrailDot(x, y) {
        const dot = document.createElement("div");
        dot.className = "trail-dot";
        
        // Centers each trail dot exactly where your mouse was located
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        
        document.body.appendChild(dot);

        setTimeout(() => {
            dot.remove();
        }, 600);
    }

});

window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    document.body.classList.add("loaded");
    document.getElementById("transition-overlay")?.classList.remove("active");
});
