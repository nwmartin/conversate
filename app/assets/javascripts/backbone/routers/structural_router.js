Structural.Router = new (Backbone.Router.extend({
  routes: {
    '': 'index',
    'conversation/:slug/:id': 'conversation',
    'folder/:slug/:id': 'folder',
    'profile': 'profile',
    'admin': 'admin',
    'people': 'people',
    'people/contact-lists/:id': 'contactList'
  },
  index: function() {
    this._isActionFocused = false;
    Structural.showWaterCooler({ folder: Structural._folders.at(0).id });
  },
  conversation: function(slug, id, params) {
    // Due to some slightly unresolved technical and semantic debt, the UI
    // query string says "message" while the code here is all about actions.
    // This should be the only place in the backbone code that talks about
    // messages like this.
    var actionId = params ? params['message'] : undefined;
    this._isActionFocused = actionId !== undefined;

    Structural.showWaterCooler({
      conversation: id,
      action: actionId
    });

    var suffix = '/' + id;
    if (actionId) {
      suffix += '?message=' + actionId;
    }
    this._fixSlug('conversation/', slug, suffix, Structural._conversation.get('title'));
  },
  folder: function(slug, id) {
    this._isActionFocused = false;
    Structural.showWaterCooler({ folder: id });
    this._fixSlug('folder/', slug, '/' + id, Structural._folders.get(id|0).get('name'));
  },
  profile: function() { },
  admin: function() { },
  people: function() {
    Structural.showPeople({});
  },
  contactList: function(id) {
    Structural.showPeople({
      contactListId: id
    });
  },

  isActionFocused: function() {
    return this._isActionFocused;
  },

  _folderIdForConversation: function(conversation) {
    if (_.contains(conversation.get('folder_ids'), Structural._folder.id)) {
      return Structural._folder.id;
    }
    return conversation.get('folder_ids')[0];
  },

  initialize: function(options) {
  },
  slugify: function(s) {
    return encodeURIComponent(s.toLowerCase()
                               .replace(/[ _]/g, '-')
                               .replace(/[^a-zA-Z0-9-]/g, ''));
  },

  /* *Path functions are suitable for passing to Structural.Router.navigate,
     while *Href functions are suitable for including in href attributes. */
  indexPath: function() {
    return '';
  },
  conversationPath: function(conversation) {
    return 'conversation/' +
           this.slugify(conversation.get('title')) +
           '/' + conversation.id;
  },
  actionPath: function(conversation, action) {
    return this.conversationPath(conversation) +
           '?message=' + action.id;
  },
  folderPath: function(folder) {
    return 'folder/' +
           this.slugify(folder.get('name')) +
           '/' + folder.id;
  },
  adminPath: function() {
    return 'admin';
  },
  profilePath: function() {
    return 'profile';
  },
  peoplePath: function() {
    return 'people';
  },
  contactListPath: function(contactList) {
    return this.peoplePath() + '/contact-lists/' + contactList.id;
  },
  logoutPath: function() {
    return 'session/logout';
  },
  tourPath: function() {
    return 'tour';
  },
  userLookupPath: function(email) {
    return 'api/v0/users/lookup?email=' + email;
  },

  indexHref: function() {
    return '/' + this.indexPath();
  },
  conversationHref: function(conversation) {
    return '/' + this.conversationPath();
  },
  actionHref: function(conversation, action) {
    return '/' + this.messagePath(conversation, action);
  },
  folderHref: function(folder) {
    return '/' + this.folderPath(folder);
  },
  adminHref: function() {
    return '/' + this.adminPath();
  },
  profileHref: function() {
    return '/' + this.profilePath();
  },
  peopleHref: function() {
    return '/' + this.peoplePath();
  },
  contactListHref: function(contactList) {
    return '/' + this.contactListPath(contactList);
  },
  logoutHref: function() {
    return '/' + this.logoutPath();
  },
  tourHref: function() {
    return '/' + this.tourPath();
  },
  userLookupHref: function(email) {
    return '/' + this.userLookupPath(email);
  },

  _fixSlug: function(prefix, slug, suffix, correct) {
    var correctSlug = this.slugify(correct);
    if (slug !== correctSlug) {
      this.navigate(prefix + correctSlug + suffix, {replace: true});
    }
  }
}))();
