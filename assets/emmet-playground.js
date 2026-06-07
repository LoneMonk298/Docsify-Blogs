(function () {
  var EMMET_CDNS = [
    "https://cdn.jsdelivr.net/npm/emmet@2.4.11/+esm",
    "https://esm.sh/emmet@2.4.11",
    "https://cdnjs.cloudflare.com/ajax/libs/emmet/2.4.11/emmet.es.min.js",
    "https://cdn.jsdelivr.net/npm/emmet@2.4.11/dist/emmet.es.js",
  ];
  var emmetModulePromise;

  function loadEmmet() {
    if (!emmetModulePromise) {
      emmetModulePromise = EMMET_CDNS.reduce(function (promise, url) {
        return promise.catch(function () {
          return import(url);
        });
      }, Promise.reject()).then(function (mod) {
        var expand =
          mod.expandAbbreviation ||
          (typeof mod.default === "function" && mod.default) ||
          (mod.default && mod.default.expandAbbreviation);

        if (!expand) {
          throw new Error("Emmet expandAbbreviation API was not found.");
        }

        return expand;
      });
    }

    return emmetModulePromise;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function createPreviewDocument(html) {
    if (/^\s*<!doctype|<html[\s>]/i.test(html)) {
      return html;
    }

    return [
      "<!doctype html>",
      '<html lang="zh-Hans">',
      "<head>",
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      "<style>",
      "body{box-sizing:border-box;margin:0;padding:16px;font-family:Arial,'Microsoft YaHei',sans-serif;line-height:1.6;color:#1f2937;background:#fff;}",
      "*{box-sizing:border-box;}",
      "img,video{max-width:100%;height:auto;}",
      "table{border-collapse:collapse;width:100%;}",
      "td,th{border:1px solid #d1d5db;padding:6px 8px;}",
      "a{color:#2563eb;}",
      "</style>",
      "</head>",
      "<body>",
      html,
      "</body>",
      "</html>",
    ].join("");
  }

  function buildPlayground(container) {
    if (container.dataset.emmetReady === "true") {
      return;
    }

    container.dataset.emmetReady = "true";

    var initialEmmet = container.getAttribute("data-emmet") || "ul>li.item$*3>a{第 $ 项}";
    var title = container.getAttribute("data-title") || "Emmet 实时演示";

    container.innerHTML = [
      '<div class="emmet-playground__header">',
      '<span class="emmet-playground__title">' + escapeHtml(title) + "</span>",
      '<span class="emmet-playground__status" aria-live="polite">加载 Emmet...</span>',
      "</div>",
      '<div class="emmet-playground__grid">',
      '<label class="emmet-playground__panel">',
      '<span class="emmet-playground__label">Emmet 缩写</span>',
      '<textarea class="emmet-playground__input" spellcheck="false"></textarea>',
      "</label>",
      '<label class="emmet-playground__panel">',
      '<span class="emmet-playground__label">展开后的 HTML</span>',
      '<textarea class="emmet-playground__output" spellcheck="false" readonly></textarea>',
      "</label>",
      '<section class="emmet-playground__panel emmet-playground__preview-panel" aria-label="实时预览">',
      '<span class="emmet-playground__label">实时预览</span>',
      '<iframe class="emmet-playground__preview" sandbox="" title="Emmet 预览"></iframe>',
      "</section>",
      "</div>",
    ].join("");

    var input = container.querySelector(".emmet-playground__input");
    var output = container.querySelector(".emmet-playground__output");
    var preview = container.querySelector(".emmet-playground__preview");
    var status = container.querySelector(".emmet-playground__status");
    var expandAbbreviation;
    var debounceTimer;

    input.value = initialEmmet;

    function setError(message) {
      output.value = "";
      preview.srcdoc = createPreviewDocument(
        '<p style="color:#b91c1c;margin:0;">' + escapeHtml(message) + "</p>"
      );
      status.textContent = "展开失败";
      status.classList.add("is-error");
    }

    function render() {
      if (!expandAbbreviation) {
        return;
      }

      var abbreviation = input.value.trim();

      if (!abbreviation) {
        output.value = "";
        preview.srcdoc = createPreviewDocument("");
        status.textContent = "等待输入";
        status.classList.remove("is-error");
        return;
      }

      try {
        var html = expandAbbreviation(abbreviation, {
          syntax: "html",
          type: "markup",
          options: {
            "output.indent": "  ",
            "output.selfClosingStyle": "html",
          },
        });

        output.value = html;
        preview.srcdoc = createPreviewDocument(html);
        status.textContent = "已实时预览";
        status.classList.remove("is-error");
      } catch (error) {
        setError(error && error.message ? error.message : "当前缩写无法展开。");
      }
    }

    input.addEventListener("input", function () {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(render, 120);
    });

    loadEmmet()
      .then(function (expand) {
        expandAbbreviation = expand;
        render();
      })
      .catch(function () {
        setError("Emmet CDN 加载失败，请检查网络连接后刷新页面。");
      });
  }

  function initPlaygrounds() {
    document.querySelectorAll(".emmet-playground").forEach(buildPlayground);
  }

  function docsifyPlugin(hook) {
    hook.doneEach(initPlaygrounds);
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], docsifyPlugin);
})();
