(function () {
  function normalizeToken(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function buildAltText(projectTitle, assetPath, index) {
    const normalizedPath = normalizeToken(assetPath);
    const isIcon = normalizedPath.indexOf('icon') !== -1 || normalizedPath.indexOf('logo') !== -1;

    if (isIcon) {
      return projectTitle + ' app icon';
    }

    return projectTitle + ' preview ' + (index + 1);
  }

  function rankProjectAsset(assetPath, tokens) {
    const pathParts = assetPath.split('/').map(normalizeToken).filter(Boolean);
    const baseName = pathParts[pathParts.length - 1] || '';
    const directoryParts = pathParts.slice(0, -1);
    const commonSuffixes = /^(icon|logo|image|img|cover|thumb|thumbnail|banner|hero|preview|screen|screenshot|shot|demo|\d+)+$/;
    let bestScore = 0;

    tokens.forEach(function (token) {
      if (!token) {
        return;
      }

      if (baseName === token) {
        bestScore = Math.max(bestScore, 100);
        return;
      }

      if (baseName.indexOf(token) === 0) {
        const suffix = baseName.slice(token.length);

        if (!suffix || commonSuffixes.test(suffix)) {
          bestScore = Math.max(bestScore, 90);
          return;
        }
      }

      if (directoryParts.some(function (part) { return part === token; })) {
        bestScore = Math.max(bestScore, 80);
        return;
      }

      if (baseName.indexOf(token) !== -1 && token.length >= 5) {
        bestScore = Math.max(bestScore, 70);
      }
    });

    return bestScore;
  }

  function mergeUniqueAssets(existingAssets, matchedPaths, projectTitle) {
    const assetMap = {};
    const mergedPaths = [];

    existingAssets.forEach(function (asset) {
      const src = typeof asset === 'string' ? asset : asset.src;

      if (!src || assetMap[src]) {
        return;
      }

      assetMap[src] = true;
      mergedPaths.push(src);
    });

    matchedPaths.forEach(function (assetPath) {
      if (assetMap[assetPath]) {
        return;
      }

      assetMap[assetPath] = true;
      mergedPaths.push(assetPath);
    });

    return mergedPaths.map(function (assetPath, index) {
      return {
        src: assetPath,
        alt: buildAltText(projectTitle, assetPath, index)
      };
    });
  }

  function pickPrimaryAsset(assetPaths) {
    if (!assetPaths.length) {
      return '';
    }

    const rankedAssets = assetPaths.slice().sort(function (left, right) {
      const leftNormalized = normalizeToken(left);
      const rightNormalized = normalizeToken(right);
      const leftPreferred = /(icon|logo)/.test(leftNormalized) ? 1 : 0;
      const rightPreferred = /(icon|logo)/.test(rightNormalized) ? 1 : 0;

      if (leftPreferred !== rightPreferred) {
        return rightPreferred - leftPreferred;
      }

      const leftGif = /\.gif$/i.test(left) ? 1 : 0;
      const rightGif = /\.gif$/i.test(right) ? 1 : 0;

      if (leftGif !== rightGif) {
        return leftGif - rightGif;
      }

      return left.localeCompare(right);
    });

    return rankedAssets[0];
  }

  const projectAssetCatalog = [
    'assets/projects/Kharaaj.png',
    'assets/projects/Staffy/fazt Gif Staffy.gif',
    'assets/projects/allcarta/allcarta1.gif',
    'assets/projects/allcarta_icon.png',
    'assets/projects/barsha_food_icon.png',
    'assets/projects/epark_access.png',
    'assets/projects/epark_icon.png',
    'assets/projects/events_icon.png',
    'assets/projects/jeeby_icon.png',
    'assets/projects/kharaaj_driver.png',
    'assets/projects/kharaaj-marketer.png',
    'assets/projects/kharaaj_supervisor.png',
    'assets/projects/manasek_logo.png',
    'assets/projects/ms_delivery.png',
    'assets/projects/ms_laundry.png',
    'assets/projects/ms_soap.png',
    'assets/projects/nomadia_icon.jpeg',
    'assets/projects/staffy_icon.png'
  ];

  const sharedKharajStack = {
    languageFramework: ['Kotlin + Java'],
    architecture: ['Clean Multi-Module Architecture', 'Repository & UseCase layers'],
    stateManagement: ['Dagger 2', 'Coroutines', 'RxJava 2'],
    backend: ['Retrofit', 'OkHttp', 'Gson', 'Firebase Analytics'],
    tooling: ['Firebase Crashlytics', 'Fastlane']
  };

  const sharedMaghaselStack = {
    languageFramework: ['Kotlin', 'Java'],
    architecture: ['MVVM', 'Repository pattern', 'Multi-module layered architecture'],
    stateManagement: ['Hilt', 'Coroutines', 'Flow / StateFlow', 'LiveData'],
    backend: ['Retrofit', 'OkHttp', 'Moshi', 'Custom REST backend', 'Firebase Analytics'],
    tooling: ['Firebase Crashlytics', 'Firebase Cloud Messaging', 'WorkManager', 'Fastlane']
  };

  const projects = [
    {
      id: 'barsha-food',
      title: 'Barsha-Food',
      aliases: ['barsha food'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin',
      shortDescription: 'Restaurant discovery app with 360° viewer and QR menu scanning.',
      detailedDescription: 'Barsha-Food streamlines restaurant discovery with location-aware browsing, interactive content, and payment-ready user flows for reservations and orders.',
      stack: {
        languageFramework: ['Kotlin'],
        architecture: ['MVVM'],
        stateManagement: [],
        backend: ['Google Maps API', 'Google Pay', 'Apple Pay'],
        tooling: ['Play Store publishing']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.barsha.food',
      iosUrl: 'https://apps.apple.com/us/app/barsha-food/idDEMO',
      images: [],
      featured: true,
      category: 'Food & Discovery',
      tags: ['Kotlin', 'Maps', 'Payments'],
      logo: ''
    },
    {
      id: 'epark',
      title: 'E-Park',
      aliases: ['epark', 'e park'],
      status: 'live',
      platform: 'Android & iOS',
      framework: 'Flutter',
      shortDescription: 'Smart parking reservation app with real-time availability, booking, and secure payments.',
      detailedDescription: 'The Smart Parking Reservation App is an innovative platform that aims to facilitate the process of finding and managing parking in crowded urban areas. The application allows users to find available parking spaces in real time, reserve a place in advance, and pay electronically through secure payment methods.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Feature-oriented app structure'],
        stateManagement: ['Riverpod'],
        backend: ['Google Maps API', 'Firebase Analytics', 'Firebase Crashlytics', 'Apple Pay', 'Google Pay', 'Moyasar Pay', 'Server-Sent Events'],
        tooling: ['Multi-language', 'CI/CD Fastlane']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.barsha.epark',
      iosUrl: 'https://apps.apple.com/us/app/e-park/id6738445935',
      images: [],
      featured: true,
      category: 'Mobility',
      tags: ['Flutter', 'Parking', 'Payments'],
      logo: ''
    },
    {
      id: 'allcarta',
      title: 'Allcarta',
      aliases: ['all carta'],
      status: 'live',
      platform: 'Android & iOS',
      framework: 'Flutter',
      shortDescription: 'University management and gamified e-commerce platform.',
      detailedDescription: 'Allcarta combines university workflows, student engagement, and commerce in one product family. The app suite supports schedules, tasks, offers, rewards, and operational workflows while relying on clean architecture principles, Firebase services, REST integrations, and GetX-powered flows.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Clean Architecture'],
        stateManagement: ['GetX'],
        backend: ['Firebase', 'REST API'],
        tooling: ['Multi-app product suite']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.allcarta.app',
      iosUrl: 'https://apps.apple.com/us/app/allcarta/idDEMO',
      images: [],
      featured: true,
      category: 'Education & Commerce',
      tags: ['Flutter', 'GetX', 'Gamification'],
      logo: ''
    },
    {
      id: 'staffy',
      title: 'Staffy',
      aliases: ['staffy'],
      status: 'not-live',
      platform: 'Android',
      framework: 'Flutter',
      shortDescription: 'Workforce management with real-time chat and task tracking.',
      detailedDescription: 'Staffy helps teams manage time tracking, communication, task coordination, geolocation-aware attendance, and multilingual workforce workflows.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['MVVM'],
        stateManagement: ['GetX'],
        backend: ['Firebase', 'Google Maps API'],
        tooling: ['Multilingual support']
      },
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: true,
      category: 'Workforce Management',
      tags: ['Flutter', 'GetX', 'Messaging'],
      logo: ''
    },
    {
      id: 'jeeby',
      title: 'Jeeby',
      aliases: ['jeeby'],
      status: 'live',
      platform: 'iOS',
      framework: 'Flutter',
      shortDescription: 'Multi-country delivery app with real-time tracking.',
      detailedDescription: 'Jeeby powers cross-market delivery flows with live tracking, operational coordination, and a production-ready mobile experience tailored for logistics teams and customers.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Feature-oriented architecture'],
        stateManagement: [],
        backend: ['Google Maps', 'Payment Gateways', 'REST API'],
        tooling: ['Cross-market delivery operations']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.jeeby.jeeby&pli=1',
      iosUrl: 'https://apps.apple.com/fr/app/jeeby/id6743303046',
      images: [],
      featured: true,
      category: 'Logistics',
      tags: ['Flutter', 'Tracking', 'Delivery'],
      logo: ''
    },
    {
      id: 'nomadia',
      title: 'Nomadia',
      aliases: ['nomadia'],
      status: 'live',
      platform: 'Android & iOS',
      framework: 'Flutter',
      shortDescription: 'Essential childcare equipment rental app for parents and grandparents.',
      detailedDescription: 'Nomadia is the essential app for parents. Whether going on vacation, away for a weekend, or hosting grandchildren, it makes it easy to rent quality childcare equipment. Developed by the Angers Ca Bouge Agency.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Marketplace-oriented architecture'],
        stateManagement: [],
        backend: ['Payments', 'Rental workflows'],
        tooling: ['Cross-platform release']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.nomadia.nomadia',
      iosUrl: 'https://apps.apple.com/fr/app/nomadia/id6748673890',
      images: [],
      featured: true,
      category: 'Marketplace',
      tags: ['Flutter', 'Rental', 'Families'],
      logo: ''
    },
    {
      id: 'epark-access',
      title: 'E-Park Access',
      aliases: ['epark access', 'e park access'],
      status: 'not-live',
      platform: 'Android & iOS',
      framework: 'Flutter',
      shortDescription: 'Manager-facing parking operations app for offers, reservations, and tracking.',
      detailedDescription: 'E-Park Access is made for parking managers to create offers and manage and track reservations through internal operational workflows.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Clean Architecture', 'MVC'],
        stateManagement: ['GetX'],
        backend: [],
        tooling: ['Internal operations tooling']
      },
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Operations',
      tags: ['Flutter', 'GetX', 'Management'],
      logo: ''
    },
    {
      id: 'manassek',
      title: 'Manassek',
      aliases: ['manasek', 'manassek'],
      status: 'not-live',
      platform: 'Android & iOS',
      framework: 'Flutter',
      shortDescription: 'Feature-first Flutter app with clean architecture, localized UI, and structured routing.',
      detailedDescription: 'Manassek follows a feature-first clean architecture where each feature is split into data, domain, and presentation layers, with shared modules in core/ and app/. Riverpod is used for both state management and dependency injection through providers that compose repositories and use cases. Navigation is built with GoRouter and StatefulShellRoute, route arguments flow through state.extra, and auth/onboarding redirects are managed in the router. All user-facing strings come from AppLocalizations.t, while the visual system stays centralized in AppTheme, AppColors, and AppTextStyles without hardcoded colors or inline styles.',
      stack: {
        languageFramework: ['Flutter'],
        architecture: ['Feature-first Clean Architecture'],
        stateManagement: ['Riverpod', 'StateNotifierProvider', 'FutureProvider', 'StreamProvider'],
        backend: ['GoRouter', 'StatefulShellRoute'],
        tooling: ['AppLocalizations.t', 'AppTheme', 'AppColors', 'AppTextStyles']
      },
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Architecture Showcase',
      tags: ['Flutter', 'Riverpod', 'GoRouter'],
      logo: ''
    },
    {
      id: 'events-sa',
      title: 'Events SA',
      aliases: ['eventssa', 'events sa', 'events'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin',
      shortDescription: 'Event planning app with invitations, RSVPs, schedules, and booking flows.',
      detailedDescription: 'Events SA simplifies event planning with tools for invitations, RSVPs, schedules, and more. It is suitable for personal, professional, and social gatherings.',
      stack: {
        languageFramework: ['Kotlin'],
        architecture: ['MVVM', 'Clean Architecture-style modularization'],
        stateManagement: ['Dagger 2', 'RxJava 2', 'LiveData'],
        backend: ['XML layouts', 'Data Binding', 'View Binding', 'Retrofit', 'OkHttp', 'Google Maps / Location / Wallet'],
        tooling: ['Stetho', 'CI/CD Fastlane']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.eventssa.android',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Events',
      tags: ['Kotlin', 'MVVM', 'Events'],
      logo: ''
    },
    {
      id: 'kharaaj',
      title: 'Kharaaj',
      aliases: ['kharaaj', 'kharaj'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin + Java',
      shortDescription: 'Wholesale agriculture marketplace for buying, selling, and transport in Saudi Arabia.',
      detailedDescription: 'Kharaj is an online platform that facilitates the buying, selling, and transport of wholesale agricultural products within the Kingdom of Saudi Arabia. It provides digital solutions to help traders and farmers access agricultural products directly from their sources and manage buying and selling processes efficiently.',
      stack: {
        languageFramework: sharedKharajStack.languageFramework,
        architecture: sharedKharajStack.architecture,
        stateManagement: sharedKharajStack.stateManagement,
        backend: ['Retrofit', 'OkHttp', 'Gson', 'Firebase Cloud Messaging', 'Firebase Crashlytics', 'Firebase Analytics', 'Navigation Component + Safe Args', 'Google Maps & Places SDK', 'ExoPlayer', 'Picasso', 'Camera / media tools'],
        tooling: ['CI/CD Fastlane']
      },
      androidUrl: 'https://play.google.com/store/apps/details?id=com.barcha.kharaaj',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Agriculture Marketplace',
      tags: ['Kotlin', 'Java', 'Marketplace'],
      logo: ''
    },
    {
      id: 'kharaaj-driver',
      title: 'Kharaaj Driver',
      aliases: ['kharaaj driver', 'kharaj driver'],
      status: 'not-live',
      platform: 'Android',
      framework: 'Kotlin + Java',
      shortDescription: 'Driver companion app for transport execution in the Kharaaj ecosystem.',
      detailedDescription: 'Kharaaj Driver extends the Kharaaj platform with transport-focused workflows for drivers, trip coordination, and logistics visibility.',
      stack: sharedKharajStack,
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Logistics',
      tags: ['Kotlin', 'Java', 'Driver'],
      logo: ''
    },
    {
      id: 'kharaaj-marketer',
      title: 'Marketer',
      aliases: ['kharaaj marketer', 'kharaj marketer', 'marketer'],
      status: 'not-live',
      platform: 'Android',
      framework: 'Kotlin + Java',
      shortDescription: 'Field marketing companion app built on the Kharaaj product stack.',
      detailedDescription: 'Marketer reuses the Kharaaj app family stack for commercial outreach, campaign support, and operational field workflows.',
      stack: sharedKharajStack,
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Field Operations',
      tags: ['Kotlin', 'Java', 'Marketing'],
      logo: ''
    },
    {
      id: 'kharaaj-supervisor',
      title: 'Supervisor',
      aliases: ['kharaaj supervisor', 'kharaj supervisor', 'supervisor'],
      status: 'not-live',
      platform: 'Android',
      framework: 'Kotlin + Java',
      shortDescription: 'Supervisor-facing operational app aligned with the Kharaaj stack family.',
      detailedDescription: 'Supervisor gives internal teams oversight workflows and operational visibility while staying aligned with the shared Kharaaj architecture and tooling.',
      stack: sharedKharajStack,
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Operations',
      tags: ['Kotlin', 'Java', 'Supervisor'],
      logo: ''
    },
    {
      id: 'ms-soap',
      title: 'Ms Soap',
      aliases: ['ms soap', 'maghasel customer', 'maghasel'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin',
      shortDescription: 'Customer-facing laundry ordering experience in the Maghasel app suite.',
      detailedDescription: 'Ms Soap is the customer app in the Maghasel ecosystem, sharing a Kotlin-first layered architecture, Firebase integrations, mapping services, and CI/CD workflows with the broader suite.',
      stack: sharedMaghaselStack,
      androidUrl: '',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Laundry Services',
      tags: ['Kotlin', 'Customer App', 'Laundry'],
      logo: ''
    },
    {
      id: 'ms-delivery',
      title: 'Ms Delivery',
      aliases: ['ms delivery', 'maghasel delivery'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin',
      shortDescription: 'Delivery operations app for the Maghasel workflow.',
      detailedDescription: 'Ms Delivery supports delivery-side operations and shares the same Kotlin, modular architecture, and service integrations used across the Maghasel suite.',
      stack: sharedMaghaselStack,
      androidUrl: 'https://play.google.com/store/apps/details?id=dev.barshaTech.deliveryMaghasel',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Laundry Services',
      tags: ['Kotlin', 'Delivery', 'Laundry'],
      logo: ''
    },
    {
      id: 'ms-laundry',
      title: 'Ms Laundry',
      aliases: ['ms laundry', 'maghasel laundry'],
      status: 'live',
      platform: 'Android',
      framework: 'Kotlin',
      shortDescription: 'Laundry-partner operations app in the Maghasel ecosystem.',
      detailedDescription: 'Ms Laundry is the partner-side app used by laundry teams, built on the same layered Kotlin stack and shared mobile platform conventions.',
      stack: sharedMaghaselStack,
      androidUrl: 'https://play.google.com/store/apps/details?id=dev.barshaTech.laundry',
      iosUrl: '',
      images: [],
      featured: false,
      category: 'Laundry Services',
      tags: ['Kotlin', 'Partner App', 'Laundry'],
      logo: ''
    }
  ].map(function (project) {
    const matchingTokens = []
      .concat(project.id)
      .concat(project.title)
      .concat(project.aliases || [])
      .map(normalizeToken)
      .filter(Boolean);

    const scoredAssets = projectAssetCatalog
      .map(function (assetPath) {
        return {
          path: assetPath,
          score: rankProjectAsset(assetPath, matchingTokens)
        };
      })
      .filter(function (asset) {
        return asset.score > 0;
      })
      .sort(function (left, right) {
        if (left.score !== right.score) {
          return right.score - left.score;
        }

        return left.path.localeCompare(right.path);
      });

    const bestScore = scoredAssets.length ? scoredAssets[0].score : 0;
    const matchedPaths = scoredAssets
      .filter(function (asset) {
        if (bestScore >= 90) {
          return asset.score >= 80;
        }

        if (bestScore >= 80) {
          return asset.score >= 80;
        }

        return asset.score >= bestScore - 10;
      })
      .map(function (asset) {
        return asset.path;
      });
    const mergedImages = mergeUniqueAssets(project.images || [], matchedPaths, project.title);
    const imagePaths = mergedImages.map(function (image) {
      return image.src;
    });

    return Object.assign({}, project, {
      images: mergedImages,
      logo: project.logo || pickPrimaryAsset(imagePaths)
    });
  });

  const projectMap = projects.reduce(function (map, project) {
    map[project.id] = project;
    return map;
  }, {});

  window.projectCatalog = {
    all: projects,
    featured: projects.filter(function (project) {
      return project.featured;
    }),
    assetCatalog: projectAssetCatalog.slice(),
    getById: function (projectId) {
      return projectMap[projectId] || null;
    }
  };
})();
