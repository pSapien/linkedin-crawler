const selectors = {
  login: {
    email: '#session_key',
    password: '#session_password',
    button: '.sign-in-form__submit-button',
  },
  manageAccounts: {
    skipButton: 'secondary-action-new',
  },
  home: {
    avatarName: '.profile-rail-card__actor-link',
  },
  profile: {
    peopleWhoViewedLink: '.pv-profile-section__section-info',
    company: '.pv-top-card--experience-list-item',
    name: '.pv-top-card--list',
    country: '.pv-top-card--list',
  },
};


module.exports = selectors;

