(function () {
  if (!window.projectRenderer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  window.projectRenderer.renderProjectDetailPage(projectId);
})();
