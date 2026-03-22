$(document).ready(function () {
    const $logList = $("#log-list");

    // Theme toggle logic
    $("#theme-toggle").on("click", function () {
        $("body").toggleClass("light-mode");
        const isLight = $("body").hasClass("light-mode");
        $(this).text(isLight ? "Dark Mode" : "Light Mode");
        log("Theme switched to " + (isLight ? "Light" : "Dark") + " Mode");
    });

    // Copy Email Functionality
    $("#copy-email-btn").on("click", function () {
        const email = $(this).data("email");
        const $btn = $(this);
        const originalContent = $btn.html();

        navigator.clipboard.writeText(email).then(function () {
            $btn.text("Copied!");
            $btn.css("background", "var(--text-heading)").css("color", "var(--bg-color)"); // Visual feedback
            log("Email copied to clipboard: " + email);

            setTimeout(function () {
                $btn.html(originalContent); // Restore icon + text
                $btn.css("background", "").css("color", ""); // Restore styles
            }, 2000);
        }).catch(function (err) {
            log("Failed to copy: " + err);
        });
    });

    function log(msg) {
        $logList.append("<li>" + msg + "</li>");
        // Auto-scroll to bottom of log
        const $log = $logList.parent();
        $log.scrollTop($log[0].scrollHeight);
    }

    // Smooth scroll + traversal to highlight active nav link
    // Smooth scroll + traversal to highlight active nav link
    $(".nav-link").on("click", function (e) {
        const targetId = $(this).attr("href");

        // Only prevent default if it's an internal hash link
        if (targetId.startsWith("#")) {
            e.preventDefault();
            const $targetSection = $(targetId);

            $("html, body").animate(
                { scrollTop: $targetSection.offset().top - 70 },
                500
            );

            // DOM traversal: move from clicked link to its siblings
            $(this)
                .parent()          // li
                .siblings()        // other li elements
                .find("a")         // their anchor tags
                .removeClass("active");
            $(this).addClass("active");

            log("Navigated to section: " + targetId + " (used parent(), siblings(), find())");
        }
        // If it's an external link (like 'about.html' or 'index.html#...'), let it navigate normally
    });

    // Filter projects using data attributes + traversal
    $(".filter-btn").on("click", function () {
        const filter = $(this).data("filter");

        // Highlight active filter button using siblings()
        $(this)
            .addClass("active")
            .siblings(".filter-btn")
            .not("#add-project")
            .removeClass("active");

        const $cards = $(".projects-grid").children(".project-card");

        if (filter === "all") {
            $cards.fadeIn(300);
            log("Filter: all projects shown (used children())");
        } else {
            $cards.each(function () {
                const type = $(this).data("type");
                if (type === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(200);
                }
            });
            log("Filter: showing '" + filter + "' projects (used children(), each(), data())");
        }
    });

    // Dynamically add a demo project (DOM creation + append + next/prev)
    $("#add-project").on("click", function () {
        const $grid = $(".projects-grid");
        const count = $grid.children(".project-card").length + 1;

        const $newCard = $("<article>")
            .addClass("project-card glass")
            .attr("data-type", "web")
            .html(`
            <span class="project-tag">Web</span>
            <h3>Demo Project #${count}</h3>
            <p>Created dynamically with jQuery DOM manipulation and traversal methods.</p>
          `);

        // Insert after the last card using traversal
        $grid.children(".project-card").last().after($newCard);
        log("Added Demo Project #" + count + " (used children(), last(), after())");

        // Brief highlight effect using CSS manipulation
        $newCard
            .css("border-color", "var(--text-main)")
            .delay(800)
            .queue(function (next) {
                $(this).css("border-color", "var(--glass-border)");
                next();
            });
    });

    // Contact form: prevent submit, manipulate DOM, log data
    $(".contact-form").on("submit", function (e) {
        e.preventDefault();

        const $form = $(this);
        const name = $form.find("#name").val();
        const email = $form.find("#email").val();
        const message = $form.find("#message").val();

        console.log("Form submission:", { name, email, message });
        log("Form submitted by " + name + " (" + email + ") (used find(), val())");

        // DOM updates
        $("#success-msg").fadeIn(300);
        $form.find("input, textarea").val(""); // clear fields using find()

        // Use parent() to highlight section briefly
        $form
            .parent() // section#contact
            .css("border-color", "var(--text-main)")
            .delay(800)
            .queue(function (next) {
                $(this).css("border-color", "var(--glass-border)");
                next();
            });

        log("Form cleared and section highlighted (used parent(), css(), find())");
    });

    // Demonstrate children() and eq() on skills
    const firstSkill = $(".skills-list").children().eq(0).text();
    log("First listed skill: " + firstSkill + " (used children(), eq(), text())");

    // Demonstrate next() and prev() on project cards
    $(".project-card").on("click", function () {
        const $card = $(this);
        const $nextCard = $card.next();
        const $prevCard = $card.prev();

        if ($nextCard.length) {
            log("Next project: " + $nextCard.find("h3").text() + " (used next(), find())");
        }
        if ($prevCard.length) {
            log("Previous project: " + $prevCard.find("h3").text() + " (used prev(), find())");
        }
    });

    // Set year in footer using text()
    $("#year").text(new Date().getFullYear());
    log("Year set in footer: " + new Date().getFullYear() + " (used text())");

    // Demonstrate closest() - find closest section when clicking anywhere
    $("main").on("click", function (e) {
        const $closestSection = $(e.target).closest("section");
        if ($closestSection.length && !$(e.target).closest("button, a, input, textarea").length) {
            // Only log occasionally to avoid spam
            if (Math.random() > 0.95) {
                log("Clicked in section: " + $closestSection.attr("id") + " (used closest())");
            }
        }
    });
});
