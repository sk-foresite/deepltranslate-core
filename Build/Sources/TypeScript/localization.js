/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
define([
  "require",
  "exports",
  "jquery",
  "./Enum/Severity",
  "TYPO3/CMS/Core/Ajax/AjaxRequest",
  "./Icons",
  "./Wizard",
], function (e, t, a, l, s, i, o) {
  "use strict";
  a = __importDefault(a);
  return new (class {
    constructor() {
      (this.triggerButton = ".t3js-localize"),
        (this.localizationMode = null),
        (this.sourceLanguage = null),
        (this.records = []),
        (0, a.default)(() => {
          this.initialize();
        });
    }
    initialize() {
      const e = this;
      i.getIcon("actions-localize", i.sizes.large).then((t) => {
        i.getIcon("actions-edit-copy", i.sizes.large).then((s) => {
          (0, a.default)(e.triggerButton).removeClass("disabled"),
            (0, a.default)(document).on("click", e.triggerButton, (e) => {
              e.preventDefault();
              const n = (0, a.default)(e.currentTarget),
                c = [],
                d = [];
              let r = "";
              n.data("allowTranslate") &&
                (c.push(
                  '<div class="row"><div class="col-sm-3"><label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-translate">' +
                    t +
                    '<input type="radio" name="mode" id="mode_translate" value="localize" style="display: none"><br>' +
                    TYPO3.lang["localize.wizard.button.translate"] +
                    '</label></div><div class="col-sm-9"><p class="t3js-helptext t3js-helptext-translate text-muted">' +
                    TYPO3.lang["localize.educate.translate"] +
                    "</p></div></div>"
                ),
                d.push("localize")),
                n.data("allowCopy") &&
                  (c.push(
                    '<div class="row"><div class="col-sm-3"><label class="btn btn-block btn-default t3js-localization-option" data-helptext=".t3js-helptext-copy">' +
                      s +
                      '<input type="radio" name="mode" id="mode_copy" value="copyFromLanguage" style="display: none"><br>' +
                      TYPO3.lang["localize.wizard.button.copy"] +
                      '</label></div><div class="col-sm-9"><p class="t3js-helptext t3js-helptext-copy text-muted">' +
                      TYPO3.lang["localize.educate.copy"] +
                      "</p></div></div>"
                  ),
                  d.push("copyFromLanguage")),
                0 === n.data("allowTranslate") &&
                  0 === n.data("allowCopy") &&
                  c.push(
                    '<div class="row"><div class="col-sm-12"><div class="alert alert-warning"><div class="media"><div class="media-left"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-exclamation fa-stack-1x"></i></span></div><div class="media-body"><p class="alert-message">' +
                      TYPO3.lang["localize.educate.noTranslate"] +
                      "</p></div></div></div></div></div>"
                  ),
                (r +=
                  '<div data-bs-toggle="buttons">' + c.join("<hr>") + "</div>"),
                o.addSlide(
                  "localize-choose-action",
                  TYPO3.lang["localize.wizard.header_page"]
                    .replace("{0}", n.data("page"))
                    .replace("{1}", n.data("languageName")),
                  r,
                  l.SeverityEnum.info,
                  () => {
                    1 === d.length &&
                      ((this.localizationMode = d[0]),
                      o.unlockNextStep().trigger("click"));
                  }
                ),
                o.addSlide(
                  "localize-choose-language",
                  TYPO3.lang["localize.view.chooseLanguage"],
                  "",
                  l.SeverityEnum.info,
                  (e) => {
                    i.getIcon("spinner-circle-dark", i.sizes.large).then(
                      (t) => {
                        e.html('<div class="text-center">' + t + "</div>"),
                          this.loadAvailableLanguages(
                            parseInt(n.data("pageId"), 10),
                            parseInt(n.data("languageId"), 10)
                          ).then(async (t) => {
                            const l = await t.resolve();
                            if (1 === l.length)
                              return (
                                (this.sourceLanguage = l[0].uid),
                                void o.unlockNextStep().trigger("click")
                              );
                            o.getComponent().on(
                              "click",
                              ".t3js-language-option",
                              (e) => {
                                const t = (0, a.default)(
                                  e.currentTarget
                                ).prev();
                                (this.sourceLanguage = t.val()),
                                  o.unlockNextStep();
                              }
                            );
                            const s = (0, a.default)("<div />", {
                              class: "row",
                            });
                            for (const e of l) {
                              const t = "language" + e.uid,
                                l = (0, a.default)("<input />", {
                                  type: "radio",
                                  name: "language",
                                  id: t,
                                  value: e.uid,
                                  style: "display: none;",
                                  class: "btn-check",
                                }),
                                i = (0, a.default)("<label />", {
                                  class:
                                    "btn btn-default btn-block t3js-language-option option",
                                  for: t,
                                })
                                  .text(" " + e.title)
                                  .prepend(e.flagIcon);
                              s.append(
                                (0, a.default)("<div />", { class: "col-sm-4" })
                                  .append(l)
                                  .append(i)
                              );
                            }
                            e.empty().append(s);
                          });
                      }
                    );
                  }
                ),
                o.addSlide(
                  "localize-summary",
                  TYPO3.lang["localize.view.summary"],
                  "",
                  l.SeverityEnum.info,
                  (e) => {
                    i
                      .getIcon("spinner-circle-dark", i.sizes.large)
                      .then((t) => {
                        e.html('<div class="text-center">' + t + "</div>");
                      }),
                      this.getSummary(
                        parseInt(n.data("pageId"), 10),
                        parseInt(n.data("languageId"), 10)
                      ).then(async (t) => {
                        const l = await t.resolve();
                        e.empty(), (this.records = []);
                        const s = l.columns.columns;
                        l.columns.columnList.forEach((t) => {
                          if (void 0 === l.records[t]) return;
                          const i = s[t],
                            o = (0, a.default)("<div />", { class: "row" });
                          l.records[t].forEach((e) => {
                            const t = " (" + e.uid + ") " + e.title;
                            this.records.push(e.uid),
                              o.append(
                                (0, a.default)("<div />", {
                                  class: "col-sm-6",
                                }).append(
                                  (0, a.default)("<div />", {
                                    class: "input-group",
                                  }).append(
                                    (0, a.default)("<span />", {
                                      class: "input-group-addon",
                                    }).append(
                                      (0, a.default)("<input />", {
                                        type: "checkbox",
                                        class:
                                          "t3js-localization-toggle-record",
                                        id: "record-uid-" + e.uid,
                                        checked: "checked",
                                        "data-uid": e.uid,
                                        "aria-label": t,
                                      })
                                    ),
                                    (0, a.default)("<label />", {
                                      class: "form-control",
                                      for: "record-uid-" + e.uid,
                                    })
                                      .text(t)
                                      .prepend(e.icon)
                                  )
                                )
                              );
                          }),
                            e.append(
                              (0, a.default)("<fieldset />", {
                                class: "localization-fieldset",
                              }).append(
                                (0, a.default)("<label />")
                                  .text(i)
                                  .prepend(
                                    (0, a.default)("<input />", {
                                      class: "t3js-localization-toggle-column",
                                      type: "checkbox",
                                      checked: "checked",
                                    })
                                  ),
                                o
                              )
                            );
                        }),
                          o.unlockNextStep(),
                          o
                            .getComponent()
                            .on(
                              "change",
                              ".t3js-localization-toggle-record",
                              (e) => {
                                const t = (0, a.default)(e.currentTarget),
                                  l = t.data("uid"),
                                  s = t.closest("fieldset"),
                                  i = s.find(
                                    ".t3js-localization-toggle-column"
                                  );
                                if (t.is(":checked")) this.records.push(l);
                                else {
                                  const e = this.records.indexOf(l);
                                  e > -1 && this.records.splice(e, 1);
                                }
                                const n = s.find(
                                    ".t3js-localization-toggle-record"
                                  ),
                                  c = s.find(
                                    ".t3js-localization-toggle-record:checked"
                                  );
                                i.prop("checked", c.length > 0),
                                  i.prop(
                                    "indeterminate",
                                    c.length > 0 && c.length < n.length
                                  ),
                                  this.records.length > 0
                                    ? o.unlockNextStep()
                                    : o.lockNextStep();
                              }
                            )
                            .on(
                              "change",
                              ".t3js-localization-toggle-column",
                              (e) => {
                                const t = (0, a.default)(e.currentTarget),
                                  l = t
                                    .closest("fieldset")
                                    .find(".t3js-localization-toggle-record");
                                l.prop("checked", t.is(":checked")),
                                  l.trigger("change");
                              }
                            );
                      });
                  }
                ),
                o
                  .addFinalProcessingSlide(() => {
                    this.localizeRecords(
                      parseInt(n.data("pageId"), 10),
                      parseInt(n.data("languageId"), 10),
                      this.records
                    ).then(() => {
                      o.dismiss(), document.location.reload();
                    });
                  })
                  .then(() => {
                    o.show(),
                      o
                        .getComponent()
                        .on("click", ".t3js-localization-option", (e) => {
                          const t = (0, a.default)(e.currentTarget),
                            l = t.find('input[type="radio"]');
                          if (t.data("helptext")) {
                            const l = (0, a.default)(e.delegateTarget);
                            l
                              .find(".t3js-localization-option")
                              .removeClass("active"),
                              l.find(".t3js-helptext").addClass("text-muted"),
                              t.addClass("active"),
                              l
                                .find(t.data("helptext"))
                                .removeClass("text-muted");
                          }
                          (this.localizationMode = l.val()), o.unlockNextStep();
                        });
                  });
            });
        });
      });
    }
    loadAvailableLanguages(e, t) {
      return new s(TYPO3.settings.ajaxUrls.page_languages)
        .withQueryArguments({ pageId: e, languageId: t })
        .get();
    }
    getSummary(e, t) {
      return new s(TYPO3.settings.ajaxUrls.records_localize_summary)
        .withQueryArguments({
          pageId: e,
          destLanguageId: t,
          languageId: this.sourceLanguage,
        })
        .get();
    }
    localizeRecords(e, t, a) {
      return new s(TYPO3.settings.ajaxUrls.records_localize)
        .withQueryArguments({
          pageId: e,
          srcLanguageId: this.sourceLanguage,
          destLanguageId: t,
          action: this.localizationMode,
          uidList: a,
        })
        .get();
    }
  })();
});
