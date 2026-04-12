(function () {
  const FALLBACK_PAGE_TITLE = 'Projects';

  function buildStackSummary(project) {
    const stack = project.stack || {};
    const orderedGroups = [
      stack.languageFramework || [],
      stack.architecture || [],
      stack.stateManagement || [],
      stack.backend || [],
      stack.tooling || []
    ];
    const summaryParts = [];

    orderedGroups.forEach(function (group) {
      group.slice(0, 2).forEach(function (item) {
        if (summaryParts.join(' • ').length < 160) {
          summaryParts.push(item);
        }
      });
    });

    return summaryParts.join(' • ');
  }

  function buildStoreLinks(project) {
    const links = [];
    const isLive = project.status === 'live';
    const framework = (project.framework || '').toLowerCase();
    const isFlutter = framework.indexOf('flutter') !== -1;
    const isKotlinFamily = framework.indexOf('kotlin') !== -1 || framework.indexOf('java') !== -1;

    if (!isLive) {
      return links;
    }

    if (isFlutter) {
      if (project.androidUrl) {
        links.push({ label: 'Android', url: project.androidUrl, icon: 'bi bi-android2' });
      }
      if (project.iosUrl) {
        links.push({ label: 'iOS', url: project.iosUrl, icon: 'bi bi-apple' });
      }
      return links;
    }

    if (isKotlinFamily) {
      if (project.androidUrl) {
        links.push({ label: 'Android', url: project.androidUrl, icon: 'bi bi-android2' });
      }
      return links;
    }

    if (project.androidUrl) {
      links.push({ label: 'Android', url: project.androidUrl, icon: 'bi bi-android2' });
    }
    if (project.iosUrl) {
      links.push({ label: 'iOS', url: project.iosUrl, icon: 'bi bi-apple' });
    }

    return links;
  }

  function getStatusLabel(status) {
    return status === 'live' ? 'Live' : 'Not Live';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildLogoMarkup(project) {
    if (project.logo) {
      return '<img src="' + project.logo + '" class="app-logo" alt="' + project.title + ' logo">';
    }

    const initials = project.title
      .split(' ')
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0);
      })
      .join('')
      .toUpperCase();

    return '<span class="app-logo app-logo-fallback" aria-hidden="true">' + initials + '</span>';
  }

  function buildStoreLinksMarkup(project) {
    const storeLinks = buildStoreLinks(project);

    if (!storeLinks.length) {
      return '';
    }

    return [
      '<div class="project-store-links" aria-label="Store links">',
      storeLinks
        .map(function (link) {
          return (
            '<a class="project-store-link" href="' +
            link.url +
            '" target="_blank" rel="noopener noreferrer">' +
            '<i class="' +
            link.icon +
            '" aria-hidden="true"></i>' +
            '<span>' +
            link.label +
            '</span>' +
            '</a>'
          );
        })
        .join(''),
      '</div>'
    ].join('');
  }

  function createProjectCard(project, index) {
    const stackSummary = buildStackSummary(project);
    const projectUrl = 'portfolio-details.html?id=' + encodeURIComponent(project.id);
    const storeLinksMarkup = buildStoreLinksMarkup(project);

    return [
      '<div class="col-lg-4 col-md-6 portfolio-item filter-app mb-4" data-aos="fade-up" data-aos-delay="' + (index % 3) * 100 + '">',
      '<article class="portfolio-wrap project-card" tabindex="0" role="link" data-project-link="' + projectUrl + '" aria-label="Open details for ' + project.title + '">',
      '<div class="project-card-topline">',
      '<span class="project-status-tag project-status-' + project.status + '">' + getStatusLabel(project.status) + '</span>',
      project.category ? '<span class="project-category-tag">' + project.category + '</span>' : '',
      '</div>',
      '<div class="app-header">',
      buildLogoMarkup(project),
      '<div class="app-header-text">',
      '<h3 class="app-title">' + project.title + '</h3>',
      '<p class="project-platform">' + project.framework + ' • ' + project.platform + '</p>',
      '</div>',
      '</div>',
      '<p class="app-description">' + project.shortDescription + '</p>',
      '<p class="app-tech project-stack-summary" title="' + stackSummary + '">' + stackSummary + '</p>',
      '<div class="project-card-footer">',
      storeLinksMarkup,
      '<a class="project-details-link" href="' + projectUrl + '">View Details</a>',
      '</div>',
      '</article>',
      '</div>'
    ].join('');
  }

  function renderProjectGrid(targetSelector, projects) {
    const target = document.querySelector(targetSelector);

    if (!target) {
      return;
    }

    if (!projects.length) {
      target.innerHTML = '<div class="col-12"><p class="project-empty-state">Projects will appear here soon.</p></div>';
      return;
    }

    target.innerHTML = projects
      .map(function (project, index) {
        return createProjectCard(project, index);
      })
      .join('');
  }

  function buildDetailStackMarkup(project) {
    const stack = project.stack || {};
    const groups = [
      { label: 'Language / Framework', items: stack.languageFramework || [] },
      { label: 'Architecture', items: stack.architecture || [] },
      { label: 'State / DI', items: stack.stateManagement || [] },
      { label: 'Backend / Integrations', items: stack.backend || [] },
      { label: 'Tooling / CI/CD', items: stack.tooling || [] }
    ].filter(function (group) {
      return group.items.length;
    });

    if (!groups.length) {
      return '';
    }

    return groups
      .map(function (group) {
        return (
          '<li><strong>' +
          group.label +
          '</strong>: ' +
          group.items.join(' • ') +
          '</li>'
        );
      })
      .join('');
  }

  function buildGalleryMarkup(project) {
    if (!project.images || !project.images.length) {
      return '';
    }

    return project.images
      .map(function (image) {
        return [
          '<div class="swiper-slide">',
          '<a href="' + image.src + '" class="portfolio-lightbox" data-gallery="projectGallery" title="' + project.title + '">',
          '<img src="' + image.src + '" alt="' + image.alt + '">',
          '</a>',
          '</div>'
        ].join('');
      })
      .join('');
  }

  function renderProjectDetailPage(projectId) {
    const page = document.querySelector('[data-project-detail-page]');

    if (!page) {
      return;
    }

    const project = window.projectCatalog && window.projectCatalog.getById(projectId);
    const pageTitle = document.querySelector('[data-project-title]');
    const breadcrumbTitle = document.querySelector('[data-project-breadcrumb-title]');
    const projectInfo = document.querySelector('[data-project-info]');
    const projectDescription = document.querySelector('[data-project-description]');
    const projectGallery = document.querySelector('[data-project-gallery]');
    const projectGalleryColumn = document.querySelector('[data-project-gallery-column]');
    const projectInfoColumn = document.querySelector('[data-project-info-column]');
    const notFound = document.querySelector('[data-project-not-found]');

    if (!project) {
      document.title = 'Project Not Found';
      if (pageTitle) {
        pageTitle.textContent = 'Project not found';
      }
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = 'Project not found';
      }
      if (notFound) {
        notFound.hidden = false;
      }
      if (projectGalleryColumn) {
        projectGalleryColumn.hidden = true;
      }
      return;
    }

    document.title = project.title + ' | ' + FALLBACK_PAGE_TITLE;

    if (pageTitle) {
      pageTitle.textContent = project.title;
    }
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = project.title;
    }

    if (projectInfo) {
      const storeLinks = buildStoreLinks(project);
      const tagMarkup = (project.tags || [])
        .map(function (tag) {
          return '<span class="project-detail-tag">' + tag + '</span>';
        })
        .join('');

      projectInfo.innerHTML = [
        '<h3>Project Information</h3>',
        '<ul>',
        '<li><strong>Status</strong>: ' + getStatusLabel(project.status) + '</li>',
        '<li><strong>Platform</strong>: ' + project.platform + '</li>',
        '<li><strong>Framework</strong>: ' + project.framework + '</li>',
        project.category ? '<li><strong>Category</strong>: ' + project.category + '</li>' : '',
        buildDetailStackMarkup(project),
        storeLinks.length
          ? '<li><strong>Stores</strong>: ' + storeLinks.map(function (link) { return '<a href="' + link.url + '" target="_blank" rel="noopener noreferrer">' + link.label + '</a>'; }).join(' • ') + '</li>'
          : '',
        '</ul>',
        tagMarkup ? '<div class="project-detail-tags">' + tagMarkup + '</div>' : ''
      ].join('');
    }

    if (projectDescription) {
      projectDescription.innerHTML = [
        '<h2>' + project.title + '</h2>',
        '<p>' + project.detailedDescription + '</p>'
      ].join('');
    }

    if (projectGallery && projectGalleryColumn && projectInfoColumn) {
      const galleryMarkup = buildGalleryMarkup(project);

      if (galleryMarkup) {
        projectGallery.innerHTML = [
          '<div class="portfolio-details-slider swiper">',
          '<div class="swiper-wrapper align-items-center">',
          galleryMarkup,
          '</div>',
          '<div class="swiper-pagination"></div>',
          '</div>'
        ].join('');
      } else {
        projectGalleryColumn.hidden = true;
        projectInfoColumn.className = 'col-lg-12';
      }
    }
  }

  function wireProjectCardInteractions(rootSelector) {
    const root = document.querySelector(rootSelector);

    if (!root) {
      return;
    }

    root.addEventListener('click', function (event) {
      const storeLink = event.target.closest('.project-store-link, .project-details-link');

      if (storeLink) {
        return;
      }

      const card = event.target.closest('[data-project-link]');

      if (!card) {
        return;
      }

      window.location.href = card.getAttribute('data-project-link');
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      const card = event.target.closest('[data-project-link]');

      if (!card) {
        return;
      }

      event.preventDefault();
      window.location.href = card.getAttribute('data-project-link');
    });
  }

  window.projectRenderer = {
    buildStoreLinks: buildStoreLinks,
    buildStackSummary: buildStackSummary,
    renderProjectGrid: renderProjectGrid,
    renderProjectDetailPage: renderProjectDetailPage,
    wireProjectCardInteractions: wireProjectCardInteractions
  };
})();
