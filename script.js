document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. PAGE TRANSITIONS (SLIDE + FADE IN/OUT)
    // ==========================================
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


    // ==========================================
    // 2. PORTFOLIO GRID CLICKS (MAIN PAGE)
    // ==========================================
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


    // ==========================================
    // 3. DYNAMIC GALLERY LOADER (GALLERY PAGE)
    // ==========================================
    const galleryData = {
        
        "chaos": {
            title: "CNTRL+CHAOS Magazine, 2025",
            images: ["../imgs/cntrlChaos.gif"]
        },
        "workart": {
            title: "Motion Graphic, 2025",
            images: ["../imgs/workArt.gif"]
        },
        
    };

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


    // ==========================================
    // 4. RANDOM DETAIL-PAGE IMAGE MOVEMENT
    // ==========================================
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


    // ==========================================
    // 5. CUSTOM CIRCLE MOUSE TRAIL
    // ==========================================
    // ==========================================
    // 4. CUSTOM CIRCLE MOUSE TRAIL (PERFECT ALIGNMENT)
    // ==========================================
    // ==========================================
    // 4. CUSTOM CIRCLE MOUSE TRAIL (PERFECT CENTERED ALIGNMENT)
    // ==========================================
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
