(function () {
  if (!window.projectCatalog || !window.projectRenderer) {
    return;
  }

  window.projectRenderer.renderProjectGrid('[data-project-list="all"]', window.projectCatalog.all);
  window.projectRenderer.wireProjectCardInteractions('[data-project-list="all"]');
})();
