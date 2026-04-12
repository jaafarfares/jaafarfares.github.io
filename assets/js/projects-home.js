(function () {
  if (!window.projectCatalog || !window.projectRenderer) {
    return;
  }

  window.projectRenderer.renderProjectGrid('[data-project-list="featured"]', window.projectCatalog.featured);
  window.projectRenderer.wireProjectCardInteractions('[data-project-list="featured"]');
})();
