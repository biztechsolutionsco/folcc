
/* ================================================================
   FOUNTAIN OF LIFE CHRISTIAN CHURCH — SHARED MAIN JAVASCRIPT
   English pages: /                 Chinese pages: /zh/
   Shared: /includes/, /css/, /js/, /documents/devotion/
================================================================ */
(() => {
    "use strict";

    const isChinese = document.documentElement.lang.toLowerCase().startsWith("zh");
    const siteRoot = document.querySelector('meta[name="site-root"]')?.content || (isChinese ? "../" : "./");
    const pageBase = siteRoot + (isChinese ? "zh/" : "");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const i18n = {
        en: {
            top: "Welcome to Fountain of Life Christian Church",
            give: "Give",
            home: "Home",
            about: "About",
            aboutChurch: "About Our Church",
            coreValues: "Core Values",
            ministryTeam: "Ministry Team",
            new: "New Here?",
            services: "Worship",
            devotion: "Devotion",
            bibleReadingPlan: "Bible Reading Plan",
            bibleResources: "Bible Reference Materials",
            bibleVideos: "Bible Teaching Videos",
            contact: "Contact",
            donate: "Donate",
            churchDesc: "Professional church fellowship and a welcoming community rooted in God's Word.",
            explore: "Explore",
            visit: "Visit Us",
            hours: "Saturday, 10:00 AM – 1:00 PM",
            contactUs: "Contact Us",
            worshipServices: "Worship Services"
        },
        zh: {
            top: "歡迎來到生命泉靈糧教會",
            give: "奉獻",
            home: "首頁",
            about: "關於我們",
            aboutChurch: "教會簡介",
            coreValues: "核心價值",
            ministryTeam: "教會團隊",
            new: "新人專區",
            services: "崇拜聚會",
            devotion: "每日靈修",
            bibleReadingPlan: "每日讀經進度表",
            bibleResources: "聖經參考資料",
            bibleVideos: "聖經教學影片",
            contact: "聯絡我們",
            donate: "奉獻",
            churchDesc: "以神的話語為根基，在愛中彼此扶持，一同成長的屬靈家庭。",
            explore: "探索網站",
            visit: "歡迎來訪",
            hours: "每週六 上午10:00至下午1:00",
            contactUs: "聯絡我們",
            worshipServices: "崇拜聚會"
        }
    };
    
    const t = i18n[isChinese ? "zh" : "en"];

    function translate(container) {
        container.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;
            if (Object.hasOwn(t, key)) element.textContent = t[key];
        });
    }
    
    function localizeNavigation(container) {

        translate(container);

        // ==========================================
        // NAVIGATION LINKS
        // ==========================================
        container.querySelectorAll("[data-route]").forEach(link => {

            const route = link.dataset.route.replace(/^\.?\//, "");

            link.href = pageBase + route;

            if (route === currentPage) {
                link.setAttribute("aria-current", "page");
                link.closest(".nav-dropdown")?.classList.add("active");
            }

        });

        // ==========================================
        // HOMEPAGE LINKS
        // ==========================================
        container.querySelectorAll("[data-home]").forEach(link => {
            link.href = pageBase + "index.html";
        });

        // ==========================================
        // SHARED LOGO PATHS
        // ==========================================
        container.querySelectorAll(".site-logo").forEach(image => {

            const original = image.getAttribute("src") || "";

            if (original.startsWith("/images/")) {
                image.src = siteRoot + original.slice(1);
            } else if (original.startsWith("images/")) {
                image.src = siteRoot + original;
            }

        });

        // ==========================================
        // BILINGUAL PAGES
        // ==========================================
        const bilingualPages = new Set([
            "index.html",
            "about.html",
            "core-values.html",
            "ministry-team.html",
            "new-here.html",
            "services.html",
            "contact.html",
            "bible-reading-plan.html",
            "bible-resources.html",
            "bible-videos.html"
        ]);

        // ==========================================
        // LANGUAGE SWITCHER
        // ==========================================
        container
            .querySelectorAll(
                "#language-switch, [data-language-switch]"
            )
            .forEach(switcher => {

                const destination = bilingualPages.has(currentPage)
                    ? currentPage
                    : "index.html";

                switcher.href = isChinese
                    ? siteRoot + destination
                    : siteRoot + "zh/" + destination;

                switcher.textContent = isChinese
                    ? "English"
                    : "中文";

                switcher.setAttribute(
                    "hreflang",
                    isChinese ? "en" : "zh-Hant"
                );

            });

        // ==========================================
        // CURRENT YEAR
        // ==========================================
        container
            .querySelectorAll("#year, [data-current-year]")
            .forEach(el => {
                el.textContent = new Date().getFullYear();
            });

    }


    async function loadComponent(id, filename) {
        const mount = document.getElementById(id);
        if (!mount) return;
        try {
            const response = await fetch(siteRoot + "includes/" + filename);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            mount.innerHTML = await response.text();
            localizeNavigation(mount);
        } catch (error) {
            console.error(`Unable to load ${filename}:`, error);
        }
    }

    function initializeHeader() {
        const toggle = document.getElementById("menu-toggle") || document.querySelector(".menu-button");
        const navigation = document.getElementById("nav-links") || document.querySelector(".nav-links");
        if (!navigation) return;

        if (toggle) {
            toggle.addEventListener("click", () => {
                const isOpen = navigation.classList.toggle("open");
                toggle.setAttribute("aria-expanded", String(isOpen));
            });
        }

        const dropdowns = [...navigation.querySelectorAll("details.nav-dropdown")];
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener("toggle", () => {
                if (dropdown.open) {
                    dropdowns.forEach(other => {
                        if (other !== dropdown) other.open = false;
                    });
                }
            });
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                if (window.matchMedia("(max-width: 960px)").matches) {
                    navigation.classList.remove("open");
                    toggle?.setAttribute("aria-expanded", "false");
                }
            });
        });

        document.addEventListener("click", event => {
            if (!navigation.contains(event.target)) dropdowns.forEach(d => { d.open = false; });
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                dropdowns.forEach(d => { d.open = false; });
                navigation.classList.remove("open");
                toggle?.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* =================== MONTHLY PDF VIEWER =================== */
    function initializeDevotionViewer() {
        const monthButtons = [...document.querySelectorAll(".devotion-month[data-month]")];
        const pdfFrame = document.getElementById("devotion-pdf");
        if (!monthButtons.length || !pdfFrame) return;

        const pdfContainer = document.getElementById("devotion-pdf-container");
        const unavailable = document.getElementById("devotion-pdf-unavailable");
        const actions = document.getElementById("devotion-pdf-actions");
        const monthTitle = document.getElementById("devotion-month-title");
        const monthDescription = document.getElementById("devotion-month-description");
        const currentLabel = document.getElementById("devotion-current-label");
        const downloadLink = document.getElementById("devotion-download");
        const fullscreenLink = document.getElementById("devotion-fullscreen");

        const monthNames = isChinese
            ? ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const pdfFolder = siteRoot + "documents/devotion/" + (isChinese ? "zh/" : "");
        const currentMonth = new Date().getMonth() + 1;

        function showMonth(monthNumber) {
            if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) return;
            const monthFile = String(monthNumber).padStart(2, "0");
            const monthName = monthNames[monthNumber - 1];
            const pdfPath = pdfFolder + monthFile + ".pdf";

            monthButtons.forEach(button => {
                const active = Number(button.dataset.month) === monthNumber;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            if (monthTitle) monthTitle.textContent = isChinese
                ? `${monthName}每日讀經進度表`
                : `${monthName} Bible Reading Plan`;
            if (monthDescription) monthDescription.textContent = isChinese
                ? "您可以直接閱讀或下載這個月份的讀經進度表。"
                : "View or download this month's Bible reading plan.";
            if (currentLabel) {
                currentLabel.hidden = monthNumber !== currentMonth;
                currentLabel.textContent = isChinese ? "本月" : "Current Month";
            }
            if (unavailable) unavailable.hidden = true;
            if (pdfContainer) pdfContainer.hidden = false;
            if (actions) actions.hidden = false;

            // Load the PDF directly. A HEAD preflight previously blocked
            // switching months on some servers and is intentionally omitted.
            pdfFrame.src = pdfPath + "#pagemode=none&navpanes=0&view=FitH&toolbar=1";
            pdfFrame.title = `${monthName} ${isChinese ? "讀經進度表" : "Bible Reading Plan"}`;
            if (downloadLink) {
                downloadLink.href = pdfPath;
                downloadLink.download = `FOLCC-${monthFile}${isChinese ? "-Chinese" : "-English"}.pdf`;
                downloadLink.textContent = isChinese ? "下載 PDF ↓" : "Download PDF ↓";
            }
            if (fullscreenLink) {
                fullscreenLink.href = pdfPath;
                fullscreenLink.textContent = isChinese ? "在新分頁開啟 PDF ↗" : "Open PDF in New Tab ↗";
            }
        }

        monthButtons.forEach(button => {
            button.addEventListener("click", () => showMonth(Number(button.dataset.month)));
        });
        showMonth(currentMonth);
    }

    /* =================== BIBLE REFERENCE LIBRARY =================== */
    const resources = [
        {title:"10 Things You Should Know about the Pentateuch",testament:"old",type:"PDF",url:"https://folcc.ca/wp-content/uploads/2024/01/240101-10-Things-You-Should-Know-about-the-Pentateuch.pdf"},
        {title:"Introduction to Genesis",testament:"old",type:"PDF",url:"https://folcc.ca/wp-content/uploads/2024/01/240101-Introduction-to-Genesis.pdf"},
        {title:"Introduction to Exodus",testament:"old",url:"https://insight.org/resources/bible/the-pentateuch/exodus"},
        {title:"Introduction to Leviticus",testament:"old",url:"https://insight.org/resources/bible/the-pentateuch/leviticus"},
        {title:"Book of Numbers Overview",testament:"old",url:"https://insight.org/resources/bible/the-pentateuch/numbers"},
        {title:"Book of First Samuel Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/first-samuel"},
        {title:"Book of Second Samuel Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/second-samuel"},
        {title:"Book of First Kings Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/first-kings"},
        {title:"Book of Second Kings Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/second-kings"},
        {title:"Book of Second Chronicles Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/second-chronicles"},
        {title:"Book of Ezra Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/ezra"},
        {title:"Book of Nehemiah Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/nehemiah"},
        {title:"Book of Esther Overview",testament:"old",url:"https://insight.org/resources/bible/the-historical-books/esther"},
        {title:"Book of Job Overview",testament:"old",url:"https://insight.org/resources/bible/the-wisdom-books/job"},
        {title:"Book of Ecclesiastes Overview",testament:"old",url:"https://insight.org/resources/bible/the-wisdom-books/ecclesiastes"},
        {title:"Book of Lamentations Overview",testament:"old",url:"https://insight.org/resources/bible/the-major-prophets/lamentations"},
        {title:"Book of Hosea Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/hosea"},
        // Joel was previously linked to the entire old WordPress page;
        // omitted until a direct resource URL can be confirmed.
        {title:"Book of Jonah Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/jonah"},
        {title:"Book of Obadiah Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/obadiah"},
        {title:"Book of Micah Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/micah"},
        {title:"Book of Nahum Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/nahum"},
        {title:"Book of Habakkuk Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/habakkuk"},
        {title:"Book of Zephaniah Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/zephaniah"},
        {title:"Book of Haggai Overview",testament:"old",url:"https://insight.org/resources/bible/the-minor-prophets/haggai"},
        {title:"Book of Matthew Overview",testament:"new",url:"https://insight.org/resources/bible/the-gospels/matthew"},
        {title:"Introduction to Mark",testament:"new",type:"PDF",url:"https://folcc.ca/wp-content/uploads/2024/01/240119-Introduction-to-Mark.pdf"},
        {title:"Book of Luke Overview",testament:"new",url:"https://insight.org/resources/bible/the-gospels/luke"},
        {title:"Introduction to Acts",testament:"new",url:"https://insight.org/resources/bible/the-history-of-the-early-church/acts"},
        {title:"Book of Romans Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/romans"},
        {title:"Book of First Corinthians Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/first-corinthians"},
        {title:"Book of Second Corinthians Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/second-corinthians"},
        {title:"Book of Galatians Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/galatians"},
        {title:"Book of Colossians Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/colossians"},
        {title:"Book of Second Thessalonians Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/second-thessalonians"},
        {title:"Book of Second Timothy Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/second-timothy"},
        {title:"Book of Philemon Overview",testament:"new",url:"https://insight.org/resources/bible/the-pauline-epistles/philemon"},
        {title:"Book of Hebrews",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/hebrews"},
        {title:"Book of First Peter Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/first-peter"},
        {title:"Book of Second Peter Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/second-peter"},
        {title:"Book of First John Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/first-john"},
        {title:"Book of Second John Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/second-john"},
        {title:"Book of Third John Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/third-john"},
        {title:"Book of Jude Overview",testament:"new",url:"https://insight.org/resources/bible/the-general-epistles/jude"}
    ];

    const bibleBookNames = {
        Genesis:"創世記",Exodus:"出埃及記",Leviticus:"利未記",Numbers:"民數記",Deuteronomy:"申命記",
        Joshua:"約書亞記",Judges:"士師記",Ruth:"路得記", "First Samuel":"撒母耳記上",
        "Second Samuel":"撒母耳記下","First Kings":"列王紀上","Second Kings":"列王紀下",
        "First Chronicles":"歷代志上","Second Chronicles":"歷代志下",Ezra:"以斯拉記",
        Nehemiah:"尼希米記",Esther:"以斯帖記",Job:"約伯記",Psalms:"詩篇",Proverbs:"箴言",
        Ecclesiastes:"傳道書","Song of Solomon":"雅歌",Isaiah:"以賽亞書",Jeremiah:"耶利米書",
        Lamentations:"耶利米哀歌",Ezekiel:"以西結書",Daniel:"但以理書",Hosea:"何西阿書",
        Joel:"約珥書",Amos:"阿摩司書",Obadiah:"俄巴底亞書",Jonah:"約拿書",Micah:"彌迦書",
        Nahum:"那鴻書",Habakkuk:"哈巴谷書",Zephaniah:"西番雅書",Haggai:"哈該書",
        Zechariah:"撒迦利亞書",Malachi:"瑪拉基書",Matthew:"馬太福音",Mark:"馬可福音",
        Luke:"路加福音",John:"約翰福音",Acts:"使徒行傳",Romans:"羅馬書",
        "First Corinthians":"哥林多前書","Second Corinthians":"哥林多後書",Galatians:"加拉太書",
        Ephesians:"以弗所書",Philippians:"腓立比書",Colossians:"歌羅西書",
        "First Thessalonians":"帖撒羅尼迦前書","Second Thessalonians":"帖撒羅尼迦後書",
        "First Timothy":"提摩太前書","Second Timothy":"提摩太後書",Titus:"提多書",
        Philemon:"腓利門書",Hebrews:"希伯來書",James:"雅各書",
        "First Peter":"彼得前書","Second Peter":"彼得後書","First John":"約翰一書",
        "Second John":"約翰二書","Third John":"約翰三書",Jude:"猶大書",Revelation:"啟示錄"
    };

    function getResourceTitle(title, chinese = isChinese) {
        if (!chinese) return title;
        if (title === "10 Things You Should Know about the Pentateuch") return "關於摩西五經應認識的十件事";
        const prefix = title.startsWith("Introduction to ") ? "簡介：" : "";
        const suffix = title.endsWith(" Overview") ? "概覽" : "";
        let book = title.replace(/^Introduction to /, "").replace(/^Book of /, "").replace(/ Overview$/, "");
        book = bibleBookNames[book] || book;
        return prefix + book + suffix;
    }

    function initializeResourceLibrary() {
        const grid = document.getElementById("bible-resource-grid");
        if (!grid) return;
        const input = document.getElementById("resource-search-input");
        const buttons = [...document.querySelectorAll(".resource-filter[data-filter]")];
        const count = document.getElementById("resource-count");
        const heading = document.getElementById("resource-results-title");
        const empty = document.getElementById("resource-empty");
        if (!input) return;
        let category = "all";

        function render() {
            const query = input.value.trim().toLocaleLowerCase();
            const matches = resources.filter(resource =>
                (category === "all" || resource.testament === category) &&
                (resource.title + " " + getResourceTitle(resource.title, true)).toLocaleLowerCase().includes(query)
            );
            const fragment = document.createDocumentFragment();
            matches.forEach(resource => {
                const card = document.createElement("article");
                card.className = "resource-library-card";
                const tag = document.createElement("span");
                tag.className = "resource-library-category";
                tag.textContent = resource.testament === "old"
                    ? (isChinese ? "舊約聖經" : "Old Testament")
                    : (isChinese ? "新約聖經" : "New Testament");
                const title = document.createElement("h3");
                title.textContent = getResourceTitle(resource.title);
                const description = document.createElement("p");
                description.textContent = isChinese
                    ? (resource.type === "PDF" ? "PDF 參考文件（英文資源）" : "線上聖經研讀資料（英文資源）")
                    : (resource.type === "PDF" ? "PDF reference document" : "Online Bible study resource");
                const link = document.createElement("a");
                link.href = resource.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = resource.type === "PDF"
                    ? (isChinese ? "開啟 PDF ↗" : "Open PDF ↗")
                    : (isChinese ? "閱讀資料 ↗" : "View Resource ↗");
                card.append(tag, title, description, link);
                fragment.appendChild(card);
            });
            grid.replaceChildren(fragment);
            if (empty) empty.hidden = matches.length > 0;
            if (count) count.textContent = isChinese
                ? `共 ${matches.length} 筆資料`
                : `${matches.length} resource${matches.length === 1 ? "" : "s"}`;
            if (heading) heading.textContent = (isChinese
                ? {all:"全部參考資料",old:"舊約聖經參考資料",new:"新約聖經參考資料"}
                : {all:"All Reference Materials",old:"Old Testament Resources",new:"New Testament Resources"})[category];
        }

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                category = button.dataset.filter;
                buttons.forEach(item => {
                    const active = item === button;
                    item.classList.toggle("active", active);
                    item.setAttribute("aria-pressed", String(active));
                });
                render();
            });
        });
        input.addEventListener("input", render);
        render();
    }

    /* =================== BIBLE VIDEO LIBRARY =================== */
    // Curated IDs from the earlier FOLCC video data. Check each original
    // YouTube link before launch, as owners may remove or restrict videos.
    const videoData = [
        ["Overview of the Old Testament","3y7nN4TVX5Y","old","David Pawson"],
        ["Genesis 1","TdKe0NNHWmY","old","David Pawson"],
        ["Genesis 2","3FQhzYaVk6k","old","David Pawson"],
        ["Genesis 3","5DsSO1pM-fE","old","David Pawson"],
        ["Genesis 4","n2t1p7Zfm2s","old","David Pawson"],
        ["Genesis 5","K26US7y8TyQ","old","David Pawson"],
        ["Genesis 6","Xk7vBiRlzeA","old","David Pawson"],
        ["Exodus 1","S5cEpDlOP9A","old","David Pawson"],
        ["Exodus 2","jiNKP3GlPi4","old","David Pawson"],
        ["Leviticus 1","R4QFF-56NAY","old","David Pawson"],
        ["Leviticus 2","HhZcDGo0AJc","old","David Pawson"],
        ["Numbers 1","e3jOEfaSV1A","old","David Pawson"],
        ["Numbers 2","0L-qZWuTbR8","old","David Pawson"],
        ["1 & 2 Samuel 1","V-gozmcy3PM","old","David Pawson"],
        ["1 & 2 Samuel 2","ULLioZwvdEU","old","David Pawson"],
        ["1 & 2 Kings 1","tjfEgekLD5s","old","David Pawson"],
        ["1 & 2 Kings 2","kkj7q9vI3Zs","old","David Pawson"],
        ["1 & 2 Chronicles","N-Y6TBUWoc0","old","David Pawson"],
        ["Ezra and Nehemiah 1","JS-c9qS8uA8","old","David Pawson"],
        ["Ezra and Nehemiah 2","9q0vg9-p-8E","old","David Pawson"],
        ["Esther","_skPXjv4XZY","old","David Pawson"],
        ["Job 1","mBSKwuVUOfs","old","David Pawson"],
        ["Job 2","XWcWYdo7hXA","old","David Pawson"],
        ["Ecclesiastes","mExfn1kAxLE","old","David Pawson"],
        ["Lamentations","eD4ruTpZ0qk","old","David Pawson"],
        ["Ezekiel 1","xTzc8FoA4i0","old","David Pawson"],
        ["Ezekiel 2","kciYe1lIYvs","old","David Pawson"],
        ["Ezekiel 3","Q7oE5xET8P8","old","David Pawson"],
        ["Hosea","S68kXnzI3xA","old","David Pawson"],
        ["Obadiah and Joel 1","sSD9K55gxkM","old","David Pawson"],
        ["Obadiah and Joel 2","GPsDmK7D55s","old","David Pawson"],
        ["Micah","qhsA1DoYqBw","old","David Pawson"],
        ["Nahum","nPe0-YDFe1I","old","David Pawson"],
        ["Habakkuk","lGYkZtGoXvs","old","David Pawson"],
        ["Zephaniah","S_NEUA55I_U","old","David Pawson"],
        ["Haggai","nRrTR2XVwLQ","old","David Pawson"],
        ["Matthew 1","F2KMYwBRngU","new","David Pawson"],
        ["Matthew 2","DmY9AHaOMEI","new","David Pawson"],
        ["The Newness of Mark's Gospel","Orxxu-gg-dg","new","N. T. Wright"],
        ["Mark","XJVVDqQx3w0","new","David Pawson"],
        ["Luke","miPvZcX811M","new","David Pawson"],
        ["Acts 1","2Z-Hwn_OEpo","new","David Pawson"],
        ["Acts 2","HZm6pk8cGZA","new","David Pawson"],
        ["Romans 1","OpXQbCnMWgA","new","David Pawson"],
        ["Romans 2","TiCXzATXLmo","new","David Pawson"],
        ["1 & 2 Corinthians 1","EyVF6rrQAPE","new","David Pawson"],
        ["1 & 2 Corinthians 2","iis8b_nCYyE","new","David Pawson"],
        ["Galatians 1","dCPYlU_XAfI","new","David Pawson"],
        ["Galatians 2","wlAcBE-3BlQ","new","David Pawson"],
        ["Philippians & Philemon 1","OEMr3lNzMDs","new","David Pawson"],
        ["Philippians & Philemon 2","uj6VvtIQBIU","new","David Pawson"],
        ["Colossians","2XCX__pCeOI","new","David Pawson"],
        ["1 & 2 Thessalonians 1","Q9TObF2wTCQ","new","David Pawson"],
        ["1 & 2 Thessalonians 2","zcPZWRPdsrQ","new","David Pawson"],
        ["Timothy & Titus 1","0j0ovlLp4SU","new","David Pawson"],
        ["Timothy & Titus 2","iljyisQNcVM","new","David Pawson"],
        ["Hebrews 1","kmUXH0_rQuQ","new","David Pawson"],
        ["Hebrews 2","NrW4pWjUzRQ","new","David Pawson"],
        ["1 & 2 Peter 1","d8dBDPa9uvQ","new","David Pawson"],
        ["1 & 2 Peter 2","qJyTe0NZNVY","new","David Pawson"],
        ["Letters of John 1","5jPlZjNwZhM","new","David Pawson"],
        ["Letters of John 2","PtNC9c4jTBM","new","David Pawson"],
        ["Jude","5iyll9XfNKA","new","David Pawson"]
    ];

    const videoBookMap = {
        "Overview of the Old Testament":"舊約聖經總覽",
        "Genesis":"創世記", "Exodus":"出埃及記", "Leviticus":"利未記", "Numbers":"民數記",
        "1 & 2 Samuel":"撒母耳記上、下", "1 & 2 Kings":"列王紀上、下",
        "1 & 2 Chronicles":"歷代志上、下", "Ezra and Nehemiah":"以斯拉記與尼希米記",
        "Esther":"以斯帖記", "Job":"約伯記", "Ecclesiastes":"傳道書",
        "Lamentations":"耶利米哀歌", "Ezekiel":"以西結書", "Hosea":"何西阿書",
        "Obadiah and Joel":"俄巴底亞書與約珥書", "Micah":"彌迦書", "Nahum":"那鴻書",
        "Habakkuk":"哈巴谷書", "Zephaniah":"西番雅書", "Haggai":"哈該書",
        "Matthew":"馬太福音", "The Newness of Mark's Gospel":"馬可福音的新意",
        "Mark":"馬可福音", "Luke":"路加福音", "Acts":"使徒行傳", "Romans":"羅馬書",
        "1 & 2 Corinthians":"哥林多前、後書", "Galatians":"加拉太書",
        "Philippians & Philemon":"腓立比書與腓利門書", "Colossians":"歌羅西書",
        "1 & 2 Thessalonians":"帖撒羅尼迦前、後書", "Timothy & Titus":"提摩太前、後書與提多書",
        "Hebrews":"希伯來書", "1 & 2 Peter":"彼得前、後書", "Letters of John":"約翰書信", "Jude":"猶大書"
    };

    function getVideoTitle(title, chinese = isChinese) {
        if (!chinese) return title;
        const partMatch = title.match(/^(.*?)(\s\d+)$/);
        const book = partMatch ? partMatch[1] : title;
        const part = partMatch ? partMatch[2] : "";
        return (videoBookMap[book] || book) + (part ? `（第${part.trim()}集）` : "");
    }

    function initializeVideoLibrary() {
        const grid = document.getElementById("bible-video-grid");
        if (!grid) return;
        const input = document.getElementById("video-search-input");
        const buttons = [...document.querySelectorAll(".video-filter[data-video-filter]")];
        const count = document.getElementById("video-count");
        const heading = document.getElementById("video-results-title");
        const empty = document.getElementById("video-empty");
        const modal = document.getElementById("video-modal");
        const frame = document.getElementById("video-player-frame");
        const modalTitle = document.getElementById("video-modal-title");
        const youtubeLink = document.getElementById("video-youtube-link");
        const closeButton = document.getElementById("video-modal-close");
        if (!input || !modal || !frame || !closeButton) return;
        let category = "all";
        let previousFocus = null;

        function openVideo(video) {
            const [title, id] = video;
            previousFocus = document.activeElement;
            if (modalTitle) modalTitle.textContent = getVideoTitle(title);
            if (youtubeLink) {
                youtubeLink.href = `https://www.youtube.com/watch?v=${id}`;
                youtubeLink.textContent = isChinese ? "前往 YouTube 觀看 ↗" : "Watch on YouTube ↗";
            }
            frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
            frame.title = getVideoTitle(title);
            modal.hidden = false;
            document.body.classList.add("video-modal-open");
            closeButton.focus();
        }
        function closeVideo() {
            modal.hidden = true;
            frame.removeAttribute("src");
            document.body.classList.remove("video-modal-open");
            if (previousFocus?.isConnected) previousFocus.focus();
        }
        closeButton.addEventListener("click", closeVideo);
        modal.querySelectorAll("[data-close-video]").forEach(el => el.addEventListener("click", closeVideo));
        document.addEventListener("keydown", event => {
            if (modal.hidden) return;
            if (event.key === "Escape") {
                closeVideo();
                return;
            }
            if (event.key === "Tab") {
                const controls = [...modal.querySelectorAll('button:not([disabled]),a[href]')]
                    .filter(el => el.getClientRects().length);
                if (!controls.length) return;
                const first = controls[0], last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault(); last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault(); first.focus();
                }
            }
        });

        function render() {
            const query = input.value.trim().toLocaleLowerCase();
            const matches = videoData.filter(video => {
                const [title, , testament, speaker] = video;
                return (category === "all" || testament === category) &&
                    `${title} ${getVideoTitle(title, true)} ${speaker}`.toLocaleLowerCase().includes(query);
            });
            const fragment = document.createDocumentFragment();
            matches.forEach(video => {
                const [title, id, testament, speaker] = video;
                const displayTitle = getVideoTitle(title);
                const card = document.createElement("article");
                card.className = "video-library-card";
                const preview = document.createElement("button");
                preview.type = "button";
                preview.className = "video-card-preview";
                preview.setAttribute("aria-label", `${isChinese ? "播放" : "Play"} ${displayTitle}`);
                const thumbnail = document.createElement("img");
                thumbnail.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                thumbnail.alt = "";
                thumbnail.loading = "lazy";
                const play = document.createElement("span");
                play.className = "video-play-icon";
                play.textContent = "▶";
                play.setAttribute("aria-hidden", "true");
                preview.append(thumbnail, play);
                preview.addEventListener("click", () => openVideo(video));
                const body = document.createElement("div");
                body.className = "video-card-body";
                const label = document.createElement("span");
                label.className = "video-card-category";
                label.textContent = testament === "old"
                    ? (isChinese ? "舊約聖經" : "Old Testament")
                    : (isChinese ? "新約聖經" : "New Testament");
                const h3 = document.createElement("h3");
                h3.textContent = displayTitle;
                const byline = document.createElement("p");
                byline.className = "video-card-speaker";
                byline.textContent = speaker + (isChinese ? " · 英文影片" : "");
                const watch = document.createElement("button");
                watch.type = "button";
                watch.className = "video-card-watch";
                watch.textContent = isChinese ? "觀看影片 →" : "Watch Video →";
                watch.addEventListener("click", () => openVideo(video));
                body.append(label, h3, byline, watch);
                card.append(preview, body);
                fragment.appendChild(card);
            });
            grid.replaceChildren(fragment);
            if (empty) empty.hidden = matches.length > 0;
            if (count) count.textContent = isChinese
                ? `共 ${matches.length} 部影片`
                : `${matches.length} video${matches.length === 1 ? "" : "s"}`;
            if (heading) heading.textContent = (isChinese
                ? {all:"全部聖經教學影片",old:"舊約聖經教學影片",new:"新約聖經教學影片"}
                : {all:"All Bible Teaching Videos",old:"Old Testament Videos",new:"New Testament Videos"})[category];
        }
        buttons.forEach(button => button.addEventListener("click", () => {
            category = button.dataset.videoFilter;
            buttons.forEach(item => {
                const active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            render();
        }));
        input.addEventListener("input", render);
        render();
    }

    async function initialize() {
        await Promise.all([
            loadComponent("site-header", "header.html"),
            loadComponent("site-footer", "footer.html")
        ]);
        initializeHeader();
        initializeDevotionViewer();
        initializeResourceLibrary();
        initializeVideoLibrary();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, {once:true});
    } else {
        initialize();
    }
})();
